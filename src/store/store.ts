import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  PersistConfig,
  WebStorage,
} from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import authReducer from './slices/authSlice';
import { encryptTransform } from './encryptedStorage';
import { AuthState } from '@interfaces/index';

/**
 * Redux Store Configuration
 * Includes Redux Persist for state persistence
 */

/**
 * Storage interface for redux-persist
 */
interface NoopStorage {
  getItem(key: string): Promise<null>;
  setItem(key: string, value: string): Promise<string>;
  removeItem(key: string): Promise<void>;
}

/**
 * Create a noop storage for SSR (Server-Side Rendering)
 * Returns a storage object that does nothing, used when window is undefined
 */
const createNoopStorage = (): NoopStorage => {
  return {
    getItem(_key: string): Promise<null> {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string): Promise<string> {
      return Promise.resolve(value);
    },
    removeItem(_key: string): Promise<void> {
      return Promise.resolve();
    },
  };
};

// Use noop storage on server, real storage on client
const storage: WebStorage | NoopStorage =
  typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

/**
 * Persist configuration with encryption
 * Only persists specific auth fields and encrypts all data
 */
const persistConfig: PersistConfig<AuthState> = {
  key: 'root',
  version: 1,
  storage: storage as WebStorage,
  whitelist: ['user', 'token', 'isAuthenticated'] as Array<keyof AuthState>, // Only persist these fields
  transforms: [encryptTransform], // Encrypt all persisted data
};

// Create persisted reducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// Configure store
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
