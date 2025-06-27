'use client';

import React, { useState } from 'react';
import {
  PlanillaResponse,
  DetalleResponse,
  RegistroResponse,
  UpdateDetalle,
  updateDetallesBatch,
  uploadEspecificacion
} from '@/lib/planillas';
import type { UpdateDetalleDto } from '@/lib/planillas';
import EspecificacionImagen from '@/components/EspecificacionImagen';

// Helper para decidir la clase CSS de “resalte” de celdas
function highlight(field: string, modified: string[]) {
  return modified.includes(field) ? 'ring-2 ring-secondary-dark' : '';
}

type DetalleConNombre = DetalleResponse & { nombre_elemento: string };

type FieldKey = keyof EditDetalle;

interface Props {
  planilla: PlanillaResponse;
  detalles: DetalleConNombre[];
  idTarea: number;
  onSave: () => void;
}

interface EditDetalle {
  especificacion: string;
  posicion: string;
  tipo: string;
  longitud_corte: string;
}

function EditableCell({
  idDetalle,
  field,
  value,
  editable,
  onChange,
  type = 'text',
  step,
}: {
  idDetalle: number;
  field: FieldKey;
  value: string | number;
  editable: boolean;
  onChange: (id: number, field: FieldKey, value: string | number) => void;
  type?: 'text' | 'number';
  step?: string;
}) {
  if (!editable) return <>{value}</>;

  return (
    <input
      type={type}
      value={value}
      step={step}
      onChange={(e) =>
        onChange(
          idDetalle,
          field,
          type === 'number' ? Number(e.target.value) : e.target.value
        )
      }
      className="w-full border rounded px-1 py-0.5 text-sm"
    />
  );
}

