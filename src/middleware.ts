import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

function getJwtSecretKey() {
  const secret = process.env.NEXT_MIDDLEWARE_JWT_SECRET!;
  return new TextEncoder().encode(secret);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('access_token')?.value; // debe coincidir con el nombre de la cookie
  const isAdminRoute = pathname.startsWith('/admin');
  const isEncargadoRoute = pathname.startsWith('/encargado');
  const isLoginRoute = pathname === '/login';

  if (!token && (isAdminRoute || isEncargadoRoute)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (token) {
    try {
      const { payload } = await jwtVerify(token, getJwtSecretKey());
      const rol = payload.rol;

      if (isLoginRoute) return NextResponse.redirect(new URL(`/${rol}`, req.url));

      if (isAdminRoute && rol !== 'admin') return NextResponse.redirect(new URL('/unauthorized', req.url));
      if (isEncargadoRoute && rol !== 'encargado') return NextResponse.redirect(new URL('/unauthorized', req.url));
    } catch (err) {
      if (!isLoginRoute) return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/encargado', '/encargado/:path*', '/login'],
};
