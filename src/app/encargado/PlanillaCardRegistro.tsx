// components/PlanillaCardRegistro.tsx
'use client';

import React, { useState } from 'react';
import { DetalleResponse, RegistroResponse } from '@/lib/planillas';
import { PlusCircle } from 'lucide-react';
import RegistroModal from '../../components/RegistroModal';

interface Props {
  elementoNombre: string;
  detalle: DetalleResponse;
}

export default function PlanillaCardRegistro({ elementoNombre, detalle }: Props) {
  const [showModal, setShowModal] = useState(false);
  const tareaObj = detalle.detalle_tarea[0];
  const registros = tareaObj.registro || [];

  return (
    <>
      <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
        <div className="px-4 py-2 bg-primary-dark">
          <h3 className="font-medium text-white">{elementoNombre}</h3>
        </div>
        <div className="p-4">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-primary-mid text-white">
                <th className="py-2 px-3 border border-primary-dark">Detalle</th>
                <th className="py-2 px-3 border border-primary-dark">Cantidad Total</th>
                <th className="py-2 px-3 border border-primary-dark">Tipo (mm)</th>
                <th className="py-2 px-3 border border-primary-dark">Ø (mm)</th>
                <th className="py-2 px-3 border border-primary-dark">Long. Corte (m)</th>
                <th className="py-2 px-3 border border-primary-dark">Fecha</th>
                <th className="py-2 px-3 border border-primary-dark">Cantidad</th>
                <th className="py-2 px-3 border border-primary-dark">Horas Trab/Pay</th>
                <th className="py-2 px-3 border border-primary-dark">Acción</th>
              </tr>
            </thead>
            <tbody>
              {registros.length > 0 ? (
                registros.map((reg: RegistroResponse, idx: number) => (
                  <tr key={reg.id_registro} className="border-t border-gray-border">
                    {idx === 0 && (
                      <>
                        <td rowSpan={registros.length} className="py-2 px-3 border border-gray-border">
                          {detalle.posicion}
                        </td>
                        <td rowSpan={registros.length} className="py-2 px-3 border border-gray-border">
                          {detalle.cantidad_total}
                        </td>
                        <td rowSpan={registros.length} className="py-2 px-3 border border-gray-border">
                          {detalle.tipo}
                        </td>
                        <td rowSpan={registros.length} className="py-2 px-3 border border-gray-border">
                          {detalle.medida_diametro}
                        </td>
                        <td rowSpan={registros.length} className="py-2 px-3 border border-gray-border">
                          {detalle.longitud_corte}
                        </td>
                      </>
                    )}
                    <td className="py-2 px-3 border border-gray-border">
                      {new Date(reg.fecha).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-3 border border-gray-border">{reg.cantidad}</td>
                    <td className="py-2 px-3 border border-gray-border">
                      {reg.horas_trabajador} / {reg.horas_ayudante}
                    </td>
                    {idx === 0 ? (
                      <td rowSpan={registros.length} className="py-2 px-3 border border-gray-border text-center">
                        <button onClick={() => setShowModal(true)} className="text-primary hover:text-primary-dark">
                          <PlusCircle size={24} />
                        </button>
                      </td>
                    ) : null}
                  </tr>
                ))
              ) : (
                <tr className="border-t border-gray-border">
                  <td className="py-2 px-3 border border-gray-border">{detalle.posicion}</td>
                  <td className="py-2 px-3 border border-gray-border">{detalle.cantidad_total}</td>
                  <td className="py-2 px-3 border border-gray-border">{detalle.tipo}</td>
                  <td className="py-2 px-3 border border-gray-border">{detalle.medida_diametro}</td>
                  <td className="py-2 px-3 border border-gray-border">{detalle.longitud_corte}</td>
                  <td className="py-2 px-3 border border-gray-border">—</td>
                  <td className="py-2 px-3 border border-gray-border">—</td>
                  <td className="py-2 px-3 border border-gray-border">— / —</td>
                  <td className="py-2 px-3 border border-gray-border text-center">
                    <button onClick={() => setShowModal(true)} className="text-primary hover:text-primary-dark">
                      <PlusCircle size={24} />
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <RegistroModal idDetalleTarea={tareaObj.id_detalle_tarea} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
