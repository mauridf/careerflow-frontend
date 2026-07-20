'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services';
import { useAuthStore } from '@/stores';
import { useRouter } from 'next/navigation';
import {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from '@/types';
import { QUERY_KEYS, ROUTES } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';

export function useLogin() {
  const loginStore = useAuthStore((state) => state.login);
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      const { userId, name, email, role, isPremium, accessToken, refreshToken } =
        response.data;
      loginStore(
        { id: userId, name, email, role, isPremium },
        accessToken,
        refreshToken
      );
      toast({
        title: 'Login realizado com sucesso!',
        description: `Bem-vindo, ${name}!`,
      });
      router.push(ROUTES.DASHBOARD);
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao fazer login',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

export function useRegister() {
  const loginStore = useAuthStore((state) => state.login);
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (response) => {
      const { userId, name, email, role, isPremium, accessToken, refreshToken } =
        response.data;
      loginStore(
        { id: userId, name, email, role, isPremium },
        accessToken,
        refreshToken
      );
      toast({
        title: 'Conta criada com sucesso!',
        description: `Bem-vindo ao CareerFlow, ${name}!`,
      });
      router.push(ROUTES.DASHBOARD);
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao criar conta',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

export function useLogout() {
  const logoutStore = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();
  const router = useRouter();

  return () => {
    logoutStore();
    queryClient.clear();
    router.push(ROUTES.LOGIN);
  };
}

export function useCurrentUser() {
  const { isAuthenticated, setUser } = useAuthStore();

  return useQuery({
    queryKey: [QUERY_KEYS.AUTH_ME],
    queryFn: async () => {
      const response = await authService.me();
      setUser(response.data);
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useForgotPassword() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authService.forgotPassword(data),
    onSuccess: (response) => {
      toast({
        title: 'Email enviado',
        description: response.data.message,
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

export function useResetPassword() {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
    onSuccess: (response) => {
      toast({
        title: 'Senha redefinida',
        description: response.data.message,
      });
      router.push(ROUTES.LOGIN);
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao redefinir senha',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

export function useChangePassword() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => authService.changePassword(data),
    onSuccess: (response) => {
      toast({
        title: 'Senha alterada',
        description: response.data.message,
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao alterar senha',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}