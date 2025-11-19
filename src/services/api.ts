import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import {
  User,
  AuthResponse,
  LoginRequest,
  SignupRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ApiResponse,
  PaginatedResponse,
  NetworkError,
  ApiError,
} from '@interfaces/index';
import { apiConfig } from '@config/api.config';
import secureStorage from '@utilities/secureStorage';
import { ROUTES } from '@constants/index';

/**
 * API Service for handling HTTP requests to the backend
 * Provides authentication and user management functionality with pagination
 */

// Create axios instance with default configuration
const api: AxiosInstance = axios.create(apiConfig);

// Request interceptor - runs before every request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add authorization token to requests if available
    const token = secureStorage.getToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor - runs after every response
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  error => {
    // Handle unauthorized responses
    if (error.response?.status === 401) {
      // Clear authentication data
      secureStorage.clearAuthData();

      // Redirect to login page (only on client side)
      if (typeof window !== 'undefined') {
        window.location.href = ROUTES.LOGIN;
      }
    }

    return Promise.reject(error);
  }
);

// Authentication API functions
export const authAPI = {
  /**
   * User signup/registration
   */
  signup: async (userData: SignupRequest): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/signup', userData);
      return response.data;
    } catch (error) {
      const apiError: ApiError = (error as NetworkError).response?.data || {
        message: 'Network error occurred',
      };
      throw apiError;
    }
  },

  /**
   * User login/authentication
   */
  login: async (credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      return response.data;
    } catch (error) {
      const apiError: ApiError = (error as NetworkError).response?.data || {
        message: 'Network error occurred',
      };
      throw apiError;
    }
  },

  /**
   * Get users with pagination
   */
  getUsers: async (page: number = 1, limit: number = 20): Promise<PaginatedResponse<User>> => {
    try {
      const response = await api.get<PaginatedResponse<User>>('/auth/users', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      const apiError: ApiError = (error as NetworkError).response?.data || {
        message: 'Network error occurred',
      };
      throw apiError;
    }
  },

  /**
   * Request password reset (sends OTP to email)
   */
  forgotPassword: async (emailData: ForgotPasswordRequest): Promise<ApiResponse> => {
    try {
      const response = await api.post<ApiResponse>('/auth/forgot-password', emailData);
      return response.data;
    } catch (error) {
      const apiError: ApiError = (error as NetworkError).response?.data || {
        message: 'Network error occurred',
      };
      throw apiError;
    }
  },

  /**
   * Reset password with OTP
   */
  resetPassword: async (resetData: ResetPasswordRequest): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/reset-password', resetData);
      return response.data;
    } catch (error) {
      const apiError: ApiError = (error as NetworkError).response?.data || {
        message: 'Network error occurred',
      };
      throw apiError;
    }
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await api.get<ApiResponse<User>>('/auth/profile');
      return response.data;
    } catch (error) {
      const apiError: ApiError = (error as NetworkError).response?.data || {
        message: 'Network error occurred',
      };
      throw apiError;
    }
  },

  /**
   * Check OAuth configuration status
   */
  getOAuthStatus: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get<ApiResponse>('/auth/oauth/status');
      return response.data;
    } catch (error) {
      const apiError: ApiError = (error as NetworkError).response?.data || {
        message: 'Network error occurred',
      };
      throw apiError;
    }
  },

  /**
   * Handle Google OAuth success
   */
  googleOAuthSuccess: async (googleToken: string): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/google/success', {
        googleToken,
      });
      return response.data;
    } catch (error) {
      const apiError: ApiError = (error as NetworkError).response?.data || {
        message: 'Network error occurred',
      };
      throw apiError;
    }
  },
};

export default api;
