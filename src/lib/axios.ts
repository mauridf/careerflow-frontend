import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, TOKEN_KEYS } from './constants';
import { ApiError } from '@/types';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Flag para evitar múltiplos refresh tokens simultâneos
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });
  failedQueue = [];
}

function getStoredTokens(): { accessToken: string | null; refreshToken: string | null } {
  if (typeof window === 'undefined') {
    return { accessToken: null, refreshToken: null };
  }
  return {
    accessToken: localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN),
    refreshToken: localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN),
  };
}

function setStoredTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
}

function clearStoredTokens(): void {
  localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(TOKEN_KEYS.USER);
  localStorage.removeItem(TOKEN_KEYS.ROLE);
  localStorage.removeItem('careerflow-auth');
  document.cookie = 'accessToken=; path=/; max-age=0';
  document.cookie = 'userRole=; path=/; max-age=0';
}

// Request interceptor - Adiciona token JWT em todas as requisições
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = getStoredTokens();

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Trata erros e refresh token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Se não há resposta (rede indisponível, servidor offline)
    if (!error.response && !originalRequest._retry) {
      const isAuthRoute = originalRequest.url?.includes('/auth/');
      if (!isAuthRoute) {
        const { accessToken } = getStoredTokens();
        if (accessToken) {
          originalRequest._retry = true;
          clearStoredTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      }
      return Promise.reject(error);
    }

    // Se for erro 401 e não for tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Não tenta refresh para rotas de auth (login, register, refresh)
      const isAuthRoute = originalRequest.url?.includes('/auth/');
      if (isAuthRoute && !originalRequest.url?.includes('/auth/refresh')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Se já está renovando, enfileira a requisição
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const { accessToken, refreshToken } = getStoredTokens();

      if (!accessToken || !refreshToken) {
        isRefreshing = false;
        clearStoredTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      try {
        // Tenta renovar o token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          accessToken,
          refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data.data;

        setStoredTokens(newAccessToken, newRefreshToken);
        document.cookie = `accessToken=${newAccessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        processQueue(null, newAccessToken);

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearStoredTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Função auxiliar para extrair mensagem de erro da API
export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError | undefined;
    if (apiError?.error) {
      // Se houver detalhes de campos, retorna o primeiro
      if (apiError.error.details && apiError.error.details.length > 0) {
        return apiError.error.details[0].message;
      }
      return apiError.error.message;
    }
    if (error.response?.status === 429) {
      return 'Muitas requisições. Aguarde um momento e tente novamente.';
    }
    if (error.response?.status === 500) {
      return 'Erro interno do servidor. Tente novamente mais tarde.';
    }
    if (error.code === 'ECONNABORTED') {
      return 'O servidor demorou muito para responder. Verifique sua conexão.';
    }
    if (!error.response) {
      return 'Não foi possível conectar ao servidor. Verifique sua conexão.';
    }
  }
  return 'Ocorreu um erro inesperado. Tente novamente.';
}

export default api;