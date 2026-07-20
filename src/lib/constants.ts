// ============================================
// Constantes da Aplicação
// ============================================

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const TOKEN_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  ROLE: 'userRole',
} as const;

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SKILLS: '/profile/skills',
  EXPERIENCES: '/profile/experiences',
  EDUCATION: '/profile/education',
  CERTIFICATES: '/profile/certificates',
  LANGUAGES: '/profile/languages',
  SOCIAL_NETWORKS: '/profile/social-networks',
  RESUME: '/resume',
  CHANGE_PASSWORD: '/change-password',
  SETTINGS: '/settings',
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  SHARED_RESUME: '/shared',
} as const;

export const LIMITS = {
  SKILLS_MAX: 50,
  EXPERIENCES_MAX: 20,
  EDUCATION_MAX: 10,
  CERTIFICATES_MAX: 30,
  LANGUAGES_MAX: 5,
  SOCIAL_NETWORKS_MAX: 10,
  PHOTO_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  PHOTO_ACCEPTED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  PROFESSIONAL_SUMMARY_MIN: 100,
  PROFESSIONAL_SUMMARY_MAX: 2000,
  MIN_AGE: 14,
} as const;

export const COMPLETION_THRESHOLD = {
  MIN_TO_PUBLISH: 60,
  RECOMMENDED: 80,
} as const;

export const QUERY_KEYS = {
  AUTH_ME: 'auth-me',
  PROFILE: 'profile',
  PROFILE_COMPLETION: 'profile-completion',
  SKILLS: 'skills',
  SKILL_CATEGORIES: 'skill-categories',
  EXPERIENCES: 'experiences',
  EXPERIENCE_DETAIL: 'experience-detail',
  EDUCATION: 'education',
  CERTIFICATES: 'certificates',
  LANGUAGES: 'languages',
  SOCIAL_NETWORKS: 'social-networks',
  RESUME: 'resume',
  RESUME_ANALYTICS: 'resume-analytics',
  DASHBOARD_STATS: 'dashboard-stats',
  DASHBOARD_INSIGHTS: 'dashboard-insights',
  DASHBOARD_ACTIVITY: 'dashboard-activity',
  DASHBOARD_VIEWS_CHART: 'dashboard-views-chart',
  DASHBOARD_SKILLS_GAP: 'dashboard-skills-gap',
  ADMIN_STATS: 'admin-stats',
  ADMIN_USERS: 'admin-users',
  ADMIN_USER_DETAIL: 'admin-user-detail',
} as const;

export const STALE_TIMES = {
  PROFILE: 5 * 60 * 1000, // 5 minutos
  DASHBOARD: 2 * 60 * 1000, // 2 minutos
  ADMIN: 30 * 1000, // 30 segundos
  DEFAULT: 60 * 1000, // 1 minuto
} as const;