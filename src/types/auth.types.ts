// ============================================
// Auth Types
// ============================================

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  userId: string;
  name: string;
  email: string;
  role: string;
  isPremium: boolean;
  emailVerified: boolean;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  tokenType: string;
}

export interface RefreshTokenRequest {
  accessToken: string;
  refreshToken: string;
}

export interface UserMeResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  isPremium: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}