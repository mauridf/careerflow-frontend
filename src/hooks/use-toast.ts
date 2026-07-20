'use client';

import { useState, useCallback } from 'react';

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

export function useToast() {
  const [state, setState] = useState<ToastState>(memoryState);

  useState(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  });

  const toast = useCallback(
    (props: Omit<Toast, 'id'>) => dispatch(props),
    []
  );

  return { ...state, toast };
}
