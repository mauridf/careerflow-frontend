// ============================================
// Admin Types
// ============================================

export interface AdminSystemStatsResponse {
  totalUsers: number;
  activeUsers: number;
  premiumUsers: number;
  adminUsers: number;
  totalResumes: number;
  publishedResumes: number;
  totalResumeViews: number;
  averageAtsScore: number;
}

export interface AdminUsersListResponse {
  users: AdminUserResponse[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AdminUserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  isPremium: boolean;
  emailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  deletedAt: string | null;
}

export interface AdminUserDetailResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  isPremium: boolean;
  premiumUntil: string | null;
  emailVerified: boolean;
  lastLoginAt: string | null;
  failedLoginAttempts: number;
  lockedUntil: string | null;
  createdAt: string;
  deletedAt: string | null;
  hasProfile: boolean;
}

export interface UpdateUserRequest {
  name?: string;
  role?: string;
}