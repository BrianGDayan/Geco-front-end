import { fetcher } from "./api";

export interface LoginDto {
  idUsuario: number;
  clave: string;
}

export interface LoginResponse {
  id_usuario: number;
  rol: 'admin' | 'encargado';
  access_token?: string;
}

export async function login(loginDto: LoginDto): Promise<LoginResponse> {
  const res = await fetcher<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(loginDto),
  });

  // guardar token en localStorage si viene
  if ((res as any).access_token) {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", (res as any).access_token);
    }
  }

  return res;
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  }
}
