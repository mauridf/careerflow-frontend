import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

const sharedPathPrefix = '/shared';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permite acesso à página de currículo compartilhado sem autenticação
  if (pathname.startsWith(sharedPathPrefix)) {
    return NextResponse.next();
  }

  // Verifica se é rota pública
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  );

  // Verifica token de acesso nos cookies ou localStorage (via cookie)
  const accessToken = request.cookies.get('accessToken')?.value;

  // Se não está autenticado e tenta acessar rota privada → redireciona para login
  if (!accessToken && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se está autenticado e tenta acessar rota pública → redireciona para dashboard
  if (accessToken && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Proteção de rotas admin
  if (pathname.startsWith('/admin')) {
    const userRole = request.cookies.get('userRole')?.value;
    if (userRole !== 'Admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public folder
     * - API routes
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.svg$|.*\\.png$).*)',
  ],
};