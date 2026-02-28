import { api } from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fname: string;
  lname: string;
  email: string;
  password: string;
  password2: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  emailVerified: boolean;
  message: string;
}

export const authService = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  register: (userData: RegisterRequest) => 
    api.post('/auth/register', userData),
  
  verifyEmail: (token: string) => 
    api.get(`/auth/verify-email?token=${token}`),
  
  resendVerification: (email: string) => 
    api.post('/auth/resend-verification', { email }),
  
  logout: () => 
    api.post('/auth/logout'),
  
  refreshToken: (refreshToken: string) => 
    api.post('/auth/refresh', { refreshToken })
};