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
  console.log("Middleware ejecutado para ruta:", req.nextUrl.pathname);

  const token = req.cookies.get("access_token")?.value;
  const { pathname } = req.nextUrl;

  if (!token && (pathname.startsWith("/admin") || pathname.startsWith("/encargado"))) {
    console.log("No token y ruta protegida, redirigiendo a login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token) {
    try {
      const { payload } = await jwtVerify(token, getJwtSecretKey());
      const rol = payload.rol;
      console.log("Token válido, rol:", rol);

      if (pathname === "/login") {
        if (rol === "admin") {
          return NextResponse.redirect(new URL("/admin", req.url));
        }
        if (rol === "encargado") {
          return NextResponse.redirect(new URL("/encargado", req.url));
        }
      }

      if (pathname.startsWith("/admin") && rol !== "admin") {
        console.log("Usuario no admin intentando acceder a /admin, redirigiendo");
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
      if (pathname.startsWith("/encargado") && rol !== "encargado") {
        console.log("Usuario no encargado intentando acceder a /encargado, redirigiendo");
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }

    } catch (error) {
      console.log("Error en validación JWT:", error);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/encargado", "/encargado/:path*", "/login"],
};
