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

  console.log("🔒 Middleware ejecutado en:", pathname);

  const isAdminRoute = pathname.startsWith("/admin");
  const isEncargadoRoute = pathname.startsWith("/encargado");
  const isLoginRoute = pathname === "/login";

  // Si NO hay token y la ruta está protegida → redirigir
  if (!token && (isAdminRoute || isEncargadoRoute)) {
    console.log("❌ No token en ruta protegida, redirigiendo a /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Si HAY token, validar
  if (token) {
    try {
      const { payload } = await jwtVerify(token, getJwtSecretKey());
      const rol = payload.rol;

      console.log("✅ Token válido. Rol:", rol);

      // Si está logueado e intenta ir al login → redirigir a su home
      if (isLoginRoute) {
        return NextResponse.redirect(new URL(`/${rol}`, req.url));
      }

      // Protección por rol
      if (isAdminRoute && rol !== "admin") {
        console.log("⛔ Acceso denegado a /admin para rol:", rol);
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }

      if (isEncargadoRoute && rol !== "encargado") {
        console.log("⛔ Acceso denegado a /encargado para rol:", rol);
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }

    } catch (error) {
      console.error("⚠️ Error verificando el JWT:", error);
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

