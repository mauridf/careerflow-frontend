'use client';

import { useEffect, useRef } from 'react';
import { TOKEN_KEYS } from '@/lib/constants';
import api from '@/lib/axios';

export function AuthInit() {
  const validated = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    const role = localStorage.getItem(TOKEN_KEYS.ROLE);

    if (!token) return;

    if (validated.current) return;
    validated.current = true;

    // Restaura cookie para o middleware SSR
    if (!document.cookie.includes('accessToken=')) {
      document.cookie = `accessToken=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    }
    if (role && !document.cookie.includes('userRole=')) {
      document.cookie = `userRole=${role}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    }

    // Valida se o token ainda é válido
    api.get('/auth/me').catch(() => {
      localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(TOKEN_KEYS.USER);
      localStorage.removeItem(TOKEN_KEYS.ROLE);
      localStorage.removeItem('careerflow-auth');
      document.cookie = 'accessToken=; path=/; max-age=0';
      document.cookie = 'userRole=; path=/; max-age=0';
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    });
  }, []);

  return null;
}
