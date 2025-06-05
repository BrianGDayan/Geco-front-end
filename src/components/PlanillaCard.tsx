'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { DeletePlanilla, PlanillaSummary } from '@/lib/planillas';

interface PlanillaCardProps {
  planilla: PlanillaSummary;
  mostrarEliminar?: boolean;
  onCorte?: (nro: string) => void;
  onDoblado?: (nro: string) => void;
  onEmpaque?: (nro: string) => void;
  modo: 'admin' | 'encargado';
}

export default function PlanillaCard({
  planilla,
  mostrarEliminar = false,
  onCorte,
  onDoblado,
  onEmpaque,
  modo,
}: PlanillaCardProps) {
  const [visible, setVisible] = useState(true);

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar planilla ${planilla.nro_planilla}?`)) return;
    await DeletePlanilla(planilla.nro_planilla);
    setVisible(false);
  };

  const textoCorte =
    modo === 'admin' ? 'Ver datos de corte' : 'Registrar datos de corte';
  const textoDoblado =
    modo === 'admin' ? 'Ver datos de doblado' : 'Registrar datos de doblado';
  const textoEmpaque =
    modo === 'admin' ? 'Ver datos de empaquetado' : 'Registrar datos de empaquetado';

  if (!visible) return null;

  return (
    <div className="border rounded-lg bg-white shadow overflow-hidden">
      <div className="grid grid-cols-6 text-center text-sm">
        <div className="p-3 border-r text-left">
          <span className="block font-semibold">Obra:</span>
          {planilla.obra}
        </div>
        <div className="p-3 border-r">
          <span className="block font-semibold">Progreso:</span>
          <span
            className={
              planilla.progreso === 100
                ? 'text-green-600'
                : 'text-yellow-600'
            }
          >
            {planilla.progreso}%
          </span>
        </div>
        <div className="p-3 border-r">
          <span className="block font-semibold">Sector:</span>
          {planilla.sector}
        </div>
        <div className="p-3 border-r">
          <span className="block font-semibold">Plano Nº:</span>
          {planilla.nro_plano}
        </div>
        <div className="p-3 border-r">
          <span className="block font-semibold">Item:</span>
          {planilla.item}
        </div>
        <div className="p-3 flex items-center justify-center">
          {mostrarEliminar && (
            <button onClick={handleDelete}>
              <Trash2 size={24} className="text-gray-700 hover:text-red-600" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 bg-gray-100 p-4">
        <button
          onClick={() => onCorte && onCorte(planilla.nro_planilla)}
          className="px-4 py-2 bg-[#226FB7] text-white rounded hover:bg-blue-600"
        >
          {textoCorte}
        </button>
        <button
          onClick={() => onDoblado && onDoblado(planilla.nro_planilla)}
          className="px-4 py-2 bg-[#1E7F66] text-white rounded hover:bg-green-700"
        >
          {textoDoblado}
        </button>
        <button
          onClick={() => onEmpaque && onEmpaque(planilla.nro_planilla)}
          className="px-4 py-2 bg-[#6A1B4D] text-white rounded hover:bg-pink-800"
        >
          {textoEmpaque}
        </button>
      </div>
    </div>
  );
}
