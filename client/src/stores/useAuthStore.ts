import { create } from 'zustand';
import type { User } from '../types/auth';
import { authApi } from '../services/api';
import type { LoginFormData, RegisterFormData } from '../validations/authValidation';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  login: (credentials: LoginFormData) => Promise<boolean>;
  registerUser: (data: Omit<RegisterFormData, 'confirmPassword'>) => Promise<boolean>;
  googleLogin: (credential: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(credentials);
      if (response.status === 'success' && response.data?.user) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      }
      throw new Error('Login failed: Invalid server response');
    } catch (err: any) {
      set({
        error: err.message || 'Failed to login',
        isLoading: false,
        isAuthenticated: false,
        user: null,
      });
      return false;
    }
  },

  registerUser: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.register(data);
      if (response.status === 'success' && response.data?.user) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      }
      throw new Error('Registration failed');
    } catch (err: any) {
      set({
        error: err.message || 'Failed to register account',
        isLoading: false,
        isAuthenticated: false,
        user: null,
      });
      return false;
    }
  },

  googleLogin: async (credential) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.googleLogin(credential);
      if (response.status === 'success' && response.data?.user) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      }
      throw new Error('Google Authentication failed');
    } catch (err: any) {
      set({
        error: err.message || 'Google Login failed',
        isLoading: false,
      });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authApi.logout();
    } catch (err) {
      console.warn('Logout API failed, clearing local state anyway', err);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const response = await authApi.getMe();
      if (response.status === 'success' && response.data?.user) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isInitialized: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isInitialized: true,
          isLoading: false,
        });
      }
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isInitialized: true,
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
