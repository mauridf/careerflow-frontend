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
  certifications?: Certificate[];
  languages?: Language[];
  experiences?: ProfessionalExperience[];
}

export interface SocialLink {
  platform: string;
  url: string;
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

// Tipos para Certificates (Certificados)
export interface Certificate {
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

export interface CertificateRequest {
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  certificateFile?: string;
}

export interface ExpiringCertificate extends Certificate {
  daysUntilExpiration?: number;
}

// ... (tipos anteriores mantidos)

// Tipos para ProfessionalExperience (Experiências Profissionais)
export interface ProfessionalExperience {
  id: string;
  userId: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  responsibilities: string;
  isPaid: boolean;
  isCurrent: boolean;
  skills: Skill[];
  createdAt: string;
  updatedAt: string;
}

export interface ProfessionalExperienceRequest {
  company: string;
  position: string;
  startDate: string;
  endDate?: string | null;
  responsibilities: string;
  isPaid: boolean;
  skillIds: string[];
}

// Tipos para SkillExperience (Relacionamento entre Skill e Experience)
export interface SkillExperienceRequest {
  skillId: string;
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

// Tipos para Skills
export interface Skill {
  id: string;
  userId: string;
  name: string;
  type: string;
  level: string; // Alterado para string para compatibilidade com a API
  createdAt: string;
  updatedAt: string;
}

export interface SkillDistribution {
  type: string;
  count: number;
  percentage: number;
}

export interface SkillRequest {
  name: string;
  type: string;
  level: string;
}

// Enums para Skills (baseado nos enums do backend)
// Usando objetos constantes em vez de enum TypeScript
export const SkillLevel = {
  BASIC: "BASICO",
  INTERMEDIATE: "INTERMEDIARIO",
  ADVANCED: "AVANÇADO"
} as const;

export type SkillLevelType = typeof SkillLevel[keyof typeof SkillLevel];

export const SkillType = {
  BACKEND: "BACKEND",
  FRONTEND: "FRONTEND",
  DATABASE: "BANCO DE DADOS",
  CLOUD_DEVOPS: "CLOUD E DEVOPS",
  ARCHITECTURE: "ARQUITETURA E PADRÕES",
  TOOLS: "FERRAMENTAS E OUTRAS TECNOLOGIAS"
} as const;

export type SkillTypeType = typeof SkillType[keyof typeof SkillType];

// Tipos para Dashboard Stats
export interface DashboardSkillDistribution {
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
  skillDistribution: DashboardSkillDistribution[];
  upcomingExpirations: UpcomingExpiration[];
}

// Tipos para Languages
export interface Language {
  id: string;
  userId: string;
  name: string;
  level: string;
  createdAt: string;
  updatedAt: string;
}

export interface LanguageRequest {
  name: string;
  level: string;
}

// Enums para Language Level
export const LanguageLevel = {
  BASIC: "BASICO",
  INTERMEDIATE: "INTERMEDIÁRIO",
  ADVANCED: "AVANÇADO",
  FLUENT: "FLUENTE/NATIVO"
} as const;

export type LanguageLevelType = typeof LanguageLevel[keyof typeof LanguageLevel];