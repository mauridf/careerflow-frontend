'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { experiencesService } from '@/services';
import { CreateExperienceRequest } from '@/types';
import { QUERY_KEYS } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';

export function useExperiences() {
  return useQuery({
    queryKey: [QUERY_KEYS.EXPERIENCES],
    queryFn: () => experiencesService.getAll(),
  });
}

export function useExperienceDetail(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.EXPERIENCE_DETAIL, id],
    queryFn: () => experiencesService.getById(id),
    enabled: !!id,
  });
}

export function useCreateExperience() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateExperienceRequest) => experiencesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EXPERIENCES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE_COMPLETION] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
      toast({
        title: 'Experiência adicionada com sucesso!',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao adicionar experiência',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateExperience() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateExperienceRequest }) =>
      experiencesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EXPERIENCES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE_COMPLETION] });
      toast({
        title: 'Experiência atualizada com sucesso!',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao atualizar experiência',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteExperience() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => experiencesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EXPERIENCES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE_COMPLETION] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
      toast({
        title: 'Experiência removida com sucesso!',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao remover experiência',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}