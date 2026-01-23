import { api } from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';
import type { LoginRequest, RegisterRequest, LoginResponse, RegisterResponse } from '../types';

export const authService = {
  // Login - a API retorna LoginResponse diretamente, não dentro de ApiResponse
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response;
  },

  // Registro - a API retorna RegisterResponse diretamente
  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response;
  },

  // Verificar email (para validação em tempo real)
  checkEmail: async (email: string): Promise<boolean> => {
    try {
      const response = await api.get<boolean>(
        `${API_ENDPOINTS.AUTH.CHECK_EMAIL}?email=${encodeURIComponent(email)}`
      );
      return response; // A API retorna boolean diretamente
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      return false;
    }
  },

  // Validar token (para verificar se ainda é válido)
  validateToken: (): boolean => {
    const token = localStorage.getItem('careerflow_token');
    if (!token) return false;
    return true;
  }
};