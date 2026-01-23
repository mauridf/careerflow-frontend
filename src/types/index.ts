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

// Tipos para Profile
export interface Summary {
  id: string;
  userId: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialMedia {
  id: string;
  userId: string;
  platform: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

// Tipos para Dashboard Stats
export interface SkillDistribution {
  type: string;
  count: number;
  percentage: number;
}

export interface UpcomingExpiration {
  name: string;
  type: string;
  expirationDate: string;
  daysUntilExpiration: number;
}

export interface DashboardStats {
  totalSkills: number;
  totalExperiences: number;
  totalCertificates: number;
  totalLanguages: number;
  profileCompleteness: number;
  skillDistribution: SkillDistribution[];
  upcomingExpirations: UpcomingExpiration[];
}

// Tipos para Resume
export interface SkillResume {
  id: string;
  userId: string;
  name: string;
  type: string;
  level: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExperienceResume {
  id: string;
  userId: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
  isPaid: boolean;
  isCurrent: boolean;
  skills: SkillResume[];
  createdAt: string;
  updatedAt: string;
}

export interface AcademicResume {
  id: string;
  userId: string;
  institution: string;
  courseName: string;
  level: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  diplomaPath: string;
  createdAt: string;
  updatedAt: string;
}

export interface CertificateResume {
  id: string;
  userId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isValid: boolean;
  certificatePath: string;
  createdAt: string;
  updatedAt: string;
}

export interface LanguageResume {
  id: string;
  userId: string;
  name: string;
  level: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeResponse {
  user: User;
  summary: Summary | null;
  socialMedias: SocialMedia[];
  skills: SkillResume[];
  experiences: ExperienceResume[];
  academics: AcademicResume[];
  certificates: CertificateResume[];
  languages: LanguageResume[];
}

// Tipos para requests
export interface SummaryRequest {
  summary: string;
}

export interface SocialMediaRequest {
  platform: string;
  url: string;
}