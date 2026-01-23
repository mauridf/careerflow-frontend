// Tipos de usuário baseados na API
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  photoPath: string;
  createdAt: string;
}

// Tipos para autenticação
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresAt: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  state: string;
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  photoPath: string;
  createdAt: string;
}

// Estado de autenticação
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Tipos para informações profissionais
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

export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Language {
  id: string;
  name: string;
  level: 'Basic' | 'Intermediate' | 'Advanced' | 'Native';
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  achievements?: string[];
}