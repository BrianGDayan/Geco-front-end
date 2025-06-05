import { fetcher } from "./api";

export interface DetalleDto {
  especificacion: string;
  posicion: number;
  tipo: number;
  medidaDiametro: number;
  longitudCorte: number;
  cantidadUnitaria: number;
  nroElementos: number;
  nroIguales: number;
}

export interface UpdateDetalleDto {
  especificacion?: string;
  posicion?: number;
  tipo?: number;
  medidaDiametro?: number;
  longitudCorte?: number;
  cantidadUnitaria?: number;
  nroElementos?: number;
  nroIguales?: number;
}

export interface ElementoDto {
  nombre: string;
  detalle: DetalleDto[];
}

export interface PlanillaDto {
  nroPlanilla: string;
  obra: string;
  nroPlano: string;
  sector: string;
  encargadoElaborar: string;    
  encargadoRevisar: string;
  encargadoAprobar: string;
  fecha: Date;
  item: string;
  elemento: ElementoDto[];
}

export interface RegistroResponse {
  id_registro: number;
  cantidad: number;
  fecha: Date;
  horas_trabajador: number;
  horas_ayudante: number;
  rendimiento_trabajador: number;
  rendimiento_ayudante: number;
  trabajador: {
    nombre: string;
  };
  ayudante: {
    nombre: string;
  } | null;
}


export interface DetalleTareaResponse {
  id_detalle_tarea: number;
  tarea: { nombre_tarea: string };
  registro: RegistroResponse[];
}

export interface DetalleResponse {
  especificacion: string;
  posicion: number;
  tipo: string;
  medida_diametro: number;
  longitud_corte: number;
  cantidad_unitaria: number;
  nro_elementos: number;
  nro_iguales: number;
  cantidad_total: number;
  detalle_tarea: DetalleTareaResponse[];
}

export interface ElementoResponse {
  nombre_elemento: string;
  detalle: DetalleResponse[];
}

export interface PlanillaResponse {
  nro_planilla: string;
  obra: string;
  nro_plano: string;
  sector: string;
  encargado_elaborar: string;    
  encargado_revisar: string;
  encargado_aprobar: string;
  fecha: Date;
  revision: number;
  item: string;
  rendimiento_global_corte_trabajador: number;
  rendimiento_global_doblado_trabajador: number;
  rendimiento_global_empaquetado_trabajador: number;
  rendimiento_global_corte_ayudante: number;
  rendimiento_global_doblado_ayudante: number;
  rendimiento_global_empaquetado_ayudante: number;
  elemento: ElementoResponse[];
}

export interface PlanillaSummary {
  nro_planilla: string;
  obra: string;
  nro_plano: string;
  sector: string;
  item: string;
  progreso: number;
}

export interface RendimientosPromedio {
  rendimiento_global_corte_trabajador: number | null;
  rendimiento_global_doblado_trabajador: number | null;
  rendimiento_global_empaquetado_trabajador: number | null;
  rendimiento_global_corte_ayudante: number | null;
  rendimiento_global_doblado_ayudante: number | null;
  rendimiento_global_empaquetado_ayudante: number | null;
}

export async function getPlanillaByNro(nroPlanilla: string, idTarea: number): Promise<PlanillaResponse> {
  const res = await fetcher<PlanillaResponse>(`/planillas/${nroPlanilla}?idTarea=${idTarea}`);
  return res;
}

export async function getPlanillasCompletadas(): Promise<PlanillaSummary[]> {
  const res = await fetcher<PlanillaSummary[]>("/planillas/completadas");
  return res;
}

export async function getPlanillasEnCurso(): Promise<PlanillaSummary[]> {
  const res = await fetcher<PlanillaSummary[]>("/planillas/en-curso");
  return res;
}

export async function getObras(): Promise<string[]> {
  return await fetcher<string[]>("/planillas/obras");
}

export async function getRendimientosPorObra(obra: string): Promise<RendimientosPromedio> {
  const res = await fetcher<RendimientosPromedio>(`/planillas/rendimientos?obra=${obra}`);
  return res;
}

export async function CreatePlanilla(planillaDto: PlanillaDto): Promise<PlanillaResponse> {
  const res = await fetcher<PlanillaResponse>("/planillas", {
    method: "POST",
    body: JSON.stringify(planillaDto),
  });
  return res;
}

export async function UpdateDetalle(idDetalle: number, updateDetalleDto:UpdateDetalleDto ): Promise<PlanillaResponse> {
  const res = await fetcher<PlanillaResponse>(`/planillas/detalles/${idDetalle}`, {
    method: "PATCH",
    body: JSON.stringify(updateDetalleDto),
  });
  return res;
}

export async function DeletePlanilla(nroPlanilla: string): Promise<void> {
  await fetcher(`/planillas/${nroPlanilla}`, {
    method: "DELETE",
  });
}
