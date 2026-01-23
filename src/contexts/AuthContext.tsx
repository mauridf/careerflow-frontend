import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginRequest, RegisterRequest, LoginResponse, RegisterResponse } from '../types';
import { api } from '../api/apiClient';
import { API_ENDPOINTS, APP_CONSTANTS } from '../utils/constants';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const loadAuthData = () => {
      try {
        const storedToken = localStorage.getItem(APP_CONSTANTS.TOKEN_KEY);
        const storedUser = localStorage.getItem(APP_CONSTANTS.USER_KEY);
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Erro ao carregar dados de autenticação:', err);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  // Função de login
  const login = async (credentials: LoginRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
      
      // Salvar token e usuário
      localStorage.setItem(APP_CONSTANTS.TOKEN_KEY, response.token);
      localStorage.setItem(APP_CONSTANTS.USER_KEY, JSON.stringify(response.user));
      
      setToken(response.token);
      setUser(response.user);
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Função de registro
  const register = async (userData: RegisterRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
      
      // Após registro bem-sucedido, podemos fazer login automaticamente
      // ou redirecionar para a página de login
      console.log('Usuário registrado com sucesso:', response);
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao criar conta. Tente novamente.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem(APP_CONSTANTS.TOKEN_KEY);
    localStorage.removeItem(APP_CONSTANTS.USER_KEY);
    localStorage.removeItem(APP_CONSTANTS.TOKEN_EXPIRY_KEY);
    
    setToken(null);
    setUser(null);
    setError(null);
    
    // Redirecionar para a página inicial
    window.location.href = '/';
  };

  // Limpar erros
  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar o contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};