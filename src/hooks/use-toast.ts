'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

interface ToastState {
  toasts: Toast[];
}

const listeners: Array<(state: ToastState) => void> = [];
let memoryState: ToastState = { toasts: [] };

function dispatch(toast: Omit<Toast, 'id'>) {
  const id = Math.random().toString(36).slice(2, 9);
  memoryState = {
    ...memoryState,
    toasts: [...memoryState.toasts, { ...toast, id }],
  };
  listeners.forEach((listener) => listener(memoryState));
  return id;
}

function dismiss(id: string) {
  memoryState = {
    ...memoryState,
    toasts: memoryState.toasts.filter((t) => t.id !== id),
  };
  listeners.forEach((listener) => listener(memoryState));
}

const AUTO_DISMISS_MS = 5000;

export function useToast() {
  const [state, setState] = useState<ToastState>(memoryState);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  const toast = useCallback(
    (props: Omit<Toast, 'id'>) => {
      const id = dispatch(props);
      setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    },
    []
  );

  return { ...state, toast, dismiss };
}
