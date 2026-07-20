'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { socialNetworksService } from '@/services';
import { CreateSocialNetworkRequest } from '@/types';
import { QUERY_KEYS } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';

export function useSocialNetworks() {
  return useQuery({
    queryKey: [QUERY_KEYS.SOCIAL_NETWORKS],
    queryFn: () => socialNetworksService.getAll(),
  });
}

export function useCreateSocialNetwork() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateSocialNetworkRequest) =>
      socialNetworksService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SOCIAL_NETWORKS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE_COMPLETION] });
      toast({
        title: 'Rede social adicionada com sucesso!',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao adicionar rede social',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateSocialNetwork() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: CreateSocialNetworkRequest;
    }) => socialNetworksService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SOCIAL_NETWORKS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE_COMPLETION] });
      toast({
        title: 'Rede social atualizada com sucesso!',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao atualizar rede social',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteSocialNetwork() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => socialNetworksService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SOCIAL_NETWORKS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE_COMPLETION] });
      toast({
        title: 'Rede social removida com sucesso!',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao remover rede social',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}