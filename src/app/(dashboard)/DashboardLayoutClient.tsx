'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  FileText,
  ListChecks,
  BarChart3,
  Lightbulb,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Crown,
  Plus,
} from 'lucide-react';
import { useAuthStore, useUIStore } from '@/stores';
import { useLogout, useIsMobile } from '@/hooks';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { ComponentType } from 'react';

interface SidebarLink {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  exact?: boolean;
  disabled?: boolean;
}

const sidebarLinks: SidebarLink[] = [
  {
    href: ROUTES.DASHBOARD,
    label: 'Dashboard',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: ROUTES.PROFILE,
    label: 'Perfil',
    icon: User,
  },
  {
    href: ROUTES.RESUME,
    label: 'Currículo',
    icon: FileText,
  },
  {
    href: ROUTES.SKILLS,
    label: 'Seções',
    icon: ListChecks,
  },
  {
    href: ROUTES.DASHBOARD + '?tab=analytics',
    label: 'Analytics',
    icon: BarChart3,
  },
  {
    href: ROUTES.DASHBOARD + '?tab=insights',
    label: 'Insights de Carreira',
    icon: Lightbulb,
    disabled: true,
  },
];

export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isPremium } = useAuthStore();
  const { isMobileMenuOpen, setMobileMenuOpen } =
    useUIStore();
  const logout = useLogout();
  const isMobile = useIsMobile();

  const isLinkActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    router.push(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant">
        <div className="flex justify-between items-center h-16 px-margin-mobile lg:px-margin-desktop max-w-[1600px] mx-auto">
          {/* Left Section */}
          <div className="flex items-center gap-xl">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-secondary hover:text-primary transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            <Link
              href={ROUTES.DASHBOARD}
              className="font-display text-headline-md font-bold text-primary"
            >
              CareerFlow
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-lg">
              <Link
                href={ROUTES.DASHBOARD}
                className={cn(
                  'font-display text-label-md pb-1 border-b-2 transition-colors',
                  isLinkActive(ROUTES.DASHBOARD, true)
                    ? 'text-primary border-primary'
                    : 'text-secondary border-transparent hover:text-primary'
                )}
              >
                Dashboard
              </Link>
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-md">
            {/* Notifications */}
            <button
              className="text-secondary hover:bg-surface-container-low p-2 rounded-full transition-all"
              aria-label="Notificações"
            >
              <Bell className="h-5 w-5" />
            </button>

            {/* Settings */}
            <button
              className="text-secondary hover:bg-surface-container-low p-2 rounded-full transition-all"
              aria-label="Configurações"
            >
              <Settings className="h-5 w-5" />
            </button>

            {/* Build Resume Button */}
            <Link
              href={ROUTES.RESUME}
              className="hidden sm:inline-flex items-center gap-xs bg-primary text-on-primary font-display text-label-md px-lg py-sm rounded-lg hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <Plus className="h-4 w-4" />
              Criar Currículo
            </Link>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden border border-outline-variant">
              {user?.name ? (
                <span className="font-display text-label-md text-on-primary-container">
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </span>
              ) : (
                <User className="h-5 w-5 text-on-primary-container" />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="flex max-w-[1600px] mx-auto pt-16 min-h-screen">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed left-0 top-16 bottom-0 bg-surface border-r border-outline-variant flex flex-col py-lg z-40 transition-transform duration-300',
            'w-64',
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
            'lg:translate-x-0'
          )}
        >
          {/* Navigation Links */}
          <div className="flex flex-col gap-xs px-md flex-1">
            {sidebarLinks.map((link) => {
              const isActive = isLinkActive(link.href, link.exact);
              const isDisabled = link.disabled;

              if (isDisabled) {
                return (
                  <button
                    key={link.href}
                    disabled
                    className="flex items-center gap-md p-md rounded-lg font-display text-label-md text-slate-300 cursor-not-allowed opacity-60"
                    title="Em breve"
                  >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </button>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => isMobile && setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-md p-md rounded-lg font-display text-label-md transition-all',
                    isActive
                      ? 'bg-surface-container text-primary border-r-[3px] border-primary font-semibold'
                      : 'text-secondary hover:bg-surface-container-low'
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Subscription Card */}
          <div className="mt-auto px-lg flex flex-col gap-md">
            <div className="p-md rounded-xl bg-surface-container-low border border-outline-variant">
              <span className="font-display text-label-sm text-secondary uppercase tracking-wider block mb-2">
                Assinatura
              </span>
              <p className="font-sans text-body-sm font-semibold">
                {isPremium ? 'Plano Premium' : 'Plano Gratuito'}
              </p>
              {!isPremium && (
                <button className="mt-md w-full bg-primary/10 text-primary font-display text-label-md py-xs rounded-lg hover:bg-primary/20 transition-all flex items-center justify-center gap-xs">
                  <Crown className="h-4 w-4" />
                  Fazer Upgrade
                </button>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-md p-md rounded-lg font-display text-label-md text-secondary hover:bg-error-container hover:text-error transition-all"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="grow lg:ml-64 p-margin-mobile lg:p-margin-desktop bg-background min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}