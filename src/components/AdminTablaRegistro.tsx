// components/AdminTablaRegistro.tsx
'use client';

import React, { useState } from 'react';
import { DetalleResponse, RegistroResponse, PlanillaResponse } from '@/lib/planillas';
import { UpdateRegistro } from '@/lib/registros';

interface Props {
  planilla: PlanillaResponse;
  detalles: DetalleResponse[];
  idTarea: number;
  onSave: () => void;
}

export default function AdminTablaRegistro({ planilla, detalles, idTarea, onSave }: Props) {
  // Estado local para editar cada registro en la tabla
  // Clave: id_registro, valor: { cantidad, horas_trabajador, horas_ayudante }
  const [ediciones, setEdiciones] = useState<Record<number, {
    cantidad: number;
    horasTrabajador: number;
    horasAyudante: number;
  }>>(() => {
    const initial: typeof ediciones = {};
    detalles.forEach((d) => {
      d.detalle_tarea[0].registro.forEach((r: RegistroResponse) => {
        initial[r.id_registro] = {
          cantidad: r.cantidad,
          horasTrabajador: r.horas_trabajador,
          horasAyudante: r.horas_ayudante,
        };
      });
    });
    return initial;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para guardar todas las ediciones
  const guardarCambios = async () => {
    setIsSaving(true);
    setError(null);
    try {
      // Iteramos cada registro editado y enviamos PATCH
      for (const [idReg, data] of Object.entries(ediciones)) {
        const id = Number(idReg);
        await UpdateRegistro(id, {
          cantidad: data.cantidad,
          horasTrabajador: data.horasTrabajador,
          horasAyudante: data.horasAyudante,
        });
      }
      onSave(); // refrescar vista
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al guardar cambios');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow mb-6">
      <table className="min-w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-primary-mid text-white">
            <th className="py-2 px-3 border border-primary-dark">Elemento</th>
            <th className="py-2 px-3 border border-primary-dark">Detalle</th>
            <th className="py-2 px-3 border border-primary-dark">Posición</th>
            <th className="py-2 px-3 border border-primary-dark">Tipo</th>
            <th className="py-2 px-3 border border-primary-dark">Ø (mm)</th>
            <th className="py-2 px-3 border border-primary-dark">Long. Corte (m)</th>
            <th className="py-2 px-3 border border-primary-dark bg-primary-light text-white">
              Cantidad Total
            </th>
            <th className="py-2 px-3 border border-primary-dark">Fecha</th>
            <th className="py-2 px-3 border border-primary-dark">Cantidad Oficial</th>
            <th className="py-2 px-3 border border-primary-dark">Horas Oficial</th>
            <th className="py-2 px-3 border border-primary-dark">Cantidad Ayudante</th>
            <th className="py-2 px-3 border border-primary-dark">Horas Ayudante</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((d, idxDetalle) =>
            d.detalle_tarea[0].registro.map((r: RegistroResponse, idxReg) => {
              const filaClave = `${d.posicion}-${r.id_registro}`;
              const valores = ediciones[r.id_registro];
              return (
                <tr key={filaClave} className="border-t border-gray-border">
                  {idxReg === 0 && (
                    <>
                      {/* Sólo en la primera fila de este detalle mostramos columnas agrupadas */}
                      <td rowSpan={d.detalle_tarea[0].registro.length} className="py-2 px-3 border border-gray-border">
                        {d.posicion.startsWith('P') ? d.posicion : `P${idxDetalle + 1}`}
                      </td>
                      <td rowSpan={d.detalle_tarea[0].registro.length} className="py-2 px-3 border border-gray-border">
                        {d.posicion}
                      </td>
                      <td rowSpan={d.detalle_tarea[0].registro.length} className="py-2 px-3 border border-gray-border">
                        {d.posicion}
                      </td>
                      <td rowSpan={d.detalle_tarea[0].registro.length} className="py-2 px-3 border border-gray-border">
                        {d.tipo}
                      </td>
                      <td rowSpan={d.detalle_tarea[0].registro.length} className="py-2 px-3 border border-gray-border">
                        {d.medida_diametro}
                      </td>
                      <td rowSpan={d.detalle_tarea[0].registro.length} className="py-2 px-3 border border-gray-border">
                        {d.longitud_corte}
                      </td>
                      <td rowSpan={d.detalle_tarea[0].registro.length} className="py-2 px-3 border border-gray-border bg-primary-light text-white font-semibold">
                        {d.cantidad_total}
                      </td>
                    </>
                  )}

                  {/* Fecha (sólo lectura) */}
                  <td className="py-2 px-3 border border-gray-border">
                    {new Date(r.fecha).toLocaleDateString('es-ES')}
                  </td>

                  {/* Cantidad Oficial (input) */}
                  <td className="py-2 px-3 border border-gray-border">
                    <input
                      type="number"
                      value={valores.cantidad}
                      onChange={(e) =>
                        setEdiciones((prev) => ({
                          ...prev,
                          [r.id_registro]: {
                            ...prev[r.id_registro],
                            cantidad: Number(e.target.value),
                          },
                        }))
                      }
                      className="w-full bg-gray-bg border border-gray-border rounded-md px-2 py-1 text-sm text-gray-text"
                    />
                  </td>

                  {/* Horas Oficial (input) */}
                  <td className="py-2 px-3 border border-gray-border">
                    <input
                      type="number"
                      step="0.01"
                      value={valores.horasTrabajador}
                      onChange={(e) =>
                        setEdiciones((prev) => ({
                          ...prev,
                          [r.id_registro]: {
                            ...prev[r.id_registro],
                            horasTrabajador: Number(e.target.value),
                          },
                        }))
                      }
                      className="w-full bg-gray-bg border border-gray-border rounded-md px-2 py-1 text-sm text-gray-text"
                    />
                  </td>

                  {/* Cantidad Ayudante (input) */}
                  <td className="py-2 px-3 border border-gray-border">
                    <input
                      type="number"
                      value={valores.cantidad} // Si el ayudante no tiene “cantidad”, duplicamos
                      onChange={(e) =>
                        setEdiciones((prev) => ({
                          ...prev,
                          [r.id_registro]: {
                            ...prev[r.id_registro],
                            cantidad: Number(e.target.value),
                          },
                        }))
                      }
                      className="w-full bg-gray-bg border border-gray-border rounded-md px-2 py-1 text-sm text-gray-text"
                    />
                  </td>

                  {/* Horas Ayudante (input) */}
                  <td className="py-2 px-3 border border-gray-border">
                    <input
                      type="number"
                      step="0.01"
                      value={valores.horasAyudante}
                      onChange={(e) =>
                        setEdiciones((prev) => ({
                          ...prev,
                          [r.id_registro]: {
                            ...prev[r.id_registro],
                            horasAyudante: Number(e.target.value),
                          },
                        }))
                      }
                      className="w-full bg-gray-bg border border-gray-border rounded-md px-2 py-1 text-sm text-gray-text"
                    />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Botón central para “Guardar cambios” */}
      <div className="flex justify-center my-4">
        <button
          onClick={guardarCambios}
          disabled={isSaving}
          className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-mid disabled:opacity-50"
        >
          {isSaving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>

      {error && <p className="text-red-500 text-center text-sm">{error}</p>}
    </div>
  );
}
