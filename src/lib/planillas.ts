import { fetcher } from "./api";

export interface DetalleDto {
  especificacion: string;
  posicion: string;
  tipo: number | undefined;
  medidaDiametro: number | undefined;
  longitudCorte: number | undefined;
  cantidadUnitaria: number | undefined;
  nroElementos: number | undefined;
}

export interface UpdateDetalleDto {
  especificacion?: string;
  posicion?: string;
  tipo?: number;
  medidaDiametro?: number;
  longitudCorte?: number;
  cantidadTotal?: number;
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

export interface RegistroOperadorResponse {
  id_registro_operador: number;
  tiempo_horas: number;
  cantidad_unidades: number | null;
  rendimiento: number | null;
  trabajador: {
    id_trabajador: number;
    nombre: string;
  };
}

export interface RegistroResponse {
  id_registro: number;
  cantidad: number;
  fecha: string; 
  horas_trabajador: number;
  horas_ayudante: number | null;
  horas_ayudante2: number | null;

  rendimiento_trabajador: number;
  rendimiento_ayudante: number | null;
  rendimiento_ayudante2: number | null;

  trabajador: {
    nombre: string;
  };
  ayudante: {
    nombre: string;
  } | null;

  operadores?: RegistroOperadorResponse[];
}


export interface DetalleTareaResponse {
  id_detalle_tarea: number;
  cantidad_acumulada: number;
  completado: boolean;
  tarea: {
    nombre_tarea: string;
  };
  registro: RegistroResponse[];
}

export interface DetalleResponse {
  id_detalle: number;
  especificacion: string;
  posicion: string;
  tipo: string;
  medida_diametro: number;
  longitud_corte: number;
  cantidad_unitaria: number;
  nro_elementos: number;
  nro_iguales: number;
  cantidad_total: number;
  progreso: number;
  campos_modificados: string[];
  detalle_tarea: DetalleTareaResponse[];
}

export interface ElementoResponse {
  id_elemento: number;
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
  progreso: number;    
  peso_total: number;
  pesos_diametro: Array<{ diametro: number; peso: number }>;
  rendimiento_global_corte_trabajador: number;
  rendimiento_global_doblado_trabajador: number;
  rendimiento_global_empaquetado_trabajador: number;
  rendimiento_global_corte_ayudante: number;
  rendimiento_global_doblado_ayudante: number;
  rendimiento_global_doblado_ayudante2: number;
  rendimiento_global_empaquetado_ayudante: number;
  elemento: ElementoResponse[];
}

export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
}

export interface Diametro {
  medida_diametro: number;
}

export interface PlanillaSummary {
  nro_planilla: string;
  obra: string;
  nro_plano: string;
  sector: string;
  fecha: Date;
  item: string;
  progreso: number;
}

export interface RendimientosPromedio {
  rendimiento_global_corte_trabajador: number | null;
  rendimiento_global_doblado_trabajador: number | null;
  rendimiento_global_empaquetado_trabajador: number | null;
  rendimiento_global_corte_ayudante: number | null;
  rendimiento_global_doblado_ayudante: number | null;
  rendimiento_global_doblado_ayudante2: number | null;
  rendimiento_global_empaquetado_ayudante: number | null;
}


export interface BatchUpdate {
  idDetalle: number;
  updateDetalleDto: UpdateDetalleDto;
}

export async function getPlanillaByNro(nroPlanilla: string, idTarea: number): Promise<PlanillaResponse> {
  const res = await fetcher<PlanillaResponse>(`/planillas/${nroPlanilla}?idTarea=${idTarea}`);
  return res;
}

export async function getPlanillaCompleta(nroPlanilla: string): Promise<PlanillaResponse> {
  return await fetcher<PlanillaResponse>(`/planillas/${nroPlanilla}/completa`);
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

export async function getDiametros(): Promise<Diametro[]> {
  return fetcher<Diametro[]>("/planillas/diametros");
}

export async function CreatePlanilla(planillaDto: PlanillaDto): Promise<PlanillaResponse> {
  const res = await fetcher<PlanillaResponse>("/planillas", {
    method: "POST",
    body: JSON.stringify(planillaDto),
  });
  return res;
}


export async function uploadEspecificacion(file: File, oldPublicId?: string): Promise<CloudinaryUploadResult> {
  const form = new FormData();
  form.append("file", file);
  if (oldPublicId) {
    form.append("oldPublicId", oldPublicId);
  }
  return fetcher<CloudinaryUploadResult>("/cloudinary/upload", {
    method: "POST",
    body: form,
  });
}

export async function UpdateDetalle(idDetalle: number, updateDetalleDto:UpdateDetalleDto ): Promise<PlanillaResponse> {
  const res = await fetcher<PlanillaResponse>(`/planillas/detalles/${idDetalle}`, {
    method: "PATCH",
    body: JSON.stringify(updateDetalleDto),
  });
  return res;
}

export async function updateDetallesBatch(nroPlanilla: string, updates: BatchUpdate[]): Promise<PlanillaResponse> {
  const res = await fetcher<PlanillaResponse>(`/planillas/${nroPlanilla}/detalles/batch`, {
      method: 'PATCH',
      body: JSON.stringify({ updates }),
    }
  );
  return res;
}

export async function DeletePlanilla(nroPlanilla: string): Promise<void> {
  await fetcher(`/planillas/${nroPlanilla}`, {
    method: "DELETE",
  });
}
