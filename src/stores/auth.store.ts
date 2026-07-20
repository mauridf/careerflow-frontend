import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserMeResponse } from '@/types';
import { TOKEN_KEYS } from '@/lib/constants';

interface AuthState {
  user: UserMeResponse | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isPremium: boolean;

  login: (user: UserMeResponse, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setUser: (user: UserMeResponse) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  updateToken: (accessToken: string, refreshToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isAdmin: false,
      isPremium: false,

      login: (user: UserMeResponse, accessToken: string, refreshToken: string) => {
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isAdmin: user.role === 'Admin',
          isPremium: user.isPremium || user.role === 'PremiumUser',
        });
        localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
        localStorage.setItem(TOKEN_KEYS.ROLE, user.role);
        document.cookie = `accessToken=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        document.cookie = `userRole=${user.role}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isAdmin: false,
          isPremium: false,
        });
        localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(TOKEN_KEYS.USER);
        localStorage.removeItem(TOKEN_KEYS.ROLE);
        document.cookie = 'accessToken=; path=/; max-age=0';
        document.cookie = 'userRole=; path=/; max-age=0';
      },

      setUser: (user: UserMeResponse) => {
        set({
          user,
          isAdmin: user.role === 'Admin',
          isPremium: user.isPremium || user.role === 'PremiumUser',
        });
      },

      setTokens: (accessToken: string, refreshToken: string) => {
        set({ accessToken, refreshToken });
        localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
        document.cookie = `accessToken=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      },

      updateToken: (accessToken: string, refreshToken: string) => {
        set({ accessToken, refreshToken });
        localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
        document.cookie = `accessToken=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      },
    }),
    {
      name: 'careerflow-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
        isPremium: state.isPremium,
      }),
    }
  )
);