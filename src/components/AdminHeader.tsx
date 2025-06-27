'use client';
import React from 'react';
import { PlanillaResponse } from '@/lib/planillas';

interface Props {
  planilla: PlanillaResponse;
}

export default function AdminHeader({ planilla }: Props) {
  // Usamos el progreso calculado en backend
  const progresoTotal = planilla.progreso ?? 0;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 w-full max-w-7xl mx-auto">
      <h2 className="text-lg font-semibold text-primary-dark mb-4">
        CORTE / DOBLADO / EMPAQUETADO
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-text">
            Nº planilla
          </label>
          <input
            readOnly
            value={planilla.nro_planilla}
            className="mt-1 block w-full bg-gray-bg border border-gray-border rounded-md py-2 px-3 text-sm text-gray-text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-text">Obra</label>
          <input
            readOnly
            value={planilla.obra}
            className="mt-1 block w-full bg-gray-bg border border-gray-border rounded-md py-2 px-3 text-sm text-gray-text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-text">Sector</label>
          <input
            readOnly
            value={planilla.sector}
            className="mt-1 block w-full bg-gray-bg border border-gray-border rounded-md py-2 px-3 text-sm text-gray-text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-text">Plano Nº</label>
          <input
            readOnly
            value={planilla.nro_plano}
            className="mt-1 block w-full bg-gray-bg border border-gray-border rounded-md py-2 px-3 text-sm text-gray-text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-text">Fecha</label>
          <input
            readOnly
            value={new Date(planilla.fecha).toLocaleDateString('es-AR')}
            className="mt-1 block w-full bg-gray-bg border border-gray-border rounded-md py-2 px-3 text-sm text-gray-text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-text">Ítem</label>
          <input
            readOnly
            value={planilla.item}
            className="mt-1 block w-full bg-gray-bg border border-gray-border rounded-md py-2 px-3 text-sm text-gray-text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-text">Elaboró</label>
          <input
            readOnly
            value={planilla.encargado_elaborar}
            className="mt-1 block w-full bg-gray-bg border border-gray-border rounded-md py-2 px-3 text-sm text-gray-text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-text">Revisó</label>
          <input
            readOnly
            value={planilla.encargado_revisar}
            className="mt-1 block w-full bg-gray-bg border border-gray-border rounded-md py-2 px-3 text-sm text-gray-text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-text">Aprobó</label>
          <input
            readOnly
            value={planilla.encargado_aprobar}
            className="mt-1 block w-full bg-gray-bg border border-gray-border rounded-md py-2 px-3 text-sm text-gray-text"
          />
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-gray-border pt-4">
        <div className="text-sm text-gray-text">
          <span className="font-medium">Revisiones:</span> {planilla.revision}
        </div>
        <div className="text-sm text-gray-text">
          <span className="font-medium">Progreso:</span>{' '}
          <span
            className={`font-semibold ${
              progresoTotal >= 100 ? 'text-primary' : 'text-accent'
            }`}
          >
            {progresoTotal}%
          </span>
        </div>
      </div>
    </div>
  );
}
