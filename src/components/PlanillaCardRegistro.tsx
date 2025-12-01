'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle } from 'lucide-react';
import TimerButton from '../components/TimerButton';
import { DetalleResponse, RegistroResponse } from '../lib/planillas';
import RegistroModal from './RegistroModal';
import EspecificacionImagen from '../components/EspecificacionImagen';
import { useTimers } from '../hooks/useTimers';

function highlight(field: string, camposModificados?: string[]) {
  return camposModificados?.includes(field) ? 'border-2 border-red-500' : '';
}

interface Props {
  elementoNombre: string;
  detalles: DetalleResponse[];
  idTarea: number;
  onRegistroGuardado: () => void;
}

type ModalState = {
  idDetalle: number;
  idDetalleTarea: number;
  cantidadTotal: number;
  slot: number;
} | null;

export default function PlanillaCardRegistro({
  elementoNombre,
  detalles,
  idTarea,
  onRegistroGuardado,
}: Props) {
  const [showModal, setShowModal] = useState<ModalState>(null);

  // slots extra activos por detalle (slot 1 siempre se considera activo)
  const [activeSlotsByDetalle, setActiveSlotsByDetalle] = useState<
    Record<number, number[]>
  >({});

  const { timers } = useTimers();
  const prevRunningRef = useRef<Record<string, boolean>>({});

  const getHeadersCount = () => {
    if (idTarea === 1) return 2; // Corte: Cort.1, Cort.2
    if (idTarea === 2) return 3; // Doblado: Dobl, Ayud.1, Ayud.2
    if (idTarea === 3) return 2; // Empaque: Emp.1, Emp.2
    return 1;
  };

  // 1) Hidratar slots activos a partir de timers existentes
  useEffect(() => {
    const headersCount = getHeadersCount();

    setActiveSlotsByDetalle((prev) => {
      const next: Record<number, number[]> = { ...prev };

      detalles.forEach((detalle) => {
        const tareaObj = detalle.detalle_tarea[0];
        if (!tareaObj) return;

        const idDT = tareaObj.id_detalle_tarea;

        for (let slot = 2; slot <= headersCount; slot++) {
          const key = `${idDT}-${slot}`;
          const t = timers[key];
          if (t) {
            const current = next[detalle.id_detalle] ?? [];
            if (!current.includes(slot)) {
              next[detalle.id_detalle] = [...current, slot];
            }
          }
        }
      });

      return next;
    });
  }, [timers, detalles, idTarea]);

  // 2) Detectar cuando cualquier timer (por slot) pasa de running=true a false con stoppedAt
  useEffect(() => {
    const headersCount = getHeadersCount();

    detalles.forEach((detalle) => {
      const tareaObj = detalle.detalle_tarea[0];
      if (!tareaObj) return;

      const idDT = tareaObj.id_detalle_tarea;

      for (let slot = 1; slot <= headersCount; slot++) {
        const key = `${idDT}-${slot}`;
        const timer = timers[key];
        const prev = prevRunningRef.current[key];

        if (prev && timer && !timer.running && timer.stoppedAt) {
          setShowModal({
            idDetalle: detalle.id_detalle,
            idDetalleTarea: idDT,
            cantidadTotal: detalle.cantidad_total,
            slot,
          });
        }

        prevRunningRef.current[key] = timer?.running ?? false;
      }
    });
  }, [timers, detalles, idTarea]);

  const getColorClase = () => {
    if (idTarea === 1) return 'bg-primary text-white';
    if (idTarea === 2) return 'bg-[#1E7F66] text-white';
    return 'bg-[#6A1B4D] text-white';
  };

  const timerHeaders: Record<number, string[]> = {
    1: ['Cort. 1', 'Cort. 2'],
    2: ['Dobl.', 'Ayud. 1', 'Ayud. 2'],
    3: ['Emp. 1', 'Emp. 2'],
  };

  const headers = timerHeaders[idTarea] ?? ['Op. 1'];
  const timerColSpan = headers.length;

  const isTaskApplicable = (detalle: DetalleResponse) => {
    const tipo = Number(detalle.tipo);
    if (idTarea === 2 && tipo === 1) return false; // doblado no aplica a tipo 1
    if (idTarea === 3 && tipo === 4) return false; // empaque no aplica a tipo 4
    return true;
  };

  const isSlotActive = (idDetalle: number, slot: number) => {
    if (slot === 1) return true; // primer operador siempre visible
    const list = activeSlotsByDetalle[idDetalle] ?? [];
    return list.includes(slot);
  };

  const activateSlot = (idDetalle: number, slot: number) => {
    setActiveSlotsByDetalle((prev) => {
      const list = prev[idDetalle] ?? [];
      if (list.includes(slot)) return prev;
      return { ...prev, [idDetalle]: [...list, slot] };
    });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow mb-8 border">
        <div className="px-4 py-2 bg-primary-mid text-white font-semibold">
          {elementoNombre}
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full table-auto text-sm border-collapse">
            <thead>
              <tr className="bg-primary-dark text-white">
                <th className="py-2 px-3 border">Detalle</th>
                <th className="py-2 px-3 border">Cant. Total</th>
                <th className="py-2 px-3 border">Cantidad</th>
                <th className="py-2 px-3 border" colSpan={timerColSpan}>
                  Temporizadores
                </th>
              </tr>

              <tr className="bg-primary-mid text-white">
                <th className="py-1 px-3 border"></th>
                <th className="py-1 px-3 border"></th>
                <th className="py-1 px-3 border"></th>
                {headers.map((h) => (
                  <th key={h} className="py-1 px-3 border text-xs">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {detalles.map((detalle) => {
                const tareaObj = detalle.detalle_tarea[0];
                const registros: RegistroResponse[] = tareaObj?.registro ?? [];

                const acumulado = registros.reduce(
                  (sum, r) => sum + r.cantidad,
                  0,
                );
                const puedeAgregar = acumulado < detalle.cantidad_total;

                const rowSpan = Math.max(registros.length, 1);
                const aplica = isTaskApplicable(detalle);

                const renderEspecificacion = () =>
                  detalle.especificacion ? (
                    <EspecificacionImagen
                      publicId={detalle.especificacion}
                      width={260}
                      height={260}
                    />
                  ) : (
                    <span className="text-gray-500 italic">
                      Sin especificación
                    </span>
                  );

                const renderTimerCells = () => {
                  if (!aplica)
                    return headers.map((_, i) => (
                      <td
                        key={`nc-${i}`}
                        rowSpan={rowSpan}
                        className="py-2 px-3 border text-center text-xs text-gray-500"
                      >
                        No corresponde
                      </td>
                    ));

                  if (!puedeAgregar)
                    return headers.map((_, i) => (
                      <td
                        key={`full-${i}`}
                        rowSpan={rowSpan}
                        className="py-2 px-3 border text-center"
                      >
                        <CheckCircle className="w-6 h-6 text-green-600 mx-auto" />
                      </td>
                    ));

                  return headers.map((_, idx) => {
                    const slot = idx + 1;
                    const active = isSlotActive(detalle.id_detalle, slot);

                    if (!active) {
                      return (
                        <td
                          key={`add-${slot}`}
                          rowSpan={rowSpan}
                          className="py-2 px-3 border text-center"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              activateSlot(detalle.id_detalle, slot)
                            }
                            className="px-2 py-1 rounded bg-gray-200 text-xs hover:bg-gray-300"
                          >
                            Agregar operador
                          </button>
                        </td>
                      );
                    }

                    return (
                      <td
                        key={`timer-${slot}`}
                        rowSpan={rowSpan}
                        className="py-2 px-3 border text-center"
                      >
                        {tareaObj ? (
                          <TimerButton
                            idDetalle={detalle.id_detalle}
                            idDetalleTarea={tareaObj.id_detalle_tarea}
                            idTarea={idTarea}
                            slot={slot}
                          />
                        ) : (
                          <span className="text-xs text-gray-500">—</span>
                        )}
                      </td>
                    );
                  });
                };

                if (registros.length > 0) {
                  return registros.map((reg, idx) => (
                    <tr
                      key={`${detalle.id_detalle}-${reg.id_registro}`}
                      className="border-t"
                    >
                      {idx === 0 && (
                        <>
                          <td
                            rowSpan={rowSpan}
                            className={`py-2 px-3 border align-top ${highlight(
                              'especificacion',
                              detalle.campos_modificados,
                            )}`}
                          >
                            {renderEspecificacion()}
                          </td>

                          <td
                            rowSpan={rowSpan}
                            className={`py-2 px-3 border font-semibold ${getColorClase()} ${highlight(
                              'cantidad_total',
                              detalle.campos_modificados,
                            )}`}
                          >
                            {detalle.cantidad_total}
                          </td>
                        </>
                      )}

                      <td className="py-2 px-3 border">{reg.cantidad}</td>

                      {idx === 0 && renderTimerCells()}
                    </tr>
                  ));
                }

                return (
                  <tr key={`empty-${detalle.id_detalle}`} className="border-t">
                    <td
                      className={`py-2 px-3 border align-top ${highlight(
                        'especificacion',
                        detalle.campos_modificados,
                      )}`}
                    >
                      {renderEspecificacion()}
                    </td>

                    <td
                      className={`py-2 px-3 border font-semibold ${getColorClase()} ${highlight(
                        'cantidad_total',
                        detalle.campos_modificados,
                      )}`}
                    >
                      {detalle.cantidad_total}
                    </td>

                    <td className="py-2 px-3 border">—</td>

                    {renderTimerCells()}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <RegistroModal
          idDetalle={showModal.idDetalle}
          idDetalleTarea={showModal.idDetalleTarea}
          cantidadTotal={showModal.cantidadTotal}
          idTarea={idTarea}
          slot={showModal.slot}
          onClose={() => setShowModal(null)}
          onSaved={() => {
            setShowModal(null);
            onRegistroGuardado();
          }}
        />
      )}
    </>
  );
}
