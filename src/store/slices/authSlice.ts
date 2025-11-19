import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  User,
  AuthResponse,
  LoginRequest,
  SignupRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ApiResponse,
  NetworkError,
  ApiErrorResponse,
  AuthState,
} from '@interfaces/index';
import { authAPI } from '@services/api';
import secureStorage from '@utilities/secureStorage';
import { USERS_PER_PAGE } from '@constants/index';

/**
 * Helper function to extract error message from network errors
 */
function extractErrorMessage(
  error: Error | NetworkError | ApiErrorResponse,
  defaultMessage: string
): string {
  if ('message' in error && typeof error.message === 'string') {
    return error.message;
  }

  if ('response' in error && error.response?.data?.message) {
    return error.response.data.message;
  }

  if ('errors' in error && Array.isArray(error.errors)) {
    return error.errors.join(', ');
  }

  return defaultMessage;
}

// ====================================================================
// ASYNC THUNKS - Handle API calls and async operations
// ====================================================================

// Signup async thunk
export const signupUser = createAsyncThunk<
  AuthResponse,
  SignupRequest & { confirmPassword: string },
  { rejectValue: string }
>('auth/signup', async (userData, { rejectWithValue }) => {
  try {
    const { confirmPassword, ...backendData } = userData;
    const response = await authAPI.signup(backendData);

    // Check if signup was successful
    if (!response.success || !response.data) {
      return rejectWithValue(response.message || 'Signup failed');
    }

    // Store token and user data
    if (response.data.token) {
      secureStorage.setToken(response.data.token);
      secureStorage.setUser(response.data.user);
    }

    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    return rejectWithValue(extractErrorMessage(error as NetworkError, 'Signup failed'));
  }
});

// Login async thunk
export const loginUser = createAsyncThunk<AuthResponse, LoginRequest, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);

      // Check if login was successful
      if (!response.success || !response.data) {
        return rejectWithValue(response.message || 'Login failed');
      }

      // Store token and user data
      if (response.data.token) {
        secureStorage.setToken(response.data.token);
        secureStorage.setUser(response.data.user);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error as NetworkError, 'Login failed'));
    }
  }
);

// Forgot password async thunk
export const forgotPassword = createAsyncThunk<
  ApiResponse,
  ForgotPasswordRequest,
  { rejectValue: string }
>('auth/forgotPassword', async (emailData, { rejectWithValue }) => {
  try {
    const response = await authAPI.forgotPassword(emailData);
    return response;
  } catch (error) {
    return rejectWithValue(
      extractErrorMessage(error as NetworkError, 'Failed to send reset email')
    );
  }
});

// Reset password async thunk
export const resetPassword = createAsyncThunk<
  ApiResponse<AuthResponse>,
  ResetPasswordRequest,
  { rejectValue: string }
>('auth/resetPassword', async (resetData, { rejectWithValue }) => {
  try {
    const response = await authAPI.resetPassword(resetData);
    return response;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error as NetworkError, 'Failed to reset password'));
  }
});

// Get users async thunk with pagination
export const getUsers = createAsyncThunk<
  { users: User[]; total: number; page: number; hasMore: boolean },
  { page?: number; limit?: number },
  { rejectValue: string }
>('auth/getUsers', async ({ page = 1, limit = USERS_PER_PAGE }, { rejectWithValue }) => {
  try {
    const response = await authAPI.getUsers(page, limit);

    // Handle both paginated and non-paginated responses
    if (response.data && 'items' in response.data) {
      return {
        users: response.data.items,
        total: response.data.total,
        page: response.data.page,
        hasMore: response.data.hasMore,
      };
    }

    // Fallback for non-paginated response
    const users = (response.data as unknown as User[]) || [];
    return {
      users,
      total: users.length,
      page: 1,
      hasMore: false,
    };
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error as NetworkError, 'Failed to fetch users'));
  }
});

// Load more users async thunk
export const loadMoreUsers = createAsyncThunk<
  { users: User[]; total: number; page: number; hasMore: boolean },
  { page: number; limit?: number },
  { rejectValue: string }
