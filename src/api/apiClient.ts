import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';
import { APP_CONSTANTS } from '../utils/constants';

// Configuração base da API
const getApiBaseUrl = (): string => {
  const environment = import.meta.env.VITE_ENVIRONMENT || 'development';
  const isProduction = environment === 'production';
  
  const productionUrl = import.meta.env.VITE_API_URL_PRODUCTION;
  const localUrl = import.meta.env.VITE_API_URL_LOCAL;
  
  console.log(`🌍 Environment: ${environment}`);
  console.log(`🔗 Production URL: ${productionUrl}`);
  console.log(`🔗 Local URL: ${localUrl}`);
  console.log(`🎯 Using: ${isProduction ? productionUrl : localUrl}`);
  
  if (isProduction) {
    return productionUrl || 'https://careerflow-api-g12h.onrender.com/api';
  }
  
  // development ou qualquer outro
  return localUrl || 'https://localhost:7051/api';
};

// Criando instância do Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000, // Aumentei para 15 segundos
  withCredentials: false, // Importante para CORS
});

// Interceptor para requisições
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Aqui podemos adicionar o token de autenticação no futuro
    const token = localStorage.getItem(APP_CONSTANTS.TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`🔵 [API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    console.log('📦 Request data:', config.data);
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
    console.log('📦 Response data:', response.data);
    return response;
  },
  (error: AxiosError) => {
    // Tratamento centralizado de erros
    console.error('🔴 [API Error Details]', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      baseURL: error.config?.baseURL,
      fullURL: `${error.config?.baseURL}${error.config?.url}`,
    });
    
    if (error.response) {
      // O servidor respondeu com um status de erro
      switch (error.response.status) {
        case 401:
          // Não autorizado - redirecionar para login
          localStorage.removeItem(APP_CONSTANTS.TOKEN_KEY);
          localStorage.removeItem(APP_CONSTANTS.USER_KEY);
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
      console.error('🔴 [API No Response] - Possíveis causas:', {
        request: error.request,
        message: '1. API offline 2. CORS issue 3. Network problem 4. Wrong URL',
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      });
    } else {
      // Algo aconteceu na configuração da requisição
      console.error('🔴 [API Request Setup Error]', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Funções utilitárias para métodos HTTP
export const api = {
  get: <T>(url: string, config?: InternalAxiosRequestConfig) => 
    apiClient.get<T>(url, config).then(res => res.data),
  
  post: <T>(url: string, data?: unknown, config?: InternalAxiosRequestConfig) => 
    apiClient.post<T>(url, data, config).then(res => res.data),
  
  put: <T>(url: string, data?: unknown, config?: InternalAxiosRequestConfig) => 
    apiClient.put<T>(url, data, config).then(res => res.data),
  
  delete: <T>(url: string, config?: InternalAxiosRequestConfig) => 
    apiClient.delete<T>(url, config).then(res => res.data),
  
  patch: <T>(url: string, data?: unknown, config?: InternalAxiosRequestConfig) => 
    apiClient.patch<T>(url, data, config).then(res => res.data),
};

export default apiClient;