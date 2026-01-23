import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { APP_CONSTANTS } from '../utils/constants';

// Definindo os tipos para as respostas da API
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
}

// Configuração base da API
const getApiBaseUrl = (): string => {
  const environment = import.meta.env.VITE_ENVIRONMENT || 'development';
  
  if (environment === 'production') {
    return import.meta.env.VITE_API_URL_PRODUCTION || 'https://careerflow-api-g12h.onrender.com/api';
  }
  
  // development ou qualquer outro
  return import.meta.env.VITE_API_URL_LOCAL || 'http://localhost:7051/api';
};

// Criando instância do Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para requisições
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // Usando a chave correta da constante
    const token = localStorage.getItem(APP_CONSTANTS.TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`🔵 [API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error: AxiosError) => {
    console.error('🔴 [API Request Error]', error);
    return Promise.reject(error);
  }
);

// Interceptor para respostas
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`🟢 [API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    // Tratamento centralizado de erros
    if (error.response) {
      // O servidor respondeu com um status de erro
      console.error('🔴 [API Response Error]', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
      
      // Podemos tratar erros específicos aqui
      switch (error.response.status) {
        case 401:
          // Não autorizado - redirecionar para login
          localStorage.removeItem('access_token');
          window.location.href = '/login';
          break;
        case 403:
          console.warn('Acesso proibido');
          break;
        case 404:
          console.warn('Recurso não encontrado');
          break;
        case 500:
          console.error('Erro interno do servidor');
          break;
      }
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('🔴 [API No Response]', error.request);
    } else {
      // Algo aconteceu na configuração da requisição
      console.error('🔴 [API Request Setup Error]', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Funções utilitárias para métodos HTTP
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    apiClient.get<ApiResponse<T>>(url, config).then(res => res.data),
  
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.post<ApiResponse<T>>(url, data, config).then(res => res.data),
  
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.put<ApiResponse<T>>(url, data, config).then(res => res.data),
  
  delete: <T>(url: string, config?: AxiosRequestConfig) => 
    apiClient.delete<ApiResponse<T>>(url, config).then(res => res.data),
  
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.patch<ApiResponse<T>>(url, data, config).then(res => res.data),
};

export default apiClient;