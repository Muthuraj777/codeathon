export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'employee' | 'admin';
  avatar?: string;
}

export interface AuthResponse {
  status: 'success' | 'fail';
  message?: string;
  data?: {
    user: User;
    token?: string;
  };
}

export interface ErrorResponse {
  status: 'fail' | 'error';
  message: string;
  errors?: Record<string, string>;
}
