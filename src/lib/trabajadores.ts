import { fetcher } from "./api";

export interface RendimientoResponse {
    id_trabajador: number;
    nombre: string;
    activo: boolean;
    rendimiento_corte?: number;
    rendimiento_doblado?: number;
    rendimiento_empaquetado?: number;
}

export interface TrabajadorPerformance {
    id: number;
    nombre: string;
    rendimiento: number;
}

export async function getRendimientosPorTarea(idTarea: number): Promise<TrabajadorPerformance[]> {
  const res = await fetcher<RendimientoResponse[]>(`/trabajadores/rendimiento-por-tarea?idTarea=${idTarea}`);
  return res.map((t) => {
    const rendimiento = t.rendimiento_corte ?? t.rendimiento_doblado ?? t.rendimiento_empaquetado ?? 0;
    return {
      id: t.id_trabajador,
      nombre: t.nombre,
      rendimiento,
    };
  });
}