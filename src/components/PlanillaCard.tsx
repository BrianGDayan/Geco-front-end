'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { DeletePlanilla, PlanillaSummary } from '../lib/planillas';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    await DeletePlanilla(planilla.nro_planilla);
    setVisible(false);
    setShowConfirm(false);
  };

  const textoCorte =
    modo === 'admin' ? 'Visualizar datos de corte' : 'Registrar datos de corte';
  const textoDoblado =
    modo === 'admin' ? 'Visualizar datos de doblado' : 'Registrar datos de doblado';
  const textoEmpaque =
    modo === 'admin' ? 'Visualizar datos de empaquetado' : 'Registrar datos de empaquetado';

  if (!visible) return null;

  return (
    <div className="border rounded-lg bg-white shadow overflow-hidden relative">

      {/* ------------------------- */}
      {/* ENCABEZADO (condicional) */}
      {/* ------------------------- */}
      {modo === 'admin' ? (
        /* *** VERSIÓN ADMIN (completa) *** */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 text-center text-sm">

          <div className="p-3 border-r flex flex-col items-center justify-center">
            <span className="font-semibold">Planilla N°:</span>
            <span>{planilla.nro_planilla}</span>
          </div>

          <div className="p-3 border-r">
            <span className="block font-semibold">Obra:</span>
            {planilla.obra}
          </div>

          <div className="p-3 border-r">
            <span className="block font-semibold">Progreso:</span>
            <span
              className={
                planilla.progreso === 100 ? 'text-green-600' : 'text-yellow-600'
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

          <div className="p-3">
            <span className="block font-semibold">Fecha:</span>
            {planilla.fecha.toLocaleDateString('es-ES')}
          </div>
        </div>
      ) : (
        /* *** VERSIÓN ENCARGADO (reducida) *** */
        <div className="grid grid-cols-1 sm:grid-cols-3 text-center text-sm">

          <div className="p-3 border-r flex flex-col items-center justify-center">
            <span className="font-semibold">Planilla N°:</span>
            <span>{planilla.nro_planilla}</span>
          </div>

          <div className="p-3 border-r">
            <span className="block font-semibold">Obra:</span>
            {planilla.obra}
          </div>

          <div className="p-3">
            <span className="block font-semibold">Progreso:</span>
            <span
              className={
                planilla.progreso === 100 ? 'text-green-600' : 'text-yellow-600'
              }
            >
              {planilla.progreso}%
            </span>
          </div>

        </div>
      )}

      {/* ------------------------- */}
      {/*     BOTONES Y ACCIONES    */}
      {/* ------------------------- */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 bg-gray-100 px-4 py-4">
        <button
          onClick={() => onCorte?.(planilla.nro_planilla)}
          className="flex-1 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition text-center"
        >
          {textoCorte}
        </button>

        <button
          onClick={() => onDoblado?.(planilla.nro_planilla)}
          className="flex-1 px-4 py-2 bg-[#1E7F66] text-white rounded hover:bg-green-700 transition text-center"
        >
          {textoDoblado}
        </button>

        <button
          onClick={() => onEmpaque?.(planilla.nro_planilla)}
          className="flex-1 px-4 py-2 bg-[#6A1B4D] text-white rounded hover:bg-pink-800 transition text-center"
        >
          {textoEmpaque}
        </button>

        {mostrarEliminar && (
          <button
            onClick={() => setShowConfirm(true)}
            title="Eliminar planilla"
            className="p-2 rounded-full bg-gray-200 hover:bg-red-100 hover:text-red-600 transition-colors"
          >
            <Trash2 size={24} />
          </button>
        )}
      </div>

      {/* ------------------------- */}
      {/*   MODAL ELIMINAR         */}
      {/* ------------------------- */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-lg p-8 min-h-[200px] max-w-sm w-full flex flex-col justify-between"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-lg font-semibold mb-4">Confirmar eliminación</h2>
              <p className="mb-6">
                ¿Deseas eliminar la planilla {planilla.nro_planilla}?
              </p>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

