'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { certificatesService } from '@/services';
import { CreateCertificateRequest } from '@/types';
import { QUERY_KEYS } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';

export function useCertificates() {
  return useQuery({
    queryKey: [QUERY_KEYS.CERTIFICATES],
    queryFn: () => certificatesService.getAll(),
  });
}

export function useCreateCertificate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateCertificateRequest) => certificatesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CERTIFICATES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE_COMPLETION] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
      toast({
        title: 'Certificado adicionado com sucesso!',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao adicionar certificado',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateCertificate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateCertificateRequest }) =>
      certificatesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CERTIFICATES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE_COMPLETION] });
      toast({
        title: 'Certificado atualizado com sucesso!',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao atualizar certificado',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteCertificate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => certificatesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CERTIFICATES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE_COMPLETION] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
      toast({
        title: 'Certificado removido com sucesso!',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao remover certificado',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}