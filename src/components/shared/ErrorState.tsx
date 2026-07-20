import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Erro ao carregar',
  message = 'Ocorreu um erro ao carregar os dados. Tente novamente.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error-container">
        <AlertCircle className="h-8 w-8 text-error" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-headline-sm text-slate-900">{title}</h3>
        <p className="text-body-sm text-slate-500 max-w-md">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-secondary mt-2"
        >
          <RefreshCw className="h-4 w-4" />
          Tentar novamente
        </button>
      )}
    </div>
  );
}