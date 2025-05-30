// src/app/admin/planillas-completadas/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { getPlanillasCompletadas, DeletePlanilla, PlanillaSummary } from '@/lib/planillas';
import { Trash2 } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function PlanillasCompletadasPage() {
  const [planillas, setPlanillas] = useState<PlanillaSummary[]>([]);
  const [page, setPage] = useState(1);

  // Fetch inicial
  useEffect(() => {
    getPlanillasCompletadas()
      .then(setPlanillas)
      .catch(console.error);
  }, []);

  const totalPages = Math.ceil(planillas.length / ITEMS_PER_PAGE);
  const sliced = planillas.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleDelete = async (nro: string) => {
    if (!confirm(`¿Eliminar planilla ${nro}?`)) return;
    await DeletePlanilla(nro);
    setPlanillas(plans => plans.filter(p => p.nro_planilla !== nro));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Planillas Completadas</h1>

      <div className="space-y-6">
        {sliced.map((p) => (
          <div key={p.nro_planilla} className="border rounded-lg bg-white shadow overflow-hidden">
            {/* Datos */}
            <div className="grid grid-cols-6 text-center text-sm">
              <div className="p-3 border-r text-left">
                <span className="block font-semibold">Obra:</span>
                {p.obra}
              </div>
              <div className="p-3 border-r">
                <span className="block font-semibold">Progreso:</span>
                <span className="text-green-600">{p.progreso}%</span>
              </div>
              <div className="p-3 border-r">
                <span className="block font-semibold">Sector:</span>
                {p.sector}
              </div>
              <div className="p-3 border-r">
                <span className="block font-semibold">Plano Nº:</span>
                {p.nro_plano}
              </div>
              <div className="p-3 border-r">
                <span className="block font-semibold">Item:</span>
                {p.item}
              </div>
              <div className="p-3 flex items-center justify-center">
                <button onClick={() => handleDelete(p.nro_planilla)}>
                  <Trash2 size={24} className="text-gray-700 hover:text-red-600" />
                </button>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center justify-center gap-4 bg-gray-bg p-4">
              <button className="px-4 py-2 bg-[#226FB7] text-white rounded hover:bg-primary-mid">
                Ver datos de corte
              </button>
              <button className="px-4 py-2 bg-[#1E7F66] text-white rounded hover:bg-accent-light">
                Ver datos de doblado
              </button>
              <button className="px-4 py-2 bg-[#6A1B4D] text-white rounded hover:bg-primary-dark">
                Ver datos de empaquetado
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <nav className="mt-6 flex justify-center items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                num === page
                  ? 'bg-primary text-white'
                  : 'bg-white border border-gray-border text-gray-text'
              }`}
            >
              {num}
            </button>
          ))}
          {totalPages > 5 && <span className="text-gray-text mt-1">…</span>}
        </nav>
      )}
    </div>
);
}
