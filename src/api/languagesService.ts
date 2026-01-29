import { api } from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';
import type { Language, LanguageRequest } from '../types';

export const languagesService = {
  // Buscar todas as languages do usuário
  getLanguages: async (level?: string): Promise<Language[]> => {
    let url = API_ENDPOINTS.LANGUAGES.BASE;
    if (level) {
      url += `?level=${encodeURIComponent(level)}`;
    }
    const response = await api.get<Language[]>(url);
    return response;
  },

  // Buscar language por ID
  getLanguageById: async (id: string): Promise<Language> => {
    const response = await api.get<Language>(`${API_ENDPOINTS.LANGUAGES.BASE}/${id}`);
    return response;
  },

  // Cadastrar nova language
  createLanguage: async (data: LanguageRequest): Promise<Language> => {
    const response = await api.post<Language>(API_ENDPOINTS.LANGUAGES.BASE, data);
    return response;
  },

  // Atualizar language
  updateLanguage: async (id: string, data: LanguageRequest): Promise<Language> => {
    const response = await api.put<Language>(`${API_ENDPOINTS.LANGUAGES.BASE}/${id}`, data);
    return response;
  },

  // Excluir language
  deleteLanguage: async (id: string): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.LANGUAGES.BASE}/${id}`);
  },
};