import { api } from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';
import { LoginRequest, RegisterRequest, LoginResponse, RegisterResponse } from '../types';

export const authService = {
  // Login
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response;
  },

  // Registro
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
      return response.data; // Retorna true se email já existe
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      return false;
    }
  },

  // Validar token (para verificar se ainda é válido)
  validateToken: (): boolean => {
    const token = localStorage.getItem('careerflow_token');
    if (!token) return false;

    // Aqui você poderia verificar a expiração do token
    // Por enquanto, apenas verifica se existe
    return true;
  }
};