// ============================================
// Certificates Types
// ============================================

export interface CertificateResponse {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expirationDate: string | null;
  certificateId: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface CreateCertificateRequest {
  title: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string | null;
  certificateId?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export type UpdateCertificateRequest = CreateCertificateRequest;