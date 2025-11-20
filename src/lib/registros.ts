import { fetcher } from "./api";

export interface OperadorRegistro {
  id_trabajador: number;
  tiempo_horas: number;
  cantidad_unidades: number;
  rendimiento: number;
}

export interface RegistroDto {
  idDetalle: number;
  idTarea: number;
  cantidad: number;
  operadores: {
    idTrabajador: number;
    tiempoHoras: number;
  }[];
}

export interface RegistroResponse {
  id_registro: number;
  id_detalle_tarea: number;
  fecha: string;
  cantidad: number;
  horas_trabajador: number;
  horas_ayudante: number | null;
  horas_ayudante2: number | null;
  rendimiento_trabajador: number;
  rendimiento_ayudante: number | null;
  rendimiento_ayudante2: number | null;
  id_usuario: number;
  id_trabajador: number;
  id_ayudante: number | null;
  id_ayudante2: number | null;
  operadores?: OperadorRegistro[];
}

export async function CreateRegistro(data: RegistroDto) {
  return fetcher("/registros", {
    method: "POST",
    body: JSON.stringify(data),
  });
}