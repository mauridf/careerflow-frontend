'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { skillsService } from '@/services';
import { CreateSkillRequest, ReorderSkillsRequest } from '@/types';
import { QUERY_KEYS } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';

export function useSkills() {
  return useQuery({
    queryKey: [QUERY_KEYS.SKILLS],
    queryFn: () => skillsService.getAll(),
  });
}

export function useSkillCategories() {
  return useQuery({
    queryKey: [QUERY_KEYS.SKILL_CATEGORIES],
    queryFn: () => skillsService.getCategories(),
    staleTime: Infinity, // Categorias raramente mudam
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateSkillRequest) => skillsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SKILLS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE_COMPLETION] });
      toast({
        title: 'Habilidade adicionada com sucesso!',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao adicionar habilidade',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateSkill() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateSkillRequest }) =>
      skillsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SKILLS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE_COMPLETION] });
      toast({
        title: 'Habilidade atualizada com sucesso!',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao atualizar habilidade',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => skillsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SKILLS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE_COMPLETION] });
      toast({
        title: 'Habilidade removida com sucesso!',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao remover habilidade',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

export function useReorderSkills() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: ReorderSkillsRequest) => skillsService.reorder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SKILLS] });
      toast({
        title: 'Habilidades reordenadas com sucesso!',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao reordenar habilidades',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}