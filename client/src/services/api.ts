import type { AuthResponse, User } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiError extends Error {
  status?: string;
  statusCode?: number;

  constructor(message: string, statusCode?: number, status?: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.status = status;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || `HTTP error! Status: ${response.status}`;
      throw new ApiError(errorMessage, response.status, data?.status);
    }

    return data as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || 'Network error occurred. Please try again.');
  }
}

export const authApi = {
  register: async (payload: { name: string; email: string; password: string; role: string }) => {
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  login: async (payload: { email: string; password: string }) => {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  googleLogin: async (credential: string) => {
    return request<AuthResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    });
  },

  getMe: async () => {
    return request<{ status: string; data: { user: User } }>('/auth/me', {
      method: 'GET',
    });
  },

  logout: async () => {
    return request<{ status: string; message: string }>('/auth/logout', {
      method: 'POST',
    });
  },
};
