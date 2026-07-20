import { type LucideIcon, Plus } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-4">
      {Icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <Icon className="h-8 w-8 text-slate-400" />
        </div>
      )}
      <div className="text-center space-y-2">
        <h3 className="text-headline-sm text-slate-900">{title}</h3>
        <p className="text-body-sm text-slate-500 max-w-md">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-primary mt-2"
        >
          <Plus className="h-4 w-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}