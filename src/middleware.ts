import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

function getJwtSecretKey() {
  const secret = process.env.NEXT_MIDDLEWARE_JWT_SECRET;
  if (!secret || secret.length === 0) {
    throw new Error("La variable de entorno NEXT_MIDDLEWARE_JWT_SECRET está ausente.");
  }
  return new TextEncoder().encode(secret);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("access_token")?.value;
  const isAdminRoute = pathname.startsWith("/admin");
  const isEncargadoRoute = pathname.startsWith("/encargado");
  const isLoginRoute = pathname === "/login";

  // Redirigir si no hay token y está intentando acceder a rutas protegidas
  if (!token && (isAdminRoute || isEncargadoRoute)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Validar el token JWT
  if (token) {
    try {
      const { payload } = await jwtVerify(token, getJwtSecretKey());
      const rol = payload.rol;

      // Redirigir a la página home del rol correspondiente si está en login
      if (isLoginRoute) {
        return NextResponse.redirect(new URL(`/${rol}`, req.url));
      }

      // Protección por rol
      if (isAdminRoute && rol !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }

      if (isEncargadoRoute && rol !== "encargado") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }

    } catch (error) {
      // Redirigir a login si el token es inválido, pero solo si no está ya en login
      if (!isLoginRoute) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/encargado", "/encargado/:path*", "/login"],
};

