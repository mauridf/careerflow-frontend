// Tipos de usuário
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

// Tipos para autenticação
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Tipos para informações profissionais (serão expandidos)
export interface ProfessionalInfo {
  id: string;
  userId: string;
  summary?: string;
  socials?: SocialLink[];
  skills?: Skill[];
  education?: Education[];
  certifications?: Certification[];
  languages?: Language[];
  experiences?: Experience[];
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

// Adicione mais interfaces conforme necessário