// src/components/AdminFooter.tsx

import React from 'react';
import { PlanillaResponse } from '@/lib/planillas';

interface Props {
  planilla: PlanillaResponse;
}

export default function AdminFooter({ planilla }: Props) {
  const { peso_total, pesos_diametro } = planilla;
  const total = typeof peso_total === 'number' ? peso_total.toFixed(3) : '—';

  // placeholder de nombres; luego los sustituirás dinámicamente
  const nombre1 = 'Nombre Operario 1';
  const nombre2 = 'Nombre Operario 2';

  return (
    <div className="space-y-6">
      {/* Peso Total */}
      <div className="rounded-lg shadow p-6 bg-white">
        <h2 className="text-xl font-bold text-[#226FB7] mb-2">Peso Total (Tn)</h2>
        <div className="text-4xl font-extrabold text-gray-800 text-center">
          {total}
        </div>
      </div>

      {/* Medidas de Rendimiento Oficial */}
      <div className="rounded-lg shadow p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Medidas de rendimiento del Cortador 1 ({nombre1})
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {/* Estos tres bloques quedan vacíos por ahora */}
          <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'rgba(34,111,183,0.74)' }}>
            <div className="font-medium text-white">Rendimiento Tipo 1</div>
            <div className="text-2xl font-bold text-white">—</div>
          </div>
          <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'rgba(34,111,183,0.74)' }}>
            <div className="font-medium text-white">Rendimiento Tipo 2</div>
            <div className="text-2xl font-bold text-white">—</div>
          </div>
          <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'rgba(34,111,183,0.74)' }}>
            <div className="font-medium text-white">Rendimiento Tipo 3</div>
            <div className="text-2xl font-bold text-white">—</div>
          </div>
        </div>
      </div>

      {/* Medidas de Rendimiento Ayudante */}
      <div className="rounded-lg shadow p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Medidas de rendimiento del Cortador 2 ({nombre2})
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'rgba(34,183,66,0.74)' }}>
            <div className="font-medium text-white">Rendimiento Tipo 1</div>
            <div className="text-2xl font-bold text-white">—</div>
          </div>
          <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'rgba(34,183,66,0.74)' }}>
            <div className="font-medium text-white">Rendimiento Tipo 2</div>
            <div className="text-2xl font-bold text-white">—</div>
          </div>
          <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'rgba(34,183,66,0.74)' }}>
            <div className="font-medium text-white">Rendimiento Tipo 3</div>
            <div className="text-2xl font-bold text-white">—</div>
          </div>
        </div>
      </div>
    </div>
);
}
