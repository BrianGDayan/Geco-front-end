'use client';

import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import TimerButton from '../components/TimerButton';
import { DetalleResponse, RegistroResponse } from '../lib/planillas';
import RegistroModal from './RegistroModal';
import EspecificacionImagen from '../components/EspecificacionImagen';

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

  // NUEVO: slots activados por detalle (solo cuando el usuario agrega un operador extra)
  const [activeSlotsByDetalle, setActiveSlotsByDetalle] = useState<
    Record<number, number[]>
  >({});

  // Encabezados EXACTOS según tarea (mantiene estética original)
  const timerHeaders: Record<number, string[]> = {
    1: ['Cort. 1', 'Cort. 2'],
    2: ['Dobl.', 'Ayud. 1', 'Ayud. 2'],
    3: ['Emp. 1', 'Emp. 2'],
  };

  const headers = timerHeaders[idTarea] ?? ['Operador'];
  const colSpanTimers = headers.length;

  const getColorClase = () => {
    if (idTarea === 1) return 'bg-primary text-white';
    if (idTarea === 2) return 'bg-[#1E7F66] text-white';
    return 'bg-[#6A1B4D] text-white';
  };

  // Regla de "NO CORRESPONDE"
  const isTaskApplicable = (detalle: DetalleResponse) => {
    const tipo = Number(detalle.tipo);
    if (idTarea === 2 && tipo === 1) return false;
    if (idTarea === 3 && tipo === 4) return false;
    return true;
  };

  // Slot principal siempre activo, los demás requieren activación
  const isSlotActive = (idDetalle: number, slot: number) => {
    if (slot === 1) return true;
    const arr = activeSlotsByDetalle[idDetalle] ?? [];
    return arr.includes(slot);
  };

  const activateSlot = (idDetalle: number, slot: number) => {
    setActiveSlotsByDetalle(prev => {
      const curr = prev[idDetalle] ?? [];
      if (curr.includes(slot)) return prev;
      return { ...prev, [idDetalle]: [...curr, slot] };
    });
  };

  // Aumentar tamaño de la imagen — mejora visual sin romper estilo
  const renderImage = (publicId?: string) =>
    publicId ? (
      <EspecificacionImagen
        publicId={publicId}
        width={260}
        height={260}
      />
    ) : (
      <span className="text-gray-500 italic">Sin especificación</span>
    );

  return (
    <>
      <div className="bg-white rounded-lg shadow mb-8 border">
        <div className="px-4 py-2 bg-primary-mid text-white font-semibold">
          {elementoNombre}
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full table-auto text-sm border-collapse">

            {/* ENCABEZADO */}
            <thead>
              <tr className="bg-primary-dark text-white">
                <th className="py-2 px-3 border">Detalle</th>
                <th className="py-2 px-3 border">Cant. Total</th>
                <th className="py-2 px-3 border">Cantidad</th>
                <th className="py-2 px-3 border" colSpan={colSpanTimers}>
                  Temporizadores
                </th>
              </tr>
              <tr className="bg-primary-mid text-white">
                {headers.map(h => (
                  <th key={h} className="py-1 px-3 border text-xs">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {detalles.map(detalle => {
                const tareaObj = detalle.detalle_tarea[0];
                const registros: RegistroResponse[] = tareaObj?.registro ?? [];
                const acumulado = registros.reduce((s, r) => s + r.cantidad, 0);
                const puedeAgregar = acumulado < detalle.cantidad_total;
                const aplica = isTaskApplicable(detalle);
                const rowSpan = Math.max(registros.length, 1);

                // Genera celdas de temporizador / "No corresponde" / "Agregar operador"
                const renderTimers = () => {
                  if (!aplica) {
                    return headers.map((_, i) => (
                      <td
                        key={`nc-${detalle.id_detalle}-${i}`}
                        rowSpan={rowSpan}
                        className="py-2 px-3 border text-center text-xs text-gray-500"
                      >
                        No corresponde
                      </td>
                    ));
                  }

                  if (!puedeAgregar) {
                    return headers.map((_, i) => (
                      <td
                        key={`ok-${detalle.id_detalle}-${i}`}
                        rowSpan={rowSpan}
                        className="py-2 px-3 border text-center"
                      >
                        <CheckCircle className="w-6 h-6 text-green-600 mx-auto" />
                      </td>
                    ));
                  }

                  return headers.map((_, index) => {
                    const slot = index + 1;
                    const active = isSlotActive(detalle.id_detalle, slot);

                    if (!active) {
                      return (
                        <td
                          key={`add-${detalle.id_detalle}-${slot}`}
                          rowSpan={rowSpan}
                          className="py-2 px-3 border text-center"
                        >
                          <button
                            type="button"
                            onClick={() => activateSlot(detalle.id_detalle, slot)}
                            className="px-2 py-1 rounded bg-gray-200 text-xs hover:bg-gray-300"
                          >
                            Agregar operador
                          </button>
                        </td>
                      );
                    }

                    return (
                      <td
                        key={`t-${detalle.id_detalle}-${slot}`}
                        rowSpan={rowSpan}
                        className="py-2 px-3 border text-center"
                      >
                        <TimerButton
                          idDetalle={detalle.id_detalle}
                          idDetalleTarea={tareaObj.id_detalle_tarea}
                          idTarea={idTarea}
                          slot={slot}
                          onStopped={() =>
                            setShowModal({
                              idDetalle: detalle.id_detalle,
                              idDetalleTarea: tareaObj.id_detalle_tarea,
                              cantidadTotal: detalle.cantidad_total,
                              slot,
                            })
                          }
                        />
                      </td>
                    );
                  });
                };

                // Con registros
                if (registros.length > 0) {
                  return registros.map((reg, idx) => (
                    <tr key={`${detalle.id_detalle}-${reg.id_registro}`} className="border-t">

                      {idx === 0 && (
                        <>
                          <td
                            rowSpan={rowSpan}
                            className={`py-2 px-3 border align-top ${highlight(
                              'especificacion',
                              detalle.campos_modificados,
                            )}`}
                          >
                            {renderImage(detalle.especificacion)}
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

                      {idx === 0 && renderTimers()}
                    </tr>
                  ));
                }

                // Sin registros
                return (
                  <tr key={`vacio-${detalle.id_detalle}`} className="border-t">
                    <td
                      className={`py-2 px-3 border align-top ${highlight(
                        'especificacion',
                        detalle.campos_modificados,
                      )}`}
                    >
                      {renderImage(detalle.especificacion)}
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

                    {renderTimers()}
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
