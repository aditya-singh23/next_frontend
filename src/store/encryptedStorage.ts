import CryptoJS from 'crypto-js';
import { createTransform } from 'redux-persist';
import { AuthState } from '@interfaces/index';

/**
 * Encrypted Storage for Redux Persist
 * Encrypts all persisted state data in localStorage
 */

// Encryption key - In production, use environment variable
const ENCRYPTION_KEY =
  process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'your-secret-key-change-in-production';

/**
 * Type for encrypted state (string after encryption)
 */
type EncryptedState = string;

/**
 * Encrypt data before storing
 */
export const encryptTransform = createTransform<AuthState, EncryptedState, AuthState, AuthState>(
  // Transform state on its way to being serialized and persisted
  (inboundState: AuthState): EncryptedState => {
    try {
      const stateString = JSON.stringify(inboundState);
      const encrypted = CryptoJS.AES.encrypt(stateString, ENCRYPTION_KEY).toString();
      return encrypted;
    } catch (error) {
      console.error('Error encrypting state:', error);
      // Return empty encrypted string on error
      return CryptoJS.AES.encrypt('{}', ENCRYPTION_KEY).toString();
    }
  },
  // Transform state being rehydrated
  (outboundState: EncryptedState | AuthState): AuthState => {
    try {
      if (typeof outboundState === 'string') {
        const decrypted = CryptoJS.AES.decrypt(outboundState, ENCRYPTION_KEY);
        const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
        const parsed = JSON.parse(decryptedString) as AuthState;
        return parsed;
      }
      // If already decrypted (shouldn't happen), return as-is
      return outboundState as AuthState;
    } catch (error) {
      console.error('Error decrypting state:', error);
      // Return initial state on error
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        users: [],
        usersTotal: 0,
        usersPage: 1,
        usersHasMore: true,
        forgotPasswordMessage: null,
        resetPasswordMessage: null,
      };
    }
  }
);
