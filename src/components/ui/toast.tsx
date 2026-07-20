'use client';

import { type ReactNode } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

export interface ToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  onClose: (id: string) => void;
}

export function Toast({ id, title, description, variant = 'default', onClose }: ToastProps) {
  return (
    <div
      className={clsx(
        'flex items-start gap-3 rounded-lg border p-4 shadow-lg',
        variant === 'destructive'
          ? 'border-red-200 bg-red-50 text-red-900'
          : 'border-zinc-200 bg-white text-zinc-900'
      )}
      role="alert"
    >
      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>
        {description && <p className="mt-1 text-sm opacity-80">{description}</p>}
      </div>
      <button
        onClick={() => onClose(id)}
        className="shrink-0 rounded-md p-1 hover:bg-black/5 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
