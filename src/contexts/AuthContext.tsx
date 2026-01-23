import { createContext, useState, useEffect, type ReactNode } from 'react';
import { type User, type LoginRequest, type RegisterRequest } from '../types';
import { authService } from '../api/authService';
import { APP_CONSTANTS } from '../utils/constants';
import type { AuthContextType } from './types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
      const loginData = await authService.login(credentials);
      
      // Salvar token e usuário
      localStorage.setItem(APP_CONSTANTS.TOKEN_KEY, loginData.token);
      localStorage.setItem(APP_CONSTANTS.USER_KEY, JSON.stringify(loginData.user));
      
      setToken(loginData.token);
      setUser(loginData.user);
      
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.';
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
      const registerData = await authService.register(userData);
      
      console.log('Usuário registrado com sucesso:', registerData);
      
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Erro ao criar conta. Tente novamente.';
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