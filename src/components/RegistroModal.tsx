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
    2: ['Doblador', 'Ayudante'],
    3: ['Empaquetador 1', 'Empaquetador 2'],
  } as Record<number, [string, string]>;

  const [nombre1, setNombre1] = useState('');
  const [nombre2, setNombre2] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [ini1, setIni1] = useState('08:00');
  const [fin1, setFin1] = useState('08:30');
  const [ini2, setIni2] = useState('');
  const [fin2, setFin2] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`nombres-tarea-${idTarea}`);
    if (saved) {
      try {
        const obj = JSON.parse(saved);
        setNombre1(obj.nombre1 || '');
        setNombre2(obj.nombre2 || '');
      } catch {}
    }
  }, [idTarea]);

  const diffHoras = (start: string, end: string) => {
    const [h1, m1] = start.split(':').map(Number);
    const [h2, m2] = end.split(':').map(Number);
    const minutos = (h2 * 60 + m2) - (h1 * 60 + m1);
    return minutos > 0 ? +(minutos / 60).toFixed(2) : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (cantidad <= 0 || cantidad > cantidadTotal) {
      setError(`La cantidad debe ser mayor a 0 y menor o igual a ${cantidadTotal}`);
      return;
    }

    const horasTrab = diffHoras(ini1, fin1);
    if (horasTrab <= 0) {
      setError('Las horas del primer operario no son válidas.');
      return;
    }

    const tieneNombre2 = nombre2.trim() !== '';
    const tieneHoras2 = ini2 !== '' || fin2 !== '';
    if (tieneNombre2 && (!ini2 || !fin2)) {
      setError('Completa inicio y fin para el segundo operario.');
      return;
    }
    if (!tieneNombre2 && tieneHoras2) {
      setError('Si completás horas para el segundo operario, debe tener nombre.');
      return;
    }

    let horasAyu = 0;
    if (tieneNombre2) {
      const h2 = diffHoras(ini2, fin2);
      if (h2 <= 0) {
        setError('Las horas del segundo operario no son válidas.');
        return;
      }
      horasAyu = h2;
    }

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
      setError(err.message || 'Error al guardar.');
      setIsSubmitting(false);
    }
  };

  const [label1, label2] = labels[idTarea] || ['Oficial', 'Ayudante'];

  return (
  <Dialog open onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <Dialog.Panel className="relative z-10 w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
          <Dialog.Title className="text-lg font-semibold text-gray-800 mb-4">
            Nuevo registro
          </Dialog.Title>

          <div className="flex justify-between mb-4">
            <div className="px-3 py-1 border rounded text-sm text-gray-700">
              Fecha: <span>{new Date().toLocaleDateString('es-AR')}</span>
            </div>
            <div className="px-3 py-1 border rounded text-sm text-gray-700">
              Cantidad total: <span>{cantidadTotal}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{label1}</label>
                <input
                  type="text"
                  value={nombre1}
                  onChange={e => setNombre1(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{label2} (opcional)</label>
                <input
                  type="text"
                  value={nombre2}
                  onChange={e => setNombre2(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Cantidad</label>
              <input
                type="number"
                value={cantidad}
                onChange={e => setCantidad(+e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                min={1}
                max={cantidadTotal}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Inicio – {label1}</label>
                <input
                  type="time"
                  value={ini1}
                  onChange={e => setIni1(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
                <label className="block text-sm font-medium text-gray-700 mt-2">Fin – {label1}</label>
                <input
                  type="time"
                  value={fin1}
                  onChange={e => setFin1(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Inicio – {label2}</label>
                <input
                  type="time"
                  value={ini2}
                  onChange={e => setIni2(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required={nombre2.trim() !== ''}
                />
                <label className="block text-sm font-medium text-gray-700 mt-2">Fin – {label2}</label>
                <input
                  type="time"
                  value={fin2}
                  onChange={e => setFin2(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required={nombre2.trim() !== ''}
                />
              </div>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex justify-end gap-4 mt-6">
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
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition disabled:opacity-50"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