export default function AdminTablaRegistro({
  planilla,
  detalles,
  idTarea,
  onSave,
}: Props) {
  const [editDetalles, setEditDetalles] = useState<Record<number, EditDetalle>>(
    () =>
      detalles.reduce((acc, d) => {
        acc[d.id_detalle] = {
          especificacion: d.especificacion,
          posicion: d.posicion,
          tipo: String(d.tipo),
          longitud_corte: String(d.longitud_corte),
        };
        return acc;
      }, {} as Record<number, EditDetalle>)
  );

  // Crea un objeto donde guardes refs a cada input
  const fileInputs = React.useRef<Record<number, HTMLInputElement>>({}).current;

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enCurso = planilla.progreso < 100;

  const handleFieldChange = (
    idDetalle: number,
    field: FieldKey,
    value: string | number
  ) => {
    setEditDetalles((prev) => ({
      ...prev,
      [idDetalle]: {
        ...prev[idDetalle],
        [field]: String(value),
      },
    }));
  };

  const handleGuardarCambios = async () => {
    setIsSaving(true);
    setError(null);

    try {
      // 1) Detecta sólo los detalles que cambiaron
      const updates = detalles
        .filter(d => {
          const upd = editDetalles[d.id_detalle];
          return (
            upd.especificacion  !== d.especificacion ||
            upd.posicion        !== d.posicion       ||
            parseInt(upd.tipo)  !== parseInt(String(d.tipo)) ||
            parseFloat(upd.longitud_corte) !== d.longitud_corte
          );
        })
        .map(d => ({
          idDetalle: d.id_detalle,
          dto: {
            especificacion: editDetalles[d.id_detalle].especificacion,
            posicion:       editDetalles[d.id_detalle].posicion,
            tipo:           parseInt(editDetalles[d.id_detalle].tipo, 10),
            longitudCorte:  parseFloat(editDetalles[d.id_detalle].longitud_corte),
          } as UpdateDetalleDto,
        }));

      // 2) Si hay cambios, envía todo en un batch
      if (updates.length > 0) {
        await updateDetallesBatch(planilla.nro_planilla, updates);
      }

      // 3) Refresca la vista (incluirá nuevo `revision` y `campos_modificados`)
      await onSave();
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Error guardando cambios');
    } finally {
      setIsSaving(false);
    }
};


  const horasCols = idTarea === 1
    ? ['Cort.1', 'Cort.2']
    : idTarea === 2
      ? ['Dob.', 'Ayu.']
      : ['Emp.1', 'Emp.2'];
  const rendCols = horasCols;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow mb-6">
      <table className="min-w-full text-sm border-collapse">
        <thead>
          <tr className="bg-primary-mid text-white">
            <th rowSpan={2} className="py-2 px-3 border">Elemento</th>
            <th rowSpan={2} className="py-2 px-3 border">Detalle</th>
            <th rowSpan={2} className="py-2 px-3 border">Posición</th>
            <th rowSpan={2} className="py-2 px-3 border">Tipo</th>
            <th rowSpan={2} className="py-2 px-3 border">Ø (mm)</th>
            <th rowSpan={2} className="py-2 px-3 border">Long. Corte (m)</th>
            <th rowSpan={2} className="py-2 px-3 border bg-primary-light text-white">Cant. Total</th>
            <th rowSpan={2} className="py-2 px-3 border">Fecha</th>
            <th colSpan={2} className="py-2 px-3 border">Horas</th>
            <th colSpan={2} className="py-2 px-3 border">Rendimiento</th>
          </tr>
          <tr className="bg-primary-dark text-white">
            {horasCols.map((h) => (
              <th key={h} className="py-1 px-3 border text-xs">{h}</th>
            ))}
            {rendCols.map((r) => (
              <th key={r} className="py-1 px-3 border text-xs">{r}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {detalles.map((d) => {
            const registros: RegistroResponse[] = d.detalle_tarea[0]?.registro ?? [];
            const rowSpan = registros.length || 1;

            if (registros.length > 0) {
              return registros.map((r, idx) => (
                <tr key={r.id_registro} className="border-t">
                  {idx === 0 && (
                    <>
                      <td rowSpan={rowSpan} className="py-2 px-3 border text-center">{d.nombre_elemento}</td>
                      <td rowSpan={rowSpan} className={`py-2 px-3 border relative ${highlight('especificacion', d.campos_modificados)}`}>
                        {/* Siempre muestro la imagen */}
                        <EspecificacionImagen
                          publicId={d.especificacion}
                          width={100}
                          height={100}
                          alt={`Detalle ${d.id_detalle}`}
                        />
                        {/* Si está en curso, input transparente encima */}
                        {enCurso && (
                          <>
                            {/* Invisible transparente para clickear */}
                            <button
                              onClick={() => fileInputs[d.id_detalle].click()}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              title="Cambiar especificación"
                            />
                            {/* El input file real, oculto */}
                            <input
                              type="file"
                              accept="image/*"
                              ref={(el) => {
                                if (el) {
                                  fileInputs[d.id_detalle] = el;
                                }
                              }}
                              style={{ display: 'none' }}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                  const { publicId } = await uploadEspecificacion(file);
                                  // Actualiza estado local
                                  handleFieldChange(d.id_detalle, 'especificacion', publicId);
                                } catch (err) {
                                  console.error('Error subiendo imagen:', err);
                                }
                              }}
                            />
                          </>
                        )}
                      </td>
                      <td rowSpan={rowSpan} className={`py-2 px-3 border ${highlight('posicion', d.campos_modificados)}`}>
                        <EditableCell
                          idDetalle={d.id_detalle}
                          field="posicion"
                          value={editDetalles[d.id_detalle].posicion}
                          editable={enCurso}
                          onChange={handleFieldChange}
                        />
                      </td>
                      <td rowSpan={rowSpan} className={`py-2 px-3 border ${highlight('tipo', d.campos_modificados)}`}>
                        <EditableCell
                          idDetalle={d.id_detalle}
                          field="tipo"
                          value={editDetalles[d.id_detalle].tipo}
                          editable={enCurso}
                          onChange={handleFieldChange}
                          type="number"
                        />
                      </td>
                      <td rowSpan={rowSpan} className="py-2 px-3 border">{d.medida_diametro}</td>
                      <td rowSpan={rowSpan} className={`py-2 px-3 border ${highlight('longitud_corte', d.campos_modificados)}`}>
                        <EditableCell
                          idDetalle={d.id_detalle}
                          field="longitud_corte"
                          value={editDetalles[d.id_detalle].longitud_corte}
                          editable={enCurso}
                          onChange={handleFieldChange}
                          type="number"
                          step="0.01"
                        />
                      </td>
                      <td rowSpan={rowSpan} className={`py-2 px-3 border bg-primary-light text-white font-semibold ${highlight('cantidad_total', d.campos_modificados)}`}>
                        {d.cantidad_total}
                      </td>
                    </>
                  )}
                  <td className="py-2 px-3 border">{new Date(r.fecha).toLocaleDateString('es-ES')}</td>
                  <td className="py-2 px-3 border">{r.horas_trabajador}</td>
                  <td className="py-2 px-3 border">{r.horas_ayudante}</td>
                  <td className="py-2 px-3 border">{r.rendimiento_trabajador.toFixed(2)}</td>
                  <td className="py-2 px-3 border">{r.rendimiento_ayudante.toFixed(2)}</td>
                </tr>
              ));
            }

            return (
              <tr key={`d-${d.id_detalle}`} className="border-t">
                <td className="py-2 px-3 border text-center">{d.nombre_elemento}</td>
                <td className="py-2 px-3 border relative">
                  <EspecificacionImagen
                    publicId={d.especificacion}
                    width={100}
                    height={100}
                    alt={`Detalle ${d.id_detalle}`}
                  />
                  {enCurso && (
                    <input
                      type="text"
                      value={editDetalles[d.id_detalle].especificacion}
                      onChange={e =>
                        handleFieldChange(d.id_detalle, 'especificacion', e.target.value)
                      }
                      className="absolute inset-0 w-full h-full opacity-0 cursor-text"
                    />
                  )}
                </td>
                <td className="py-2 px-3 border">
                  <EditableCell
                    idDetalle={d.id_detalle}
                    field="posicion"
                    value={editDetalles[d.id_detalle].posicion}
                    editable={enCurso}
                    onChange={handleFieldChange}
                  />
                </td>
                <td className="py-2 px-3 border">
                  <EditableCell
                    idDetalle={d.id_detalle}
                    field="tipo"
                    value={editDetalles[d.id_detalle].tipo}
                    editable={enCurso}
                    onChange={handleFieldChange}
                    type="number"
                  />
                </td>
                <td className="py-2 px-3 border">{d.medida_diametro}</td>
                <td className="py-2 px-3 border">
                  <EditableCell
                    idDetalle={d.id_detalle}
                    field="longitud_corte"
                    value={editDetalles[d.id_detalle].longitud_corte}
                    editable={enCurso}
                    onChange={handleFieldChange}
                    type="number"
                    step="0.01"
                  />
                </td>
                <td className="py-2 px-3 border bg-primary-light text-white font-semibold">
                  {d.cantidad_total}
                </td>
                <td colSpan={5} className="py-2 px-3 border text-center italic text-gray-500">
                  No hay registros
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {enCurso && (
        <div className="flex justify-center my-4">
          <button
            onClick={handleGuardarCambios}
            disabled={isSaving}
            className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-mid disabled:opacity-50"
          >
            {isSaving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      )}

      {error && <p className="text-red-500 text-center text-sm">{error}</p>}
    </div>
  );
}
