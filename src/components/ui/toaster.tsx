'use client';

import { useToast } from '@/hooks/use-toast';
import { Toast } from '@/components/ui/toast';

export function Toaster() {
  const { toasts, toast } = useToast();

  const handleClose = (id: string) => {
    toast({ title: '' }); // placeholder
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <Toast key={t.id} id={t.id} title={t.title} description={t.description} variant={t.variant} onClose={handleClose} />
      ))}
    </div>
  );
}
