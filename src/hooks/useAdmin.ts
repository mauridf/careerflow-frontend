'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services';
import { UpdateUserRequest } from '@/types';
import { QUERY_KEYS } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';

export function useAdminStats() {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_STATS],
    queryFn: () => adminService.getOverview(),
  });
}

export function useAdminUsers(params: {
  page?: number;
  pageSize?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_USERS, params],
    queryFn: () => adminService.getUsers(params),
  });
}

export function useAdminUserDetail(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_USER_DETAIL, id],
    queryFn: () => adminService.getUserById(id),
    enabled: !!id,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      adminService.updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_USERS] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ADMIN_USER_DETAIL, variables.id],
      });
      toast({
        title: 'Usuário atualizado com sucesso!',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao atualizar usuário',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => adminService.toggleUserStatus(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_USERS] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ADMIN_USER_DETAIL, id],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_STATS] });
      toast({
        title: 'Status do usuário alterado com sucesso!',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao alterar status',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

export function useManagePremium() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      id,
      activate,
      until,
    }: {
      id: string;
      activate: boolean;
      until?: string;
    }) => adminService.managePremium(id, activate, until),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_USERS] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ADMIN_USER_DETAIL, variables.id],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_STATS] });
      toast({
        title: variables.activate
          ? 'Premium ativado com sucesso!'
          : 'Premium desativado com sucesso!',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao gerenciar premium',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => adminService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_USERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_STATS] });
      toast({
        title: 'Usuário excluído com sucesso!',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao excluir usuário',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}