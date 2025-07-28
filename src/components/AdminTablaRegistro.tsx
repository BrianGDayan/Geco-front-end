'use client';

import React, { useState, useEffect } from 'react';
import { PlanillaResponse, DetalleResponse, RegistroResponse, UpdateDetalle, updateDetallesBatch, uploadEspecificacion } from '@/lib/planillas';
import type { UpdateDetalleDto } from '@/lib/planillas';
import EspecificacionImagen from '@/components/EspecificacionImagen';

function highlight(field: string, camposModificados?: string[]) {
  return camposModificados?.includes(field)
    ? 'border-2 border-red-500'
    : '';
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
  medida_diametro: string;
  tipo: string;
  longitud_corte: string;
  cantidad_total: string;
}

export default function AdminTablaRegistro({ planilla, detalles, idTarea, onSave }: Props) {

  const [editDetalles, setEditDetalles] = useState<Record<number, EditDetalle>>({});
  const fileInputs = React.useRef<Record<number, HTMLInputElement>>({}).current;
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enCurso = planilla.progreso < 100;

  useEffect(() => {
    const inicial: Record<number, EditDetalle> = detalles.reduce((acc, d) => {
      acc[d.id_detalle] = {
        especificacion: d.especificacion,
        posicion:       d.posicion,
        tipo:           String(d.tipo),
        medida_diametro: String(d.medida_diametro),
        longitud_corte: String(d.longitud_corte),
        cantidad_total: String(d.cantidad_total),
      };
      return acc;
    }, {} as Record<number, EditDetalle>);
    setEditDetalles(inicial);
  }, [detalles]);

  const handleFieldChange = (
    idDetalle: number,
    field: FieldKey,
    value: string | number
  ) => {
    setEditDetalles(prev => ({
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
    const updates = detalles
      .filter(d => {
        const upd = editDetalles[d.id_detalle];
        return (
          upd.especificacion   !== d.especificacion ||
          upd.posicion         !== d.posicion       ||
          parseInt(upd.tipo)   !== parseInt(String(d.tipo)) ||
          parseFloat(upd.longitud_corte)  !== d.longitud_corte ||
          parseFloat(upd.medida_diametro) !== d.medida_diametro ||
          parseFloat(upd.cantidad_total)  !== d.cantidad_total
        );
      })
      .map(d => ({
        idDetalle: d.id_detalle,
        updateDetalleDto: {
          especificacion:  editDetalles[d.id_detalle]?.especificacion || '',
          posicion:        editDetalles[d.id_detalle]?.posicion       || '',
          tipo:            parseInt(editDetalles[d.id_detalle]?.tipo || '0', 10),
          longitudCorte:   parseFloat(editDetalles[d.id_detalle]?.longitud_corte || '0'),
          medidaDiametro:  parseFloat(editDetalles[d.id_detalle]?.medida_diametro || '0'),
          cantidadTotal:   parseFloat(editDetalles[d.id_detalle]?.cantidad_total  || '0'),
        } as UpdateDetalleDto,
      }));

  if (updates.length > 0) {
      const nro = planilla.nro_planilla.trim();
      await updateDetallesBatch(nro, updates);
    }
    await onSave();
  } catch (e: any) {
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
            {horasCols.map(h => <th key={h} className="py-1 px-3 border text-xs">{h}</th>)}
            {rendCols.map(r => <th key={r} className="py-1 px-3 border text-xs">{r}</th>)}
          </tr>
        </thead>
        <tbody>
          {detalles.map(d => {
            const tareaName = idTarea === 1 ? 'Corte' : idTarea === 2 ? 'Doblado' : 'Empaquetado';
            const tareaObj = d.detalle_tarea.find(dt => dt.tarea.nombre_tarea === tareaName);
            const registros: RegistroResponse[] = tareaObj?.registro ?? [];
            const rowSpan = registros.length || 1;
            if (registros.length > 0) {
              return registros.map((r, idx) => (
                <tr key={r.id_registro} className="border-t">
                  {idx === 0 && (
                    <>
                      <td rowSpan={rowSpan} className="py-2 px-3 border text-center">{d.nombre_elemento}</td>
                      <td rowSpan={rowSpan} className={`py-2 px-3 border relative ${highlight('especificacion', d.campos_modificados)}`}>
                        <EspecificacionImagen publicId={d.especificacion} width={200} height={200} alt={`Detalle ${d.id_detalle}`} />
                        {enCurso && (
                          <>
                            <button
                              onClick={() => fileInputs[d.id_detalle].click()}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              title="Cambiar especificación"
                            />
                            <input
                              type="file"
                              accept="image/*"
                              ref={el => { if (el) fileInputs[d.id_detalle] = el; }}
                              style={{ display: 'none' }}
                              onChange={async e => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                  const oldId = d.especificacion || undefined;
                                  const { publicId } = await uploadEspecificacion(file, oldId);
                                  await UpdateDetalle(d.id_detalle, { especificacion: publicId });
                                  handleFieldChange(d.id_detalle, 'especificacion', publicId);
                                } catch {
                                  window.alert('Error al subir la imagen. Por favor intenta de nuevo.');
                                }
                              }}
                            />
                          </>
                        )}
                      </td>
                      <td rowSpan={rowSpan} className={`py-2 px-3 border ${highlight('posicion', d.campos_modificados)}`}>
                        <input
                          type="text"
                          value={editDetalles[d.id_detalle]?.posicion || ''}
                          onChange={e => handleFieldChange(d.id_detalle, 'posicion', e.target.value)}
                          disabled={!enCurso}
                          className="w-full border rounded px-1 py-0.5 text-sm"
                        />
                      </td>
                      <td rowSpan={rowSpan} className={`py-2 px-3 border ${highlight('tipo', d.campos_modificados)}`}>
                        <input
                          type="number"
                          value={editDetalles[d.id_detalle]?.tipo || ''}
                          onChange={e => handleFieldChange(d.id_detalle, 'tipo', +e.target.value)}
                          disabled={!enCurso}
                          className="w-full border rounded px-1 py-0.5 text-sm"
                          step="1"
                        />
                      </td>
                      <td rowSpan={rowSpan} className={`py-2 px-3 border ${highlight('medida_diametro', d.campos_modificados)}`}>
                        <input
                          type="number"
                          value={editDetalles[d.id_detalle]?.medida_diametro || ''}
                          onChange={e => handleFieldChange(d.id_detalle, 'medida_diametro', +e.target.value)}
                          disabled={!enCurso}
                          className="w-full border rounded px-1 py-0.5 text-sm"
                          step="1"
                        />
                      </td>
                      <td rowSpan={rowSpan} className={`py-2 px-3 border ${highlight('longitud_corte', d.campos_modificados)}`}>
                        <input
                          type="number"
                          value={editDetalles[d.id_detalle]?.longitud_corte || ''}
                          onChange={e => handleFieldChange(d.id_detalle, 'longitud_corte', +e.target.value)}
                          disabled={!enCurso}
                          className="w-full border rounded px-1 py-0.5 text-sm"
                          step="0.01"
                        />
                      </td>
                      <td rowSpan={rowSpan} className={`py-2 px-3 border border-r-2 bg-primary-light text-gray-900 font-semibold ${highlight('cantidad_total', d.campos_modificados)}`}>
                        <input
                          type="number"
                          value={editDetalles[d.id_detalle]?.cantidad_total || ''}
                          onChange={e => handleFieldChange(d.id_detalle, 'cantidad_total', +e.target.value)}
                          disabled={!enCurso}
                          className="w-full border rounded px-1 py-0.5 text-sm bg-white"
                          step="1"
                        />
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
                <td rowSpan={rowSpan} className={`py-2 px-3 border relative ${highlight('especificacion', d.campos_modificados)}`}>
                  <EspecificacionImagen publicId={d.especificacion} width={200} height={200} alt={`Detalle ${d.id_detalle}`} />
                    {enCurso && (
                      <>
                        <button
                          onClick={() => fileInputs[d.id_detalle].click()}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          title="Cambiar especificación"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          ref={el => { if (el) fileInputs[d.id_detalle] = el; }}
                          style={{ display: 'none' }}
                          onChange={async e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const oldId = d.especificacion || undefined;
                              const { publicId } = await uploadEspecificacion(file, oldId);
                              await UpdateDetalle(d.id_detalle, { especificacion: publicId });
                              handleFieldChange(d.id_detalle, 'especificacion', publicId);
                            } catch {
                              window.alert('Error al subir la imagen. Por favor intenta de nuevo.');
                            }
                          }}
                        />
                      </>
                    )}
                </td>
                <td rowSpan={rowSpan} className={`py-2 px-3 border ${highlight('posicion', d.campos_modificados)}`}>
                  <input
                    type="text"
                    value={editDetalles[d.id_detalle]?.posicion || ''}
                    onChange={e => handleFieldChange(d.id_detalle, 'posicion', e.target.value)}
                    disabled={!enCurso}
                    className="w-full border rounded px-1 py-0.5 text-sm"
                  />
                </td>
                <td rowSpan={rowSpan} className={`py-2 px-3 border ${highlight('tipo', d.campos_modificados)}`}>
                  <input
                    type="number"
                    value={editDetalles[d.id_detalle]?.tipo || ''}
                    onChange={e => handleFieldChange(d.id_detalle, 'tipo', +e.target.value)}
                    disabled={!enCurso}
                    className="w-full border rounded px-1 py-0.5 text-sm"
                    step="1"
                  />
                </td>
                <td className={`py-2 px-3 border ${highlight('medida_diametro', d.campos_modificados)}`}>
                  <input
                    type="number"
                    value={editDetalles[d.id_detalle]?.medida_diametro || ''}
                    onChange={e => handleFieldChange(d.id_detalle, 'medida_diametro', +e.target.value)}
                    disabled={!enCurso}
                    className="w-full border rounded px-1 py-0.5 text-sm"
                    step="1"
                  />
                </td>
                <td rowSpan={rowSpan} className={`py-2 px-3 border ${highlight('longitud_corte', d.campos_modificados)}`}>
                  <input
                    type="number"
                    value={editDetalles[d.id_detalle]?.longitud_corte || ''}
                    onChange={e => handleFieldChange(d.id_detalle, 'longitud_corte', +e.target.value)}
                    disabled={!enCurso}
                    className="w-full border rounded px-1 py-0.5 text-sm"
                    step="0.01"
                  />
                </td>
                <td rowSpan={rowSpan} className={`py-2 px-3 border border-r-2 bg-primary-light text-gray-900 font-semibold ${highlight('cantidad_total', d.campos_modificados)}`}>
                  <input
                    type="number"
                    value={editDetalles[d.id_detalle]?.cantidad_total || ''}
                    onChange={e => handleFieldChange(d.id_detalle, 'cantidad_total', +e.target.value)}
                    disabled={!enCurso}
                    className="w-full border rounded px-1 py-0.5 text-sm"
                    step="1"
                  />
                </td>
                <td colSpan={5} className="py-2 px-3 border text-center italic text-gray-500">No hay registros</td>
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
