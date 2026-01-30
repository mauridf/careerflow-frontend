import { api } from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';
import type { Certificate, CertificateRequest, ExpiringCertificate } from '../types';

export const certificatesService = {
  // Buscar todas as certificates do usuário
  getCertificates: async (): Promise<Certificate[]> => {
    const response = await api.get<Certificate[]>(API_ENDPOINTS.CERTIFICATES.BASE);
    return response;
  },

  // Buscar certificates que estão expirando
  getExpiringCertificates: async (daysThreshold: number = 30): Promise<ExpiringCertificate[]> => {
    const response = await api.get<ExpiringCertificate[]>(
      `${API_ENDPOINTS.CERTIFICATES.EXPIRING}?daysThreshold=${daysThreshold}`
    );
    return response;
  },

  // Buscar certificate por ID
  getCertificateById: async (id: string): Promise<Certificate> => {
    const response = await api.get<Certificate>(`${API_ENDPOINTS.CERTIFICATES.BASE}/${id}`);
    return response;
  },

  // Cadastrar nova certificate
  createCertificate: async (data: CertificateRequest): Promise<Certificate> => {
    const requestData = {
      name: data.name,
      description: data.description || '',
      startDate: new Date(data.startDate).toISOString(),
      endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
      certificateFile: data.certificateFile || '', // URL do certificado
    };

    const response = await api.post<Certificate>(
      API_ENDPOINTS.CERTIFICATES.BASE,
      requestData
    );
    return response;
  },

  // Atualizar certificate
  updateCertificate: async (id: string, data: CertificateRequest): Promise<Certificate> => {
    const requestData = {
      name: data.name,
      description: data.description || '',
      startDate: new Date(data.startDate).toISOString(),
      endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
      certificateFile: data.certificateFile || '', // URL do certificado
    };

    const response = await api.put<Certificate>(
      `${API_ENDPOINTS.CERTIFICATES.BASE}/${id}`,
      requestData
    );
    return response;
  },

  // Excluir certificate
  deleteCertificate: async (id: string): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.CERTIFICATES.BASE}/${id}`);
  },
};