// components/RegistroModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { RegistroDto, CreateRegistro } from '@/lib/registros';

interface Props {
  idDetalleTarea: number;
  cantidadTotal: number;
  idTarea: number;
  onClose: () => void;
}

export default function RegistroModal({
  idDetalleTarea,
  cantidadTotal,
  idTarea,
  onClose,
}: Props) {
  const [fecha, setFecha] = useState<string>('');
  const [nombreTrabajador, setNombreTrabajador] = useState<string>('');
  const [nombreAyudante, setNombreAyudante] = useState<string>('');
  const [cantidadProducida, setCantidadProducida] = useState<number>(0);
  const [horasTrabajador, setHorasTrabajador] = useState<number>(0);
  const [horasAyudante, setHorasAyudante] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear());
    setFecha(`${day}-${month}-${year}`);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const dto: RegistroDto = {
      idDetalle: idDetalleTarea,
      idTarea,                 // ahora pasamos el idTarea correcto
      cantidad: cantidadProducida,
      horasTrabajador,
      horasAyudante,
      nombreTrabajador,
      nombreAyudante,
    };

    try {
      await CreateRegistro(dto);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al guardar registro');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <span className="inline-block h-screen align-middle" aria-hidden="true">
          &#8203;
        </span>
        <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-lg rounded-lg">
          <Dialog.Title className="text-lg font-medium text-gray-text mb-4">
            Registrar nuevo registro
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center bg-gray-bg border border-gray-border rounded-md px-4 py-2">
              <div className="text-sm font-medium text-gray-text">
                Fecha: <span className="font-semibold">{fecha}</span>
              </div>
              <div className="text-sm font-medium text-gray-text">
                Cantidad total: <span className="font-semibold">{cantidadTotal}</span>
              </div>
            </div>
            {/* campos… */}
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-accent text-white rounded hover:bg-accent-light"
              >
                Volver atrás
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-mid disabled:opacity-50"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
        </div>
      </div>
    </Dialog>
  );
}
