'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { resumeService } from '@/services';
import { QUERY_KEYS } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';

export function useResume() {
  return useQuery({
    queryKey: [QUERY_KEYS.RESUME],
    queryFn: () => resumeService.get(),
  });
}

export function useResumeAnalytics() {
  return useQuery({
    queryKey: [QUERY_KEYS.RESUME_ANALYTICS],
    queryFn: () => resumeService.getAnalytics(),
  });
}

export function useShareResume() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => resumeService.share(),
    onSuccess: (response) => {
      navigator.clipboard.writeText(response.data.shareLink);
      toast({
        title: 'Link copiado!',
        description: 'Link de compartilhamento copiado para a área de transferência.',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao gerar link',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

export function usePublishResume() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => resumeService.publish(),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESUME_ANALYTICS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
      toast({
        title: 'Currículo publicado!',
        description: response.data.message,
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao publicar currículo',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

export function useUnpublishResume() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => resumeService.unpublish(),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESUME_ANALYTICS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
      toast({
        title: 'Currículo despublicado',
        description: response.data.message,
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao despublicar currículo',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

export function useDownloadPdf() {
  const { toast } = useToast();

  return useMutation<Blob, unknown, string>({
    mutationFn: (type: string = 'standard') =>
      type === 'ats' ? resumeService.generateAtsPdf() : resumeService.generatePdf(),
    onSuccess: (blob: Blob, type: string) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = type === 'ats' ? 'curriculo-ats.pdf' : 'curriculo.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast({
        title: 'Download iniciado!',
        description:
          type === 'ats'
            ? 'Seu currículo otimizado para ATS está sendo baixado.'
            : 'Seu currículo está sendo baixado.',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Erro ao gerar PDF',
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}