import api from '@/lib/axios';
import {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  UserMeResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  MessageResponse,
} from '@/types';

export const authService = {
  register: async (data: RegisterRequest) => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest) => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data;
  },

  refreshToken: async (data: RefreshTokenRequest) => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/refresh', data);
    return response.data;
  },

  me: async () => {
    const response = await api.get<ApiResponse<UserMeResponse>>('/auth/me');
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest) => {
    const response = await api.post<ApiResponse<MessageResponse>>(
      '/auth/forgot-password',
      data
    );
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    const response = await api.post<ApiResponse<MessageResponse>>(
      '/auth/reset-password',
      data
    );
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest) => {
    const response = await api.post<ApiResponse<MessageResponse>>(
      '/auth/change-password',
      data
    );
    return response.data;
  },
};