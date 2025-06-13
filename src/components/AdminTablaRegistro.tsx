// components/AdminTablaRegistro.tsx
'use client';

import React, { useState } from 'react';
import {
  PlanillaResponse,
  RegistroResponse,
  DetalleResponse,
} from '@/lib/planillas';
import { UpdateRegistro } from '@/lib/registros';

type DetalleConNombre = DetalleResponse & { nombre_elemento: string };

interface Props {
  planilla: PlanillaResponse;
  detalles: DetalleConNombre[];
  idTarea: number;
  onSave: () => void;
}

export default function AdminTablaRegistro({
  planilla,
  detalles,
  idTarea,
  onSave,
}: Props) {
  const [ediciones, setEdiciones] = useState<Record<
    number,
    { cantidad: number; horasTrabajador: number; horasAyudante: number }
  >>(() => {
    const initial: Record<number, any> = {};
    detalles.forEach((d) => {
      d.detalle_tarea[0].registro.forEach((r) => {
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

  const guardarCambios = async () => {
    setIsSaving(true);
    setError(null);
    try {
      for (const [idReg, data] of Object.entries(ediciones)) {
        await UpdateRegistro(Number(idReg), {
          cantidad: data.cantidad,
          horasTrabajador: data.horasTrabajador,
          horasAyudante: data.horasAyudante,
        });
      }
      onSave();
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
            <th className="py-2 px-3 border border-primary-dark">
              Cantidad Oficial
            </th>
            <th className="py-2 px-3 border border-primary-dark">Horas Oficial</th>
            <th className="py-2 px-3 border border-primary-dark">
              Horas Ayudante
            </th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((d) =>
            d.detalle_tarea[0].registro.map((r: RegistroResponse, idxReg) => {
              const rowSpan = d.detalle_tarea[0].registro.length;
              const valores = ediciones[r.id_registro];
              return (
                <tr key={r.id_registro} className="border-t border-gray-border">
                  {idxReg === 0 && (
                    <>
                      <td
                        rowSpan={rowSpan}
                        className="py-2 px-3 border border-gray-border text-center"
                      >
                        {d.nombre_elemento}
                      </td>
                      <td
                        rowSpan={rowSpan}
                        className="py-2 px-3 border border-gray-border"
                      >
                        {d.especificacion}
                      </td>
                      <td
                        rowSpan={rowSpan}
                        className="py-2 px-3 border border-gray-border"
                      >
                        {d.posicion}
                      </td>
                      <td
                        rowSpan={rowSpan}
                        className="py-2 px-3 border border-gray-border"
                      >
                        {d.tipo}
                      </td>
                      <td
                        rowSpan={rowSpan}
                        className="py-2 px-3 border border-gray-border"
                      >
                        {d.medida_diametro}
                      </td>
                      <td
                        rowSpan={rowSpan}
                        className="py-2 px-3 border border-gray-border"
                      >
                        {d.longitud_corte}
                      </td>
                      <td
                        rowSpan={rowSpan}
                        className="py-2 px-3 border border-gray-border bg-primary-light text-white font-semibold"
                      >
                        {d.cantidad_total}
                      </td>
                    </>
                  )}
                  <td className="py-2 px-3 border border-gray-border">
                    {new Date(r.fecha).toLocaleDateString('es-ES')}
                  </td>
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
