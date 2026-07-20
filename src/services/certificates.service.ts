import api from '@/lib/axios';
import {
  ApiResponse,
  CertificateResponse,
  CreateCertificateRequest,
} from '@/types';

export const certificatesService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<CertificateResponse[]>>(
      '/profile/certificates'
    );
    return response.data;
  },

  create: async (data: CreateCertificateRequest) => {
    const response = await api.post<ApiResponse<CertificateResponse>>(
      '/profile/certificates',
      data
    );
    return response.data;
  },

  update: async (id: string, data: CreateCertificateRequest) => {
    const response = await api.put<ApiResponse<CertificateResponse>>(
      `/profile/certificates/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/profile/certificates/${id}`);
  },
};