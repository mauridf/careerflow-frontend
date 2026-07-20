// ============================================
// Resume Types
// ============================================

export interface ResumeResponse {
  person: PersonInfo;
  experiences: ExperienceInfo[];
  educations: EducationInfo[];
  skills: SkillInfo[];
  languages: LanguageInfo[];
  certificates: CertificateInfo[];
  socialNetworks: SocialNetworkInfo[];
}

export interface PersonInfo {
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  state: string | null;
  professionalSummary: string | null;
  photoUrl: string | null;
  currentPosition: string | null;
  currentCompany: string | null;
  resumeSlug: string | null;
}

export interface ExperienceInfo {
  companyName: string;
  position: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
  employmentType: string | null;
  durationFormatted: string;
}

export interface EducationInfo {
  institution: string;
  course: string;
  level: string;
  status: string;
  startDate: string;
  endDate: string | null;
}

export interface SkillInfo {
  name: string;
  category: string;
  level: string;
  score: number;
  isPrimary: boolean;
}

export interface LanguageInfo {
  languageName: string;
  level: string;
  isNative: boolean;
}

export interface CertificateInfo {
  title: string;
  issuer: string;
  issueDate: string;
  expirationDate: string | null;
  credentialUrl: string | null;
}

export interface SocialNetworkInfo {
  networkType: string;
  url: string;
}

export interface ResumeAnalyticsResponse {
  totalViews: number;
  uniqueViews: number;
  pdfDownloads: number;
  sharesCount: number;
  atsScore: number | null;
  atsCompatibility: number | null;
  atsIssues: string | null;
  atsSuggestions: string | null;
  lastViewedAt: string | null;
  status: string;
  completionPercentage: number;
}

export interface ShareResumeResponse {
  shareLink: string;
}