'use client';

import { useEffect } from 'react';
import { TOKEN_KEYS } from '@/lib/constants';

export function AuthInit() {
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    const role = localStorage.getItem(TOKEN_KEYS.ROLE);
    if (token && !document.cookie.includes('accessToken=')) {
      document.cookie = `accessToken=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    }
    if (role && !document.cookie.includes('userRole=')) {
      document.cookie = `userRole=${role}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    }
  }, []);

  return null;
}
