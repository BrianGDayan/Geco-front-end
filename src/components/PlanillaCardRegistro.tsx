'use client';

import React, { useEffect, useRef, useState } from 'react';
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

  const { timers } = useTimers();
  const prevRunningRef = useRef<Record<number, boolean>>({});

  useEffect(() => {
    const lookup = timers || {};
    detalles.forEach(detalle => {
      const tareaObj = detalle.detalle_tarea[0];
      if (!tareaObj) return;

      const key = tareaObj.id_detalle_tarea;
      const prevRunning = prevRunningRef.current[key];
      const timer = lookup[key];

      if (prevRunning === true && timer && !timer.running && timer.stoppedAt) {
        setShowModal({
          idDetalle: detalle.id_detalle,
          idDetalleTarea: key,
          cantidadTotal: detalle.cantidad_total,
        });
      }

      prevRunningRef.current[key] = !!(timer && timer.running);
    });
  }, [timers, detalles]);

  const getColorClase = () => {
    if (idTarea === 1) return 'bg-primary text-white';
    if (idTarea === 2) return 'bg-[#1E7F66] text-white';
    return 'bg-[#6A1B4D] text-white';
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
                <th className="py-2 px-3 border">Temporizador</th>
              </tr>
            </thead>

            <tbody>
              {detalles.map(detalle => {
                const tareaObj = detalle.detalle_tarea[0];
                const registros: RegistroResponse[] = tareaObj?.registro ?? [];

                const acumulado = registros.reduce((sum, r) => sum + r.cantidad, 0);
                const puedeAgregar = acumulado < detalle.cantidad_total;

                const renderEspecificacion = () =>
                  detalle.especificacion ? (
                    <EspecificacionImagen
                      publicId={detalle.especificacion}
                      width={150}
                      height={150}
                    />
                  ) : (
                    <span className="text-gray-500 italic">Sin especificación</span>
                  );

                if (registros.length > 0) {
                  return registros.map((reg, idx) => (
                    <tr key={`${detalle.id_detalle}-${reg.id_registro}`} className="border-t">
                      {idx === 0 && (
                        <>
                          <td
                            rowSpan={registros.length}
                            className={`py-2 px-3 border align-top ${highlight(
                              'especificacion',
                              detalle.campos_modificados
                            )}`}
                          >
                            {renderEspecificacion()}
                          </td>

                          <td
                            rowSpan={registros.length}
                            className={`py-2 px-3 border font-semibold ${getColorClase()} ${highlight(
                              'cantidad_total',
                              detalle.campos_modificados
                            )}`}
                          >
                            {detalle.cantidad_total}
                          </td>
                        </>
                      )}

                      <td className="py-2 px-3 border">{reg.cantidad}</td>

                      {idx === 0 && (
                        <td rowSpan={registros.length} className="py-2 px-3 border text-center">
                          {!puedeAgregar ? (
                            <CheckCircle className="w-6 h-6 text-green-600 mx-auto" />
                          ) : tareaObj ? (
                            <TimerButton
                              idDetalle={detalle.id_detalle}
                              idDetalleTarea={tareaObj.id_detalle_tarea}
                              idTarea={idTarea}
                            />
                          ) : (
                            <span>—</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ));
                }

                return (
                  <tr key={`vacio-${detalle.id_detalle}`} className="border-t">
                    <td
                      className={`py-2 px-3 border align-top ${highlight(
                        'especificacion',
                        detalle.campos_modificados
                      )}`}
                    >
                      {renderEspecificacion()}
                    </td>

                    <td
                      className={`py-2 px-3 border font-semibold ${getColorClase()} ${highlight(
                        'cantidad_total',
                        detalle.campos_modificados
                      )}`}
                    >
                      {detalle.cantidad_total}
                    </td>

                    <td className="py-2 px-3 border">—</td>

                    <td className="py-2 px-3 border text-center">
                      {tareaObj && (
                        <TimerButton
                          idDetalle={detalle.id_detalle}
                          idDetalleTarea={tareaObj.id_detalle_tarea}
                          idTarea={idTarea}
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

