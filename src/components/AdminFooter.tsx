// components/AdminFooter.tsx
import React from 'react';
import { PlanillaResponse } from '@/lib/planillas';

interface Props {
  planilla: PlanillaResponse;
}

export default function AdminFooter({ planilla }: Props) {
  // Ejemplo de pesos_diametro, asumo que planilla.pesos_diametro es un array con objetos { diametro: number, peso: number }
  // Si tu PlanillaResponse no incluye pesos_diametro directamente, reemplaza esto con los datos correctos desde el backend.
  const pesosDiametro: { diametro: number; peso: number }[] = [
    { diametro: 8, peso: 14.425 },
    { diametro: 10, peso: 4.609 },
    { diametro: 12, peso: 4.609 },
    { diametro: 16, peso: 4.609 },
  ];

  return (
    <div>
      {/* Sección: Peso Total */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-primary-dark mb-4">Peso Total (Tn)</h2>
        <div className="grid grid-cols-4 gap-4 text-center">
          {pesosDiametro.map((p) => (
            <div key={p.diametro} className="space-y-1">
              <div className="text-sm font-medium text-gray-text">Ø {p.diametro}</div>
              <div className="text-xl font-semibold text-gray-text">{p.peso.toFixed(3)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sección: Medidas de rendimiento oficial */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-primary-dark mb-4">Medidas de Rendimiento Oficial</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-accent-light rounded-lg p-4">
            <h3 className="font-medium text-gray-text mb-2">Rendimiento Tipo 1</h3>
            <p className="text-sm text-gray-text">Doblado: 0,05</p>
            <p className="text-sm text-gray-text">Corte: 0,028</p>
            <p className="text-sm text-gray-text">Empaquetado: 0,012</p>
          </div>
          <div className="bg-accent-light rounded-lg p-4">
            <h3 className="font-medium text-gray-text mb-2">Rendimiento Tipo 4</h3>
            <p className="text-sm text-gray-text">Doblado: 0,05</p>
            <p className="text-sm text-gray-text">Corte: 0,028</p>
            <p className="text-sm text-gray-text">Empaquetado: 0,012</p>
          </div>
          <div className="bg-accent-light rounded-lg p-4">
            <h3 className="font-medium text-gray-text mb-2">Rendimiento Tipo 5</h3>
            <p className="text-sm text-gray-text">Doblado: 0,05</p>
            <p className="text-sm text-gray-text">Corte: 0,028</p>
            <p className="text-sm text-gray-text">Empaquetado: 0,012</p>
          </div>
        </div>
      </div>

      {/* Sección: Rendimiento Global */}
      <div className="bg-[#E1FCEE] rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-primary-dark mb-4">Rendimiento Global</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-accent-light rounded-lg p-4 text-center">
            <div className="text-sm font-medium text-gray-text">Doblado</div>
            <div className="text-xl font-semibold text-gray-text">0,05</div>
          </div>
          <div className="bg-accent-light rounded-lg p-4 text-center">
            <div className="text-sm font-medium text-gray-text">Corte</div>
            <div className="text-xl font-semibold text-gray-text">0,028</div>
          </div>
          <div className="bg-accent-light rounded-lg p-4 text-center">
            <div className="text-sm font-medium text-gray-text">Empaquetado</div>
            <div className="text-xl font-semibold text-gray-text">0,012</div>
          </div>
        </div>
        <div className="mt-4 bg-green-200 rounded-lg p-4 text-center">
          <div className="text-sm font-medium text-gray-text">Suma de Rendimientos</div>
          <div className="text-2xl font-semibold text-gray-text">0,09</div>
        </div>
      </div>

      {/* Sección: Medidas de rendimiento ayudante (muy similar a oficial) */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-primary-dark mb-4">Medidas de Rendimiento Ayudante</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-accent-light rounded-lg p-4">
            <h3 className="font-medium text-gray-text mb-2">Rendimiento Tipo 1</h3>
            <p className="text-sm text-gray-text">Doblado: 0,05</p>
            <p className="text-sm text-gray-text">Corte: 0,028</p>
            <p className="text-sm text-gray-text">Empaquetado: 0,012</p>
          </div>
          <div className="bg-accent-light rounded-lg p-4">
            <h3 className="font-medium text-gray-text mb-2">Rendimiento Tipo 4</h3>
            <p className="text-sm text-gray-text">Doblado: 0,05</p>
            <p className="text-sm text-gray-text">Corte: 0,028</p>
            <p className="text-sm text-gray-text">Empaquetado: 0,012</p>
          </div>
          <div className="bg-accent-light rounded-lg p-4">
            <h3 className="font-medium text-gray-text mb-2">Rendimiento Tipo 5</h3>
            <p className="text-sm text-gray-text">Doblado: 0,05</p>
            <p className="text-sm text-gray-text">Corte: 0,028</p>
            <p className="text-sm text-gray-text">Empaquetado: 0,012</p>
          </div>
        </div>
      </div>
    </div>
  );
}
