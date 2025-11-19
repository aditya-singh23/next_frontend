import { STORAGE_KEYS } from '@constants/index';

/**
 * Clear all storage data
 * Useful for logout and cleanup operations
 */
export const clearAllStorage = (): void => {
  if (typeof window === 'undefined') return;

  try {
    // Clear specific keys
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });

    // Clear session storage
    sessionStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

/**
 * Clear only authentication-related storage
 */
export const clearAuthStorage = (): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.PERSIST_ROOT);
    localStorage.removeItem(STORAGE_KEYS.PERSIST_AUTH);
  } catch (error) {
    console.error('Error clearing auth storage:', error);
  }
};

export default {
  clearAllStorage,
  clearAuthStorage,
};
