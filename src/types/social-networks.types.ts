// ============================================
// Social Networks Types
// ============================================

export interface SocialNetworkResponse {
  id: string;
  networkType: string;
  url: string;
  displayOrder: number;
  createdAt: string;
}

export interface CreateSocialNetworkRequest {
  networkType: number;
  url: string;
  displayOrder?: number;
}

export type UpdateSocialNetworkRequest = CreateSocialNetworkRequest;