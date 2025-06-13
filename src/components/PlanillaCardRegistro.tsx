// components/PlanillaCardRegistro.tsx
'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { DetalleResponse, RegistroResponse } from '@/lib/planillas';
import RegistroModal from './RegistroModal';

interface Props {
  elementoNombre: string;
  detalle: DetalleResponse;
  idTarea: number;
}

export default function PlanillaCardRegistro({
  elementoNombre,
  detalle,
  idTarea,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const tareaObj = detalle.detalle_tarea[0];
  const registros: RegistroResponse[] = tareaObj?.registro ?? [];

  const horasSub = idTarea === 2
    ? ['Dob.', 'Ayu.']
    : idTarea === 1
      ? ['Cort.1', 'Cort.2']
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
                <th rowSpan={2} className="py-2 px-3 border bg-primary-light text-white">
                  Cantidad Total
                </th>
                <th rowSpan={2} className="py-2 px-3 border">Tipo</th>
                <th rowSpan={2} className="py-2 px-3 border">Ø (mm)</th>
                <th rowSpan={2} className="py-2 px-3 border">Long. Corte (m)</th>
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
              {registros.length > 0 ? (
                registros.map((reg, idx) => (
                  <tr key={reg.id_registro} className="border-t">
                    {idx === 0 && (
                      <>
                        <td rowSpan={registros.length} className="py-2 px-3 border">
                          {detalle.especificacion}
                        </td>
                        <td rowSpan={registros.length} className="py-2 px-3 border bg-primary-light text-white font-semibold">
                          {detalle.cantidad_total}
                        </td>
                        <td rowSpan={registros.length} className="py-2 px-3 border">
                          {detalle.tipo}
                        </td>
                        <td rowSpan={registros.length} className="py-2 px-3 border">
                          {detalle.medida_diametro}
                        </td>
                        <td rowSpan={registros.length} className="py-2 px-3 border">
                          {detalle.longitud_corte}
                        </td>
                      </>
                    )}
                    <td className="py-2 px-3 border">
                      {new Date(reg.fecha).toLocaleDateString('es-ES')}
                    </td>
                    <td className="py-2 px-3 border">{reg.cantidad}</td>
                    <td className="py-2 px-3 border">{reg.horas_trabajador}</td>
                    <td className="py-2 px-3 border">{reg.horas_ayudante}</td>
                    {idx === 0 && (
                      <td rowSpan={registros.length} className="py-2 px-3 border text-center">
   <button
  onClick={() => setShowModal(true)}
  className="relative w-12 h-12 bg-accent text-white rounded-full hover:bg-accent-light transition p-0"
>
  <PlusCircle
    size={20}
    className="absolute inset-0 m-auto"
  />
</button>


                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr className="border-t">
                  <td className="py-2 px-3 border">{detalle.especificacion}</td>
                  <td className="py-2 px-3 border bg-primary-light text-white font-semibold">
                    {detalle.cantidad_total}
                  </td>
                  <td className="py-2 px-3 border">{detalle.tipo}</td>
                  <td className="py-2 px-3 border">{detalle.medida_diametro}</td>
                  <td className="py-2 px-3 border">{detalle.longitud_corte}</td>

                  {/* Cuatro celdas separadas para fecha, cantidad y dos horas */}
                  <td className="py-2 px-3 border">—</td>
                  <td className="py-2 px-3 border">—</td>
                  <td className="py-2 px-3 border">—</td>
                  <td className="py-2 px-3 border">—</td>

                  <td className="py-2 px-3 border text-center">
                    <button
                      onClick={() => setShowModal(true)}
                      className="inline-flex items-center justify-center w-12 h-12 bg-accent text-white rounded-full hover:bg-accent-light transition"
                    >
                      <PlusCircle size={20} />
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <RegistroModal
          idDetalleTarea={tareaObj.id_detalle_tarea}
          cantidadTotal={detalle.cantidad_total}
          idTarea={idTarea}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
