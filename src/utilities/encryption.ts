import CryptoJS from 'crypto-js';

/**
 * Encryption utility for secure data storage
 * Uses AES encryption with CryptoJS
 */

const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-secret-key-change-me';

/**
 * Encrypt data using AES encryption
 */
export const encrypt = (data: string): string => {
  try {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt data using AES decryption
 */
export const decrypt = (encryptedData: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      throw new Error('Decryption failed - invalid data');
    }

    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

/**
 * Hash data using SHA256
 */
export const hash = (data: string): string => {
  return CryptoJS.SHA256(data).toString();
};

/**
 * Generate a random string
 */
export const generateRandomString = (length: number = 32): string => {
  return CryptoJS.lib.WordArray.random(length).toString();
};

export default {
  encrypt,
  decrypt,
  hash,
  generateRandomString,
};
