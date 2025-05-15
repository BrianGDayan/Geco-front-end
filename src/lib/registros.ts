import { fetcher } from "./api";

export interface RegistroDto {
    idDetalle: number;
    idTarea: number;
    cantidad: number;
    horasTrabajador: number;
    horasAyudante: number;
    nombreTrabajador: string;
    nombreAyudante: string;
}

export interface UpdateRegistroDto {
    cantidad?: number;
    horasTrabajador?: number;
    horasAyudante?: number;
    nombreTrabajador?: string;
    nombreAyudante?: string;
}

export interface RegistroResponse {
  id_registro: number;  
  id_detalle_tarea: number;
  fecha: string,
  cantidad: number;
  horas_trabajador: number;
  horas_ayudante: number;
  rendimiento_trabajador: number;
  rendimiento_ayudante: number;
  id_usuario: number;
  id_trabajador: number;
  id_ayudante: number;
}

export interface RegistroUpdateResponse {
  cantidad: number;
  horas_trabajador: number;
  horas_ayudante: number;
  rendimiento_trabajador: number;
  rendimiento_ayudante: number;
  id_trabajador: number;
  id_ayudante: number;
}

export async function CreateRegistro(registroDto: RegistroDto): Promise<RegistroResponse> {
  const res = await fetcher<RegistroResponse>("/registros", {
    method: "POST",
    body: JSON.stringify(registroDto),
  });
  return res;
}

export async function UpdateRegistro(idRegistro: number, updateRegistroDto: UpdateRegistroDto): Promise<RegistroUpdateResponse> {
  const res = await fetcher<RegistroUpdateResponse>(`/registros/${idRegistro}`, {
    method: "PATCH",
    body: JSON.stringify(updateRegistroDto),
  });
  return res;
}