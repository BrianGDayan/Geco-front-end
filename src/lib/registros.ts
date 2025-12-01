import { fetcher } from "./api";

export interface OperadorRegistro {
  id_trabajador: number;
  tiempo_horas: number;
  cantidad_unidades: number;
  rendimiento: number;
  slot: number;
}

export interface RegistroDto {
  idDetalle: number;
  idTarea: number;
  cantidad: number;
  operadores: {
    idTrabajador: number;
    tiempoHoras: number;
    slot: number;
  }[];
}

export interface RegistroResponse {
  id_registro: number;
  id_detalle_tarea: number;
  fecha: string;
  cantidad: number;
  id_usuario: number;
  operadores: OperadorRegistro[];
}

export async function CreateRegistro(data: RegistroDto) {
  return fetcher("/registros", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
