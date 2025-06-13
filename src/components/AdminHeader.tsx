import React from 'react';
import { PlanillaResponse } from '@/lib/planillas';

interface Props {
  planilla: PlanillaResponse;
}

export default function AdminHeader({ planilla }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h1 className="text-xl font-semibold text-primary-dark mb-4">
        REGISTRO DE CORTE/ DOBLADO/ EMPAQUETADO
      </h1>

      {/* Datos generales en grid */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* … inputs de Nº planilla, Obra, Sector … */}
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* … inputs de Plano Nº, Fecha, Ítem … */}
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* … inputs de Elaboró, Revisó, Aprobó … */}
      </div>

      {/* Revisiones y Progreso */}
      <div className="flex justify-between items-center border-t border-gray-border pt-4">
        <div className="text-sm text-gray-text">
          <span className="font-medium">Revisiones:</span> {planilla.revision}
        </div>
        <div className="text-sm text-gray-text">
          <span className="font-medium">Progreso:</span>{' '}
          <span
            className={`font-semibold ${
              planilla.progreso >= 100 ? 'text-primary' : 'text-accent'
            }`}
          >
            {planilla.progreso}%
          </span>
        </div>
      </div>
    </div>
  );
}
