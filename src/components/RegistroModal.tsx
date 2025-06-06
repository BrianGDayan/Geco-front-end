// components/RegistroModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { RegistroDto, CreateRegistro } from '@/lib/registros';

interface Props {
  idDetalleTarea: number;
  cantidadTotal: number;
  onClose: () => void;
}

export default function RegistroModal({ idDetalleTarea, cantidadTotal, onClose }: Props) {
  // Estados para los campos del formulario
  const [fecha, setFecha] = useState<string>('');
  const [nombreTrabajador, setNombreTrabajador] = useState<string>('');
  const [nombreAyudante, setNombreAyudante] = useState<string>('');
  const [cantidadProducida, setCantidadProducida] = useState<number>(0);
  const [horasTrabajador, setHorasTrabajador] = useState<number>(0);
  const [horasAyudante, setHorasAyudante] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Al montarse el modal, calculamos la fecha actual con formato DD‑MM‑YYYY
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
      idTarea: 0, // El backend ya conoce la tarea a partir de idDetalleTarea
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <Dialog open onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-lg rounded-lg">
            <Dialog.Title as="h3" className="text-lg font-medium text-gray-text mb-4">
              Registrar nuevo registro
            </Dialog.Title>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Encabezado fijo con Fecha y Cantidad total */}
              <div className="flex justify-between items-center bg-gray-bg border border-gray-border rounded-md px-4 py-2">
                <div className="text-sm font-medium text-gray-text">
                  Fecha: <span className="font-semibold text-gray-text">{fecha}</span>
                </div>
                <div className="text-sm font-medium text-gray-text">
                  Cantidad total: <span className="font-semibold text-gray-text">{cantidadTotal}</span>
                </div>
              </div>

              {/* Campos del formulario */}
              <div>
                <label className="block text-sm font-medium text-gray-text">Nombre del oficial</label>
                <input
                  type="text"
                  value={nombreTrabajador}
                  onChange={(e) => setNombreTrabajador(e.target.value)}
                  className="mt-1 block w-full bg-gray-bg border border-gray-border rounded-md py-2 px-3 text-sm text-gray-text"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-text">Nombre del ayudante</label>
                <input
                  type="text"
                  value={nombreAyudante}
                  onChange={(e) => setNombreAyudante(e.target.value)}
                  className="mt-1 block w-full bg-gray-bg border border-gray-border rounded-md py-2 px-3 text-sm text-gray-text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-text">Cantidad producida</label>
                <input
                  type="number"
                  value={cantidadProducida}
                  onChange={(e) => setCantidadProducida(Number(e.target.value))}
                  className="mt-1 block w-full bg-gray-bg border border-gray-border rounded-md py-2 px-3 text-sm text-gray-text"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-text">Horas del oficial</label>
                <input
                  type="number"
                  step="0.01"
                  value={horasTrabajador}
                  onChange={(e) => setHorasTrabajador(Number(e.target.value))}
                  className="mt-1 block w-full bg-gray-bg border border-gray-border rounded-md py-2 px-3 text-sm text-gray-text"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-text">Horas del ayudante</label>
                <input
                  type="number"
                  step="0.01"
                  value={horasAyudante}
                  onChange={(e) => setHorasAyudante(Number(e.target.value))}
                  className="mt-1 block w-full bg-gray-bg border border-gray-border rounded-md py-2 px-3 text-sm text-gray-text"
                />
              </div>

              {/* Mensaje de error si ocurre */}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* Botones de acción */}
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
            </form>
          </div>
        </Dialog>
      </div>
    </div>
  );
}
