import { fetcher } from "./api";

export interface LoginDto {
  idUsuario: number;
  clave: string;
}

export interface LoginResponse {
  id_usuario: number;
  rol: 'admin' | 'encargado';
  token: string;
}


export async function login(loginDto: LoginDto): Promise<LoginResponse> {
  const res = await fetcher<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(loginDto),
  });
  localStorage.setItem("token", res.token);
  return res;
}