import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

function getJwtSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length === 0) {
    throw new Error("La variable de entorno JWT_SECRET está ausente.");
  }
  return new TextEncoder().encode(secret);
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const { pathname } = req.nextUrl;

  // Si no hay token y trata de acceder a rutas protegidas
  if (!token && (pathname.startsWith("/admin") || pathname.startsWith("/encargado"))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Si hay token, validarlo
  if (token) {
    try {
      const { payload } = await jwtVerify(token, getJwtSecretKey());
      const rol = payload.rol;

      // Redirigir desde /login si ya está autenticado
      if (pathname === "/login") {
        if (rol === "admin") {
          return NextResponse.redirect(new URL("/admin", req.url));
        }
        if (rol === "encargado") {
          return NextResponse.redirect(new URL("/encargado", req.url));
        }
      }

      // Evitar que un rol acceda a la sección del otro
      if (pathname.startsWith("/admin") && rol !== "admin") {
        return NextResponse.redirect(new URL("/encargado", req.url));
      }

      if (pathname.startsWith("/encargado") && rol !== "encargado") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }

    } catch (error) {
      // Token inválido o expirado: redirigir al login
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/encargado/:path*", "/login"],
};
