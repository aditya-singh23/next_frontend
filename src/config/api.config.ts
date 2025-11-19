import { API_BASE_URL } from '@constants/index';

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true, // Enable sending cookies and credentials
  headers: {
    'Content-Type': 'application/json',
  },
};

export default apiConfig;
