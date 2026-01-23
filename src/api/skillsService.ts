import { api } from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';
import type { Skill, SkillRequest, SkillDistribution } from '../types';

export const skillsService = {
  // Buscar todas as skills do usuário
  getSkills: async (type?: string, level?: string): Promise<Skill[]> => {
    let url = API_ENDPOINTS.SKILLS.BASE;
    const params = new URLSearchParams();
    
    if (type) params.append('type', type);
    if (level) params.append('level', level);
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    
    const response = await api.get<Skill[]>(url);
    return response;
  },

  // Buscar skill por ID
  getSkillById: async (id: string): Promise<Skill> => {
    const response = await api.get<Skill>(`${API_ENDPOINTS.SKILLS.BASE}/${id}`);
    return response;
  },

  // Cadastrar nova skill
  createSkill: async (data: SkillRequest): Promise<Skill> => {
    const response = await api.post<Skill>(API_ENDPOINTS.SKILLS.BASE, data);
    return response;
  },

  // Atualizar skill
  updateSkill: async (id: string, data: SkillRequest): Promise<Skill> => {
    const response = await api.put<Skill>(`${API_ENDPOINTS.SKILLS.BASE}/${id}`, data);
    return response;
  },

  // Excluir skill
  deleteSkill: async (id: string): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.SKILLS.BASE}/${id}`);
  },

  // Buscar distribuição de skills
  getSkillDistribution: async (): Promise<SkillDistribution[]> => {
    const response = await api.get<SkillDistribution[]>(API_ENDPOINTS.SKILLS.DISTRIBUTION);
    return response;
  },
};