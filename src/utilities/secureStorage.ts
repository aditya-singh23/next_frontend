import { encrypt, decrypt } from './encryption';
import { User } from '@interfaces/index';
import { STORAGE_KEYS } from '@constants/index';

/**
 * Secure storage utility for sensitive data
 * Encrypts data before storing in localStorage
 */

class SecureStorage {
  private isClient = typeof window !== 'undefined';

  /**

   */
  setToken(token: string): void {
    if (!this.isClient) return;

    try {
      const encryptedToken = encrypt(token);
      localStorage.setItem(STORAGE_KEYS.TOKEN, encryptedToken);

      // Also set as cookie for middleware access
      document.cookie = `auth_token=${token}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax`;
    } catch (error) {
      console.error('Error setting token:', error);
    }
  }

  /**
   * Get decrypted token from storage
   */
  getToken(): string | null {
    if (!this.isClient) return null;

    try {
      const encryptedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!encryptedToken) return null;

      return decrypt(encryptedToken);
    } catch (error) {
      console.error('Error getting token:', error);
      this.removeToken();
      return null;
    }
  }

  /**
   * Remove token from storage and cookie
   */
  removeToken(): void {
    if (!this.isClient) return;

    try {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);

      // Also remove cookie
      document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }

  /**
   * Set encrypted user data in storage
   */
  setUser(user: User): void {
    if (!this.isClient) return;

    try {
      const userString = JSON.stringify(user);
      const encryptedUser = encrypt(userString);
      localStorage.setItem(STORAGE_KEYS.USER, encryptedUser);
    } catch (error) {
      console.error('Error setting user:', error);
    }
  }

  /**
   * Get decrypted user data from storage
   */
  getUser(): User | null {
    if (!this.isClient) return null;

    try {
      const encryptedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (!encryptedUser) return null;

      const decryptedUser = decrypt(encryptedUser);
      return JSON.parse(decryptedUser) as User;
    } catch (error) {
      console.error('Error getting user:', error);
      this.removeUser();
      return null;
    }
  }

  /**
   * Remove user data from storage
   */
  removeUser(): void {
    if (!this.isClient) return;

    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Error removing user:', error);
    }
  }

  /**
   * Clear all authentication data
   */
  clearAuthData(): void {
    if (!this.isClient) return;

    try {
      this.removeToken();
      this.removeUser();
      localStorage.removeItem(STORAGE_KEYS.PERSIST_ROOT);
      localStorage.removeItem(STORAGE_KEYS.PERSIST_AUTH);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }
}

// Export singleton instance
const secureStorage = new SecureStorage();
export default secureStorage;
