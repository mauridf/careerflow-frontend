'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/components/shared/ErrorState';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <ErrorState
        title="Erro inesperado"
        message="Ocorreu um erro ao carregar a página. Tente novamente."
        onRetry={reset}
      />
    </div>
  );
}