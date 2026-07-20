import type { Metadata } from 'next';
import { DashboardLayoutClient } from './DashboardLayoutClient';

export const metadata: Metadata = {
  title: 'Dashboard | CareerFlow',
  description: 'Painel de performance da sua carreira.',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}