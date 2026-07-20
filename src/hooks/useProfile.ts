'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileService } from '@/services';
import { CreateProfileRequest } from '@/types';
import { QUERY_KEYS } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';

export function useProfile() {
  return useQuery({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: () => profileService.get(),
  });
}

export function useProfileCompletion() {
  return useQuery({
    queryKey: [QUERY_KEYS.PROFILE_COMPLETION],
    queryFn: () => profileService.getCompletion(),
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateProfileRequest) => profileService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE_COMPLETION] });
      toast({
        title: 'Perfil criado com sucesso!',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao criar perfil',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateProfileRequest) => profileService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE_COMPLETION] });
      toast({
        title: 'Perfil atualizado com sucesso!',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao atualizar perfil',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

export function useUploadPhoto() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (file: File) => profileService.uploadPhoto(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE_COMPLETION] });
      toast({
        title: 'Foto atualizada com sucesso!',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao fazer upload da foto',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

export function useDeletePhoto() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => profileService.deletePhoto(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE_COMPLETION] });
      toast({
        title: 'Foto removida com sucesso!',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao remover foto',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}