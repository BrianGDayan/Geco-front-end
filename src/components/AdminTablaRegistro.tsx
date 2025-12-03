'use client';

import React, { useState, useEffect } from 'react';
import { PlanillaResponse, DetalleResponse, RegistroResponse, UpdateDetalle, updateDetallesBatch } from '../lib/planillas';
import type { UpdateDetalleDto } from '../lib/planillas';
import EspecificacionImagen from '../components/EspecificacionImagen';

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

  // Cabeceras dinámicas según tarea
  const horasCols =
    idTarea === 1
      ? ['Cort.1', 'Cort.2']
      : idTarea === 2
        ? ['Dob.', 'Ayu.1', 'Ayu.2']
        : ['Emp.1', 'Emp.2'];

  const rendCols = horasCols;

  // ---- FIX DEFINITIVO: ordenar operadores por slot ----
  const getOperadoresOrdenados = (r: RegistroResponse) => {
  const ops = r.operadores ?? [];

  // fallback si falta slot → asignamos según orden original
  const opsWithSlot = ops.map((op, index) => ({
    ...op,
    slot: op.slot ?? index + 1
  }));

  return opsWithSlot.sort((a, b) => a.slot - b.slot);
};

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
            <th colSpan={horasCols.length} className="py-2 px-3 border">Horas</th>
            <th colSpan={rendCols.length} className="py-2 px-3 border">Rendimiento</th>
          </tr>
          <tr className="bg-primary-dark text-white">
            {horasCols.map(h => (
              <th key={h} className="py-1 px-3 border text-xs">{h}</th>
            ))}
            {rendCols.map(r => (
              <th key={r} className="py-1 px-3 border text-xs">{r}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {detalles.map(d => {
            const tipoNum = Number(d.tipo);

            const tareaName =
              idTarea === 1 ? "Corte" :
              idTarea === 2 ? "Doblado" :
              "Empaquetado";

            const tareaObj = d.detalle_tarea.find(
              dt => dt.tarea.nombre_tarea === tareaName
            );

            const registros: RegistroResponse[] = tareaObj?.registro ?? [];
            const rowSpan = registros.length || 1;

            const noDoblado = idTarea === 2 && tipoNum === 1;
            const noEmpaquetado = idTarea === 3 && tipoNum === 4;
            const mostrarNoCorresponde = noDoblado || noEmpaquetado;

            if (registros.length > 0) {
              return registros.map((r, idx) => {
                const ops = getOperadoresOrdenados(r);

                // ---- FIX: elegir operador según slot ----
                const op1 = ops.find(o => o.slot === 1)?.tiempo_horas ?? '-';
                const op2 = ops.find(o => o.slot === 2)?.tiempo_horas ?? '-';
                const op3 = ops.find(o => o.slot === 3)?.tiempo_horas ?? '-';

                const r1 = ops.find(o => o.slot === 1)?.rendimiento?.toFixed(3) ?? '-';
                const r2 = ops.find(o => o.slot === 2)?.rendimiento?.toFixed(3) ?? '-';
                const r3 = ops.find(o => o.slot === 3)?.rendimiento?.toFixed(3) ?? '-';

                return (
                  <tr key={r.id_registro} className="border-t">

                    {idx === 0 && (
                      <>
                        <td rowSpan={rowSpan} className="py-2 px-3 border text-center">
                          {d.nombre_elemento}
                        </td>

                        <td rowSpan={rowSpan} className={`py-2 px-3 border relative ${highlight("especificacion", d.campos_modificados)}`}>
                          <EspecificacionImagen
                            publicId={d.especificacion}
                            width={200}
                            height={200}
                            alt={`Detalle ${d.id_detalle}`}
                          />
                        </td>

                        <td rowSpan={rowSpan} className={`py-2 px-3 border ${highlight("posicion", d.campos_modificados)}`}>{d.posicion}</td>
                        <td rowSpan={rowSpan} className={`py-2 px-3 border ${highlight("tipo", d.campos_modificados)}`}>{d.tipo}</td>
                        <td rowSpan={rowSpan} className={`py-2 px-3 border ${highlight("medida_diametro", d.campos_modificados)}`}>{d.medida_diametro}</td>
                        <td rowSpan={rowSpan} className={`py-2 px-3 border ${highlight("longitud_corte", d.campos_modificados)}`}>{d.longitud_corte}</td>
                        <td rowSpan={rowSpan} className={`py-2 px-3 border bg-primary-light text-white font-semibold ${highlight("cantidad_total", d.campos_modificados)}`}>
                          {d.cantidad_total}
                        </td>
                      </>
                    )}

                    <td className="py-2 px-3 border">
                      {new Date(r.fecha).toLocaleDateString("es-ES")}
                    </td>

                    {mostrarNoCorresponde ? (
                      <td
                        className="py-2 px-3 border text-center italic text-gray-500"
                        colSpan={horasCols.length}
                      >
                        NO CORRESPONDE
                      </td>
                    ) : (
                      <>
                        <td className="py-2 px-3 border">{op1}</td>
                        <td className="py-2 px-3 border">{op2}</td>
                        {idTarea === 2 && (
                          <td className="py-2 px-3 border">{op3}</td>
                        )}
                      </>
                    )}

                    {mostrarNoCorresponde ? (
                      <td
                        className="py-2 px-3 border text-center italic text-gray-500"
                        colSpan={rendCols.length}
                      >
                        NO CORRESPONDE
                      </td>
                    ) : (
                      <>
                        <td className="py-2 px-3 border">{r1}</td>
                        <td className="py-2 px-3 border">{r2}</td>
                        {idTarea === 2 && (
                          <td className="py-2 px-3 border">{r3}</td>
                        )}
                      </>
                    )}
                  </tr>
                );
              });
            }

            // FILA VACÍA
            return (
              <tr key={`empty-${d.id_detalle}`} className="border-t">
                <td className="py-2 px-3 border text-center">{d.nombre_elemento}</td>
                <td className="py-2 px-3 border relative">
                  <EspecificacionImagen publicId={d.especificacion} width={200} height={200} alt="" />
                </td>
                <td className="py-2 px-3 border">{d.posicion}</td>
                <td className="py-2 px-3 border">{d.tipo}</td>
                <td className="py-2 px-3 border">{d.medida_diametro}</td>
                <td className="py-2 px-3 border">{d.longitud_corte}</td>
                <td className="py-2 px-3 border bg-primary-light text-white font-semibold">{d.cantidad_total}</td>
                <td className="py-2 px-3 border text-center italic text-gray-500">—</td>

                {noDoblado || noEmpaquetado ? (
                  <>
                    <td className="py-2 px-3 border text-center italic text-gray-500" colSpan={idTarea === 2 ? 3 : 2}>
                      NO CORRESPONDE
                    </td>
                    <td className="py-2 px-3 border text-center italic text-gray-500" colSpan={idTarea === 2 ? 3 : 2}>
                      NO CORRESPONDE
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-2 px-3 border text-center italic text-gray-500">-</td>
                    <td className="py-2 px-3 border text-center italic text-gray-500">-</td>
                    {idTarea === 2 && (
                      <td className="py-2 px-3 border text-center italic text-gray-500">-</td>
                    )}
                    <td className="py-2 px-3 border text-center italic text-gray-500">-</td>
                    <td className="py-2 px-3 border text-center italic text-gray-500">-</td>
                    {idTarea === 2 && (
                      <td className="py-2 px-3 border text-center italic text-gray-500">-</td>
                    )}
                  </>
                )}
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
