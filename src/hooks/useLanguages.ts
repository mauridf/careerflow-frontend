'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { languagesService } from '@/services';
import { CreateLanguageRequest } from '@/types';
import { QUERY_KEYS } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';

export function useLanguages() {
  return useQuery({
    queryKey: [QUERY_KEYS.LANGUAGES],
    queryFn: () => languagesService.getAll(),
  });
}

export function useCreateLanguage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateLanguageRequest) => languagesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LANGUAGES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE_COMPLETION] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
      toast({
        title: 'Idioma adicionado com sucesso!',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao adicionar idioma',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateLanguage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateLanguageRequest }) =>
      languagesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LANGUAGES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE_COMPLETION] });
      toast({
        title: 'Idioma atualizado com sucesso!',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao atualizar idioma',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteLanguage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => languagesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LANGUAGES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE_COMPLETION] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
      toast({
        title: 'Idioma removido com sucesso!',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao remover idioma',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}