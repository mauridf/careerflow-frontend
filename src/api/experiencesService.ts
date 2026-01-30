import { api } from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';
import type { ProfessionalExperience, ProfessionalExperienceRequest } from '../types';

export const experiencesService = {
  // Buscar todas as experiences do usuário
  getExperiences: async (): Promise<ProfessionalExperience[]> => {
    const response = await api.get<ProfessionalExperience[]>(API_ENDPOINTS.EXPERIENCES.BASE);
    return response;
  },

  // Buscar experience por ID
  getExperienceById: async (id: string): Promise<ProfessionalExperience> => {
    const response = await api.get<ProfessionalExperience>(`${API_ENDPOINTS.EXPERIENCES.BASE}/${id}`);
    return response;
  },

  // Cadastrar nova experience
  createExperience: async (data: ProfessionalExperienceRequest): Promise<ProfessionalExperience> => {
    const requestData = {
      ...data,
      // Garantir que skillIds seja um array vazio se não for fornecido
      skillIds: data.skillIds || [],
    };

    const response = await api.post<ProfessionalExperience>(
      API_ENDPOINTS.EXPERIENCES.BASE,
      requestData
    );
    return response;
  },

  // Atualizar experience
  updateExperience: async (id: string, data: ProfessionalExperienceRequest): Promise<ProfessionalExperience> => {
    const requestData = {
      ...data,
      // Garantir que skillIds seja um array vazio se não for fornecido
      skillIds: data.skillIds || [],
    };

    const response = await api.put<ProfessionalExperience>(
      `${API_ENDPOINTS.EXPERIENCES.BASE}/${id}`,
      requestData
    );
    return response;
  },

  // Excluir experience
  deleteExperience: async (id: string): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.EXPERIENCES.BASE}/${id}`);
  },

  // Adicionar skill a uma experience
  addSkillToExperience: async (experienceId: string, skillId: string): Promise<ProfessionalExperience> => {
    const response = await api.post<ProfessionalExperience>(
      `${API_ENDPOINTS.EXPERIENCES.BASE}/${experienceId}/skills/${skillId}`
    );
    return response;
  },

  // Remover skill de uma experience
  removeSkillFromExperience: async (experienceId: string, skillId: string): Promise<ProfessionalExperience> => {
    const response = await api.delete<ProfessionalExperience>(
      `${API_ENDPOINTS.EXPERIENCES.BASE}/${experienceId}/skills/${skillId}`
    );
    return response;
  },
};