import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 text-center px-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
          <FileQuestion className="h-10 w-10 text-slate-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-display-lg-mobile text-slate-900 font-display">
            404
          </h1>
          <p className="text-body-lg text-slate-500">
            Página não encontrada
          </p>
          <p className="text-body-sm text-slate-400 max-w-md">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>
        <Link href="/dashboard" className="btn-primary mt-4">
          Voltar ao Dashboard
        </Link>
      </div>
    </div>
  );
}