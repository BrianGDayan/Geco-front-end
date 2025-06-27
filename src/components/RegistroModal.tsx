'use client';

import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { RegistroDto, CreateRegistro } from '@/lib/registros';

interface Props {
  idDetalle: number;
  idDetalleTarea: number;
  cantidadTotal: number;
  idTarea: number;
  onClose: () => void;
  onSaved: () => void;
}

export default function RegistroModal({
  idDetalle,
  idDetalleTarea,
  cantidadTotal,
  idTarea,
  onClose,
  onSaved,
}: Props) {
  const labels = {
    1: ['Cortador 1', 'Cortador 2'],
    2: ['Doblador',    'Ayudante'],
    3: ['Empaquetador 1','Empaquetador 2'],
  } as Record<number, [string, string]>;

  const [nombre1, setNombre1] = useState('');
  const [nombre2, setNombre2] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [ini1, setIni1] = useState('08:00');
  const [fin1, setFin1] = useState('08:30');
  // Para el segundo operario, empezamos vacíos
  const [ini2, setIni2] = useState('');
  const [fin2, setFin2] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargo nombres previos
  useEffect(() => {
    const saved = localStorage.getItem(`nombres-tarea-${idTarea}`);
    if (saved) {
      try {
        const obj = JSON.parse(saved);
        setNombre1(obj.nombre1);
        setNombre2(obj.nombre2 || '');
      } catch {}
    }
  }, [idTarea]);

  // Calcula decimales de horas
  const diffHoras = (start: string, end: string) => {
    const [h1, m1] = start.split(':').map(Number);
    const [h2, m2] = end.split(':').map(Number);
    const minutos = (h2 * 60 + m2) - (h1 * 60 + m1);
    return minutos > 0 ? +(minutos / 60).toFixed(3) : 0;
  };

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1) Cantidad válida
    if (cantidad <= 0 || cantidad > cantidadTotal) {
      setError(`Cantidad debe ser >0 y ≤ ${cantidadTotal}`);
      return;
    }

    // 2) Horas primer operario
    const horasTrab = diffHoras(ini1, fin1);
    if (horasTrab <= 0) {
      setError('Horas del primer operario inválidas (fin debe ser después del inicio)');
      return;
    }

    // 3) Consistencia segundo operario
    const tieneNombre2 = nombre2.trim() !== '';
    const tieneHoras2 = ini2 !== '' || fin2 !== '';
    if (tieneNombre2 && (!ini2 || !fin2)) {
      setError('Debe completar ambas horas (inicio y fin) del segundo operario');
      return;
    }
    if (!tieneNombre2 && tieneHoras2) {
      setError('Si ingresás horas para el segundo operario, también debe incluir su nombre');
      return;
    }

    // 4) Cálculo horas ayudante (si existe)
    let horasAyu = 0;
    if (tieneNombre2) {
      const h2 = diffHoras(ini2, fin2);
      if (h2 <= 0) {
        setError('Horas del segundo operario inválidas (fin debe ser después del inicio)');
        return;
      }
      horasAyu = h2;
    }

    // 5) Armo payload dinámico sin campos vacíos
    setIsSubmitting(true);
    const payload: any = {
      idDetalle,
      idTarea,
      cantidad,
      horasTrabajador: horasTrab,
      nombreTrabajador: nombre1,
    };
    if (tieneNombre2) {
      payload.nombreAyudante = nombre2;
      payload.horasAyudante = horasAyu;
    }

    try {
      await CreateRegistro(payload);
      localStorage.setItem(
        `nombres-tarea-${idTarea}`,
        JSON.stringify({ nombre1, nombre2 })
      );
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
      setIsSubmitting(false);
    }
  };

  const [label1, label2] = labels[idTarea] || ['Oficial', 'Ayudante'];

  return (
    <Dialog open onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black opacity-30 pointer-events-none" aria-hidden="true" />
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <span className="inline-block h-screen align-middle">&#8203;</span>
        <div
          className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden align-middle transition-all transform bg-white shadow-lg rounded-lg"
          style={{ zIndex: 51 }}
        >
          <Dialog.Title className="mb-4 text-lg font-semibold text-gray-800">
            Nuevo registro
          </Dialog.Title>

          <div className="flex justify-between mb-6">
            <div className="px-3 py-2 border rounded text-sm text-gray-700">
              Fecha: <span>{new Date().toLocaleDateString('es-AR')}</span>
            </div>
            <div className="px-3 py-2 border rounded text-sm text-gray-700">
              Cantidad total: <span>{cantidadTotal}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombres */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{label1}</label>
                <input
                  type="text"
                  value={nombre1}
                  onChange={e => setNombre1(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {label2} (opcional)
                </label>
                <input
                  type="text"
                  value={nombre2}
                  onChange={e => setNombre2(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>

            {/* Cantidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Cantidad</label>
              <input
                type="number"
                value={cantidad}
                onChange={e => setCantidad(+e.target.value)}
                className="w-full px-3 py-2 border rounded"
                min={1}
                max={cantidadTotal}
                required
              />
            </div>

            {/* Horas primer y segundo operario */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Inicio – {label1}</label>
                <input
                  type="time"
                  value={ini1}
                  onChange={e => setIni1(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                <label className="block text-sm font-medium text-gray-700 mt-2">Fin – {label1}</label>
                <input
                  type="time"
                  value={fin1}
                  onChange={e => setFin1(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Inicio – {label2}</label>
                <input
                  type="time"
                  value={ini2}
                  onChange={e => setIni2(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  // sólo obligatorio si hay nombre2
                  required={nombre2.trim() !== ''}
                />
                <label className="block text-sm font-medium text-gray-700 mt-2">Fin – {label2}</label>
                <input
                  type="time"
                  value={fin2}
                  onChange={e => setFin2(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required={nombre2.trim() !== ''}
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Botones */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary-dark transition"
              >
                Volver atrás
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#226FB7] text-white rounded hover:bg-[#1a5aa3] transition disabled:opacity-50"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}
