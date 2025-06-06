// components/AdminHeader.tsx
import React from 'react';
import { PlanillaResponse } from '@/lib/planillas';

interface Props {
  planilla: PlanillaResponse;
}

export default function AdminHeader({ planilla }: Props) {
  // Ejemplo de cálculo de progreso (puedes ajustar al cálculo real)
  const detalles = planilla.elemento.flatMap((e) => e.detalle);
  const progresoTotal =
    detalles.length > 0
      ? Math.floor(detalles.reduce((acc, d) => acc + d.progreso, 0) / detalles.length)
      : 0;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h1 className="text-xl font-semibold text-primary-dark mb-4">
        REGISTRO DE CORTE/ DOBLADO/ EMPAQUETADO
      </h1>

      {/* Primera fila: datos de planilla */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-text">Nº planilla</label>
          <input
            readOnly
            value={planilla.nro_planilla}
            className="mt-1 block w-full bg-gray-bg border border-gray-border rounded-md px-3 py-2 text-sm text-gray-text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-text">Obra</label>
          <input
            readOnly
            value={planilla.obra}
            className="mt-1 block w-full bg-gray-bg border border-gray-border rounded-md px-3 py-2 text-sm text-gray-text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-text">Sector</label>
          <input
            readOnly
            value={planilla.sector}
            className="mt-1 block w-full bg-gray-bg border border-gray-border rounded-md px-3 py-2 text-sm text-gray-text"
          />
        </div>
      </div>

      {/* Segunda fila: plano, fecha, item */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-text">Plano Nº</label>
          <input
            readOnly
            value={planilla.nro_plano}
            className="mt-1 block w-full bg-gray-bg border border-gray-border rounded-md px-3 py-2 text-sm text-gray-text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-text">Fecha</label>
          <input
            readOnly
            value={new Date(planilla.fecha).toLocaleDateString('es-ES')}
            className="mt-1 block w-full bg-gray-bg border border-gray-border rounded-md px-3 py-2 text-sm text-gray-text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-text">Ítem</label>
          <input
            readOnly
            value={planilla.item}
            className="mt-1 block w-full bg-gray-bg border border-gray-border rounded-md px-3 py-2 text-sm text-gray-text"
          />
        </div>
      </div>

      {/* Tercera fila: Elaboró / Revisó / Aprobó */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-text">Elaboró</label>
          <input
            readOnly
            value={planilla.encargado_elaborar}
            className="mt-1 block w-full bg-gray-bg border border-gray-border rounded-md px-3 py-2 text-sm text-gray-text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-text">Revisó</label>
          <input
            readOnly
            value={planilla.encargado_revisar}
            className="mt-1 block w-full bg-gray-bg border border-gray-border rounded-md px-3 py-2 text-sm text-gray-text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-text">Aprobó</label>
          <input
            readOnly
            value={planilla.encargado_aprobar || '—'}
            className="mt-1 block w-full bg-gray-bg border border-gray-border rounded-md px-3 py-2 text-sm text-gray-text"
          />
        </div>
      </div>

      {/* Revisiones y Progreso */}
      <div className="flex justify-between items-center border-t border-gray-border pt-4">
        <div className="text-sm text-gray-text">
          <span className="font-medium">Revisiones:</span> {planilla.revision}
        </div>
        <div className="text-sm text-gray-text">
          <span className="font-medium">Progreso:</span>{' '}
          <span className={`font-semibold ${progresoTotal >= 100 ? 'text-primary' : 'text-accent'}`}>
            {progresoTotal}%
          </span>
        </div>
      </div>
    </div>
  );
}
