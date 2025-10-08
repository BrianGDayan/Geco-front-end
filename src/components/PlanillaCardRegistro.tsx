'use client';

import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import TimerButton from '@/components/TimerButton';
import { DetalleResponse, RegistroResponse } from '@/lib/planillas';
import RegistroModal from './RegistroModal';
import EspecificacionImagen from '@/components/EspecificacionImagen';

function highlight(field: string, camposModificados?: string[]) {
  return camposModificados?.includes(field)
    ? 'border-2 border-red-500'
    : '';
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

                {/* Columnas visibles solo en escritorio */}
                <th rowSpan={2} className="py-2 px-3 border hidden md:table-cell">Tipo</th>
                <th rowSpan={2} className="py-2 px-3 border hidden md:table-cell">Posición</th>
                <th rowSpan={2} className="py-2 px-3 border hidden md:table-cell">Ø (mm)</th>
                <th rowSpan={2} className="py-2 px-3 border hidden md:table-cell">Long. Corte (m)</th>

                <th rowSpan={2} className="py-2 px-3 border">Fecha</th>
                <th rowSpan={2} className="py-2 px-3 border">Cantidad</th>
                <th colSpan={2} className="py-2 px-3 border">Horas</th>
                <th rowSpan={2} className="py-2 px-3 border">Agregar registro</th>
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

                              {/* Toggle solo en móvil */}
                              <button
                                onClick={() =>
                                  setShowDetails(showDetails === detalle.id_detalle ? null : detalle.id_detalle)
                                }
                                className="mt-2 text-xs text-blue-600 underline md:hidden"
                              >
                                {showDetails === detalle.id_detalle ? 'Ocultar detalles' : 'Ver detalles'}
                              </button>

                              {/* Bloque ocultable en móvil */}
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

                          {/* Columnas escritorio */}
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
                          <button
                            onClick={() =>
                              setShowModal({
                                idDetalle: detalle.id_detalle,
                                idDetalleTarea: tareaObj.id_detalle_tarea,
                                cantidadTotal: detalle.cantidad_total,
                              })
                            }
                            disabled={!puedeAgregar}
                            className={`inline-flex items-center justify-center w-12 h-12 rounded-full transition ${
                              puedeAgregar
                                ? 'bg-[#1E7F66] text-white hover:bg-[#279974]'
                                : 'bg-gray-300 text-white cursor-not-allowed'
                            }`}
                          >
                            <PlusCircle size={20} />
                          </button>
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

                    {/* Columnas escritorio */}
                    <td className="py-2 px-3 border hidden md:table-cell">{detalle.tipo}</td>
                    <td className="py-2 px-3 border hidden md:table-cell">{detalle.posicion}</td>
                    <td className="py-2 px-3 border hidden md:table-cell">{detalle.medida_diametro}</td>
                    <td className="py-2 px-3 border hidden md:table-cell">{detalle.longitud_corte}</td>

                    <td className="py-2 px-3 border">—</td>
                    <td className="py-2 px-3 border">—</td>
                    <td className="py-2 px-3 border">—</td>
                    <td className="py-2 px-3 border">—</td>
                    <td className="py-2 px-3 border text-center">
                      <button
                        onClick={() =>
                          setShowModal({
                            idDetalle: detalle.id_detalle,
                            idDetalleTarea: tareaObj.id_detalle_tarea,
                            cantidadTotal: detalle.cantidad_total,
                          })
                        }
                        disabled={detalle.cantidad_total <= 0}
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-full transition ${
                          detalle.cantidad_total > 0
                            ? 'bg-[#1E7F66] text-white hover:bg-[#279974]'
                            : 'bg-gray-300 text-white cursor-not-allowed'
                        }`}
                      >
                        <PlusCircle size={20} />
                      </button>
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
          onSaved={onRegistroGuardado}
        />
      )}
    </>
  );
}
