import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | CareerFlow',
  description: 'Acesse sua conta CareerFlow e gerencie sua carreira.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Mesh Background */}
      <div className="fixed inset-0 pointer-events-none mesh-bg" />
      {children}
    </div>
  );
}