'use client';

import React, { useEffect, useRef, useState } from 'react';
import TimerButton from '@/components/TimerButton';
import { DetalleResponse, RegistroResponse } from '@/lib/planillas';
import RegistroModal from './RegistroModal';
import EspecificacionImagen from '@/components/EspecificacionImagen';
import { useTimers } from '@/hooks/useTimers';

function highlight(field: string, camposModificados?: string[]) {
  return camposModificados?.includes(field) ? 'border-2 border-red-500' : '';
}

interface Props {
  elementoNombre: string;
  detalles: DetalleResponse[];
  idTarea: number;
  onRegistroGuardado: () => void;
}

export default function PlanillaCardRegistro({
  elementoNombre,
  detalles,
  idTarea,
  onRegistroGuardado,
}: Props) {
  const [showModal, setShowModal] = useState<{
    idDetalle: number;
    idDetalleTarea: number;
    cantidadTotal: number;
  } | null>(null);

  const [showDetails, setShowDetails] = useState<number | null>(null);
  const { timers } = useTimers();

  // track previous running state to detect running -> stopped transitions
  const prevRunningRef = useRef<Record<number, boolean>>({});

  useEffect(() => {
    // build lookup of timers for faster access
    const lookup = timers || {};
    detalles.forEach((detalle) => {
      const tareaObj = detalle.detalle_tarea[0];
      if (!tareaObj) return;
      const key = tareaObj.id_detalle_tarea;
      const prevRunning = prevRunningRef.current[key];
      const timer = lookup[key];

      // if previously running and now stopped, open modal (only if not already open)
      if (prevRunning === true && timer && timer.running === false && timer.stoppedAt) {
        // avoid opening modal if one is already open for same detalle
        if (!showModal || showModal.idDetalleTarea !== key) {
          setShowModal({
            idDetalle: detalle.id_detalle,
            idDetalleTarea: key,
            cantidadTotal: detalle.cantidad_total,
          });
        }
      }

      // update prevRunningRef
      prevRunningRef.current[key] = !!(timer && timer.running);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timers, detalles]);

  const horasSub: string[] =
    idTarea === 1
      ? ['Cort.1', 'Cort.2']
      : idTarea === 2
      ? ['Dob.', 'Ayu.']
      : ['Emp.1', 'Emp.2'];

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
                <th rowSpan={2} className="py-2 px-3 border">Detalle</th>
                <th rowSpan={2} className="py-2 px-3 border bg-primary-light text-white">Cant. Total</th>

                <th rowSpan={2} className="py-2 px-3 border hidden md:table-cell">Tipo</th>
                <th rowSpan={2} className="py-2 px-3 border hidden md:table-cell">Posición</th>
                <th rowSpan={2} className="py-2 px-3 border hidden md:table-cell">Ø (mm)</th>
                <th rowSpan={2} className="py-2 px-3 border hidden md:table-cell">Long. Corte (m)</th>

                <th rowSpan={2} className="py-2 px-3 border">Fecha</th>
                <th rowSpan={2} className="py-2 px-3 border">Cantidad</th>
                <th colSpan={2} className="py-2 px-3 border">Horas</th>
                <th rowSpan={2} className="py-2 px-3 border">Temporizador</th>
              </tr>
              <tr className="bg-primary-mid text-white">
                {horasSub.map((h) => (
                  <th key={h} className="py-1 px-3 border text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {detalles.map((detalle) => {
                const tareaObj = detalle.detalle_tarea[0];
                const registros: RegistroResponse[] = tareaObj?.registro ?? [];
                const acumulado = registros.reduce((sum, r) => sum + r.cantidad, 0);
                const puedeAgregar = acumulado < detalle.cantidad_total;

                const renderEspecificacion = () =>
                  detalle.especificacion
                    ? <EspecificacionImagen publicId={detalle.especificacion} width={150} height={150} />
                    : <span className="text-gray-500 italic">Sin especificación</span>;

                if (registros.length > 0) {
                  return registros.map((reg, idx) => (
                    <tr key={`${detalle.id_detalle}-${reg.id_registro}`} className="border-t">
                      {idx === 0 && (
                        <>
                          <td rowSpan={registros.length} className={`py-2 px-3 border align-top ${highlight('especificacion', detalle.campos_modificados)}`}>
                            <div className="flex flex-col items-center">
                              {renderEspecificacion()}

                              <button
                                onClick={() =>
                                  setShowDetails(showDetails === detalle.id_detalle ? null : detalle.id_detalle)
                                }
                                className="mt-2 text-xs text-blue-600 underline md:hidden"
                              >
                                {showDetails === detalle.id_detalle ? 'Ocultar detalles' : 'Ver detalles'}
                              </button>

                              {showDetails === detalle.id_detalle && (
                                <div className="mt-2 text-xs text-left space-y-1 w-full md:hidden">
                                  <p><strong>Tipo:</strong> {detalle.tipo}</p>
                                  <p><strong>Posición:</strong> {detalle.posicion}</p>
                                  <p><strong>Ø:</strong> {detalle.medida_diametro}</p>
                                  <p><strong>Long. corte:</strong> {detalle.longitud_corte}</p>
                                </div>
                              )}
                            </div>
                          </td>

                          <td rowSpan={registros.length} className={`py-2 px-3 border bg-primary-light text-white font-semibold ${highlight('cantidad_total', detalle.campos_modificados)}`}>
                            {detalle.cantidad_total}
                          </td>

                          <td rowSpan={registros.length} className="py-2 px-3 border hidden md:table-cell">{detalle.tipo}</td>
                          <td rowSpan={registros.length} className="py-2 px-3 border hidden md:table-cell">{detalle.posicion}</td>
                          <td rowSpan={registros.length} className="py-2 px-3 border hidden md:table-cell">{detalle.medida_diametro}</td>
                          <td rowSpan={registros.length} className="py-2 px-3 border hidden md:table-cell">{detalle.longitud_corte}</td>
                        </>
                      )}

                      <td className="py-2 px-3 border">{new Date(reg.fecha).toLocaleDateString('es-ES')}</td>
                      <td className="py-2 px-3 border">{reg.cantidad}</td>
                      <td className="py-2 px-3 border">{reg.horas_trabajador}</td>
                      <td className="py-2 px-3 border">{reg.horas_ayudante}</td>

                      {idx === 0 && (
                        <td rowSpan={registros.length} className="py-2 px-3 border text-center">
                          {tareaObj && (
                            <TimerButton
                              idDetalle={detalle.id_detalle}
                              idDetalleTarea={tareaObj.id_detalle_tarea}
                              idTarea={idTarea}
                              className={puedeAgregar ? undefined : 'opacity-50 pointer-events-none'}
                            />
                          )}
                        </td>
                      )}
                    </tr>
                  ));
                }

                // Caso sin registros
                return (
                  <tr key={`vacio-${detalle.id_detalle}`} className="border-t">
                    <td className={`py-2 px-3 border align-top ${highlight('especificacion', detalle.campos_modificados)}`}>
                      <div className="flex flex-col items-center">
                        {renderEspecificacion()}
                        <button
                          onClick={() =>
                            setShowDetails(showDetails === detalle.id_detalle ? null : detalle.id_detalle)
                          }
                          className="mt-2 text-xs text-blue-600 underline md:hidden"
                        >
                          {showDetails === detalle.id_detalle ? 'Ocultar detalles' : 'Ver detalles'}
                        </button>
                        {showDetails === detalle.id_detalle && (
                          <div className="mt-2 text-xs text-left space-y-1 w-full md:hidden">
                            <p><strong>Tipo:</strong> {detalle.tipo}</p>
                            <p><strong>Posición:</strong> {detalle.posicion}</p>
                            <p><strong>Ø:</strong> {detalle.medida_diametro}</p>
                            <p><strong>Long. corte:</strong> {detalle.longitud_corte}</p>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className={`py-2 px-3 border bg-primary-light text-white font-semibold ${highlight('cantidad_total', detalle.campos_modificados)}`}>
                      {detalle.cantidad_total}
                    </td>

                    <td className="py-2 px-3 border hidden md:table-cell">{detalle.tipo}</td>
                    <td className="py-2 px-3 border hidden md:table-cell">{detalle.posicion}</td>
                    <td className="py-2 px-3 border hidden md:table-cell">{detalle.medida_diametro}</td>
                    <td className="py-2 px-3 border hidden md:table-cell">{detalle.longitud_corte}</td>

                    <td className="py-2 px-3 border">—</td>
                    <td className="py-2 px-3 border">—</td>
                    <td className="py-2 px-3 border">—</td>
                    <td className="py-2 px-3 border">—</td>

                    <td className="py-2 px-3 border text-center">
                      {tareaObj && (
                        <TimerButton
                          idDetalle={detalle.id_detalle}
                          idDetalleTarea={tareaObj.id_detalle_tarea}
                          idTarea={idTarea}
                          className={detalle.cantidad_total > 0 ? undefined : 'opacity-50 pointer-events-none'}
                        />
                      )}
                    </td>
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