>('auth/loadMoreUsers', async ({ page, limit = USERS_PER_PAGE }, { rejectWithValue }) => {
  try {
    const response = await authAPI.getUsers(page, limit);

    if (response.data && 'items' in response.data) {
      return {
        users: response.data.items,
        total: response.data.total,
        page: response.data.page,
        hasMore: response.data.hasMore,
      };
    }

    return {
      users: [],
      total: 0,
      page,
      hasMore: false,
    };
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error as NetworkError, 'Failed to load more users'));
  }
});

// Google OAuth success async thunk
export const googleOAuthSuccess = createAsyncThunk<
  AuthResponse,
  { token: string; user: User },
  { rejectValue: string }
>('auth/googleOAuthSuccess', async ({ token, user }, { rejectWithValue }) => {
  try {
    if (token && user) {
      secureStorage.setToken(token);
      secureStorage.setUser(user);
    }

    return { token, user };
  } catch (error) {
    return rejectWithValue(
      extractErrorMessage(error as NetworkError, 'Failed to process Google OAuth success')
    );
  }
});

// ====================================================================
// INITIAL STATE
// ====================================================================

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  users: [],
  usersTotal: 0,
  usersPage: 1,
  usersHasMore: false,
  forgotPasswordMessage: null,
  resetPasswordMessage: null,
};

// ====================================================================
// AUTH SLICE
// ====================================================================

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    // Logout action
    logout: state => {
      secureStorage.clearAuthData();

      if (typeof window !== 'undefined') {
        localStorage.removeItem('persist:root');
        localStorage.removeItem('persist:auth');
      }

      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.users = [];
      state.usersTotal = 0;
      state.usersPage = 1;
      state.usersHasMore = false;
      state.forgotPasswordMessage = null;
      state.resetPasswordMessage = null;
    },

    // Clear errors
    clearErrors: state => {
      state.error = null;
    },

    // Clear messages
    clearMessages: state => {
      state.forgotPasswordMessage = null;
      state.resetPasswordMessage = null;
    },

    // Load user from storage
    loadUserFromStorage: state => {
      const token = secureStorage.getToken();
      const user = secureStorage.getUser();

      if (token && user) {
        try {
          state.user = user;
          state.token = token;
          state.isAuthenticated = true;
        } catch (error) {
          secureStorage.clearAuthData();
        }
      }
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },

  extraReducers: builder => {
    // Signup cases
    builder
      .addCase(signupUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Signup failed';
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // Login cases
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // Forgot password cases
      .addCase(forgotPassword.pending, state => {
        state.isLoading = true;
        state.error = null;
        state.forgotPasswordMessage = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.forgotPasswordMessage = action.payload.message;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to send reset email';
        state.forgotPasswordMessage = null;
      })

      // Reset password cases
      .addCase(resetPassword.pending, state => {
        state.isLoading = true;
        state.error = null;
        state.resetPasswordMessage = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resetPasswordMessage = action.payload.message;
        state.error = null;

        if (action.payload.data) {
          state.user = action.payload.data.user;
          state.token = action.payload.data.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to reset password';
        state.resetPasswordMessage = null;
      })

      // Get users cases
      .addCase(getUsers.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
        state.usersTotal = action.payload.total;
        state.usersPage = action.payload.page;
        state.usersHasMore = action.payload.hasMore;
        state.error = null;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch users';
      })

      // Load more users cases
      .addCase(loadMoreUsers.pending, state => {
        state.isLoading = true;
      })
      .addCase(loadMoreUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = [...state.users, ...action.payload.users];
        state.usersTotal = action.payload.total;
        state.usersPage = action.payload.page;
        state.usersHasMore = action.payload.hasMore;
      })
      .addCase(loadMoreUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to load more users';
      })

      // Google OAuth success cases
      .addCase(googleOAuthSuccess.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleOAuthSuccess.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(googleOAuthSuccess.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to process Google OAuth success';
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

// Export actions
export const { logout, clearErrors, clearMessages, loadUserFromStorage, setLoading, setError } =
  authSlice.actions;

// Export reducer
export default authSlice.reducer;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectError = (state: { auth: AuthState }) => state.auth.error;
export const selectUsers = (state: { auth: AuthState }) => state.auth.users;
export const selectUsersHasMore = (state: { auth: AuthState }) => state.auth.usersHasMore;
export const selectUsersPage = (state: { auth: AuthState }) => state.auth.usersPage;
