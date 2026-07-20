'use client';

import { type ReactNode, useEffect, useRef } from 'react';

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export function AlertDialog({ open, onOpenChange, children }: AlertDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = () => onOpenChange(false);
    el.addEventListener('close', handler);
    return () => el.removeEventListener('close', handler);
  }, [onOpenChange]);

  return (
    <dialog
      ref={ref}
      className="backdrop:bg-black/50 rounded-xl p-0 shadow-2xl max-w-lg w-full open:flex flex-col"
      onClick={(e) => { if (e.target === ref.current) onOpenChange(false); }}
    >
      {children}
    </dialog>
  );
}

export function AlertDialogContent({ className = '', children, ...props }: { className?: string; children: ReactNode; [key: string]: unknown }) {
  return <div className={`p-6 ${className}`} {...props}>{children}</div>;
}

export function AlertDialogHeader({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-2 mb-6">{children}</div>;
}

export function AlertDialogTitle({ className = '', children, ...props }: { className?: string; children: ReactNode; [key: string]: unknown }) {
  return <h2 className={`text-lg font-semibold text-slate-900 ${className}`} {...props}>{children}</h2>;
}

export function AlertDialogDescription({ className = '', children, ...props }: { className?: string; children: ReactNode; [key: string]: unknown }) {
  return <p className={`text-sm text-slate-500 ${className}`} {...props}>{children}</p>;
}

export function AlertDialogFooter({ className = '', children, ...props }: { className?: string; children: ReactNode; [key: string]: unknown }) {
  return <div className={`flex items-center justify-end gap-3 mt-6 ${className}`} {...props}>{children}</div>;
}

export function AlertDialogAction({ className = '', children, ...props }: { className?: string; children: ReactNode; [key: string]: unknown }) {
  return <button className={className} {...props}>{children}</button>;
}

export function AlertDialogCancel({ className = '', children, ...props }: { className?: string; children: ReactNode; [key: string]: unknown }) {
  return <button className={className} {...props}>{children}</button>;
}
