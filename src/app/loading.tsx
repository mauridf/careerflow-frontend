import { LoadingState } from '@/components/shared/LoadingState';

export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoadingState message="Carregando página..." size="lg" />
    </div>
  );
}