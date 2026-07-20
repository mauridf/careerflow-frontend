'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { educationService } from '@/services';
import { CreateEducationRequest } from '@/types';
import { QUERY_KEYS } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';

export function useEducation() {
  return useQuery({
    queryKey: [QUERY_KEYS.EDUCATION],
    queryFn: () => educationService.getAll(),
  });
}

export function useCreateEducation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateEducationRequest) => educationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EDUCATION] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE_COMPLETION] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
      toast({
        title: 'Formação adicionada com sucesso!',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao adicionar formação',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateEducation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateEducationRequest }) =>
      educationService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EDUCATION] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE_COMPLETION] });
      toast({
        title: 'Formação atualizada com sucesso!',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao atualizar formação',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteEducation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => educationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EDUCATION] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE_COMPLETION] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
      toast({
        title: 'Formação removida com sucesso!',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao remover formação',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}