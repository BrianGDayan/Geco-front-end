import React from 'react';
import { PlanillaResponse } from '@/lib/planillas';

interface Props {
  planilla: PlanillaResponse;
}

export default function AdminFooter({ planilla }: Props) {
  const { peso_total, pesos_diametro } = planilla;

  return (
    <>
      {/* Peso total de la planilla */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-primary-dark mb-4">Peso Total (Tn)</h2>
        <div className="text-2xl font-bold text-gray-text text-center mb-2">
          {peso_total.toFixed(3)}
        </div>
        <div className="grid grid-cols-4 gap-4 text-center">
          {pesos_diametro.map(({ diametro, peso }) => (
            <div key={diametro} className="space-y-1">
              <div className="text-sm font-medium text-gray-text">Ø {diametro}</div>
              <div className="text-xl font-semibold text-gray-text">{peso.toFixed(3)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Rendimientos globales trabajador */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-primary-dark mb-4">Rendimiento Global (Trabajador)</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="font-medium text-gray-text">Corte</div>
            <div className="text-xl font-semibold text-gray-text">
              {planilla.rendimiento_global_corte_trabajador.toFixed(3)}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-text">Doblado</div>
            <div className="text-xl font-semibold text-gray-text">
              {planilla.rendimiento_global_doblado_trabajador.toFixed(3)}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-text">Empaquetado</div>
            <div className="text-xl font-semibold text-gray-text">
              {planilla.rendimiento_global_empaquetado_trabajador.toFixed(3)}
            </div>
          </div>
        </div>
      </div>

      {/* Rendimientos globales ayudante */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-primary-dark mb-4">Rendimiento Global (Ayudante)</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="font-medium text-gray-text">Corte</div>
            <div className="text-xl font-semibold text-gray-text">
              {planilla.rendimiento_global_corte_ayudante.toFixed(3)}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-text">Doblado</div>
            <div className="text-xl font-semibold text-gray-text">
              {planilla.rendimiento_global_doblado_ayudante.toFixed(3)}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-text">Empaquetado</div>
            <div className="text-xl font-semibold text-gray-text">
              {planilla.rendimiento_global_empaquetado_ayudante.toFixed(3)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
