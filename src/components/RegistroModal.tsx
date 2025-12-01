'use client';

import React, { useEffect, useState, Fragment } from 'react';
import useSWR from 'swr';
import { Dialog, Combobox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';
import { getTrabajadoresActivos, TrabajadorActivo } from '../lib/trabajadores';
import { CreateRegistro } from '../lib/registros';
import { useTimers } from '../hooks/useTimers';

interface Props {
  idDetalle: number;
  idDetalleTarea: number;
  cantidadTotal: number;
  idTarea: number;
  slot: number;
  onClose: () => void;
  onSaved: () => void;
}

function getLabelBySlot(idTarea: number, slot: number): string {
  if (idTarea === 1) return slot === 1 ? 'Cortador 1' : 'Cortador 2';
  if (idTarea === 2) {
    if (slot === 1) return 'Doblador';
    if (slot === 2) return 'Ayudante 1';
    return 'Ayudante 2';
  }
  if (idTarea === 3) return slot === 1 ? 'Empaquetador 1' : 'Empaquetador 2';
  return 'Operador';
}

export default function RegistroModal({
  idDetalle,
  idDetalleTarea,
  cantidadTotal,
  idTarea,
  slot,
  onClose,
  onSaved,
}: Props) {
  // --- KEY CORRECTA PARA TIMERS MULTIPLES ---
  const key = `${idDetalleTarea}-${slot}`;

  const [cantidad, setCantidad] = useState<number>(1);
  const [ini, setIni] = useState<string>('');
  const [fin, setFin] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorCantidad, setErrorCantidad] = useState('');
  const [errorOperador, setErrorOperador] = useState('');
  const [errorHoras, setErrorHoras] = useState('');

  const { data: trabajadores = [] } = useSWR<TrabajadorActivo[]>(
    '/trabajadores/activos',
    getTrabajadoresActivos,
  );

  // --- CAMBIO CLAVE: ahora los timers se leen por key compuesta ---
  const { getTimer, clearTimer } = useTimers();
  const timer = getTimer(idDetalleTarea, slot);

  const labelOperador = getLabelBySlot(idTarea, slot);

  const [selectedTrabajador, setSelectedTrabajador] =
    useState<TrabajadorActivo | null>(null);
  const [query, setQuery] = useState('');

  const filtrar = (q: string, arr: TrabajadorActivo[]) =>
    q.trim() === ''
      ? arr
      : arr.filter((t) =>
          t.nombre.toLowerCase().includes(q.toLowerCase()),
        );

  const filtered = filtrar(query, trabajadores);

  // Cargar valores del timer
  useEffect(() => {
    if (timer?.startedAt && timer?.stoppedAt) {
      const s = new Date(timer.startedAt);
      const e = new Date(timer.stoppedAt);

      const fmt = (d: Date) =>
        `${String(d.getHours()).padStart(2, '0')}:${String(
          d.getMinutes(),
        ).padStart(2, '0')}`;

      setIni(fmt(s));
      setFin(fmt(e));
    }
  }, [timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorCantidad('');
    setErrorOperador('');
    setErrorHoras('');

    if (cantidad <= 0 || cantidad > cantidadTotal) {
      setErrorCantidad(`Debe ser mayor a 0 y ≤ ${cantidadTotal}`);
      return;
    }
    if (!selectedTrabajador) {
      setErrorOperador('Seleccioná el operario.');
      return;
    }

    if (!timer?.startedAt || !timer?.stoppedAt) {
      setErrorHoras('No se encontró el temporizador para este operador.');
      return;
    }

    const s = new Date(timer.startedAt).getTime();
    const eMs = new Date(timer.stoppedAt).getTime();

    const horas = +(((eMs - s) / 3600000) || 0).toFixed(2);

    if (horas <= 0) {
      setErrorHoras('Las horas calculadas no son válidas.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      idDetalle,
      idTarea,
      cantidad,
      operadores: [
        {
          idTrabajador: selectedTrabajador.id_trabajador,
          tiempoHoras: horas,
          slot, // ← ahora se envía el slot para saber qué operador fue
        },
      ],
    };

    try {
      await CreateRegistro(payload);
      clearTimer(idDetalleTarea, slot); // ← limpia el timer correcto
      onSaved();
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorCantidad(err?.message || 'Error al guardar.');
    }
  };

  return (
    <Dialog open onClose={onClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-5 shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-lg font-semibold mb-3">
            Nuevo registro – {labelOperador}
          </Dialog.Title>

          <div className="flex justify-between mb-4 text-sm">
            <div className="w-full rounded-lg border px-3 py-3 text-base font-semibold">
              Cantidad total: {cantidadTotal}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Operador */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                {labelOperador}
              </label>

              <Combobox
                value={selectedTrabajador}
                onChange={setSelectedTrabajador}
              >
                {({ open }) => (
                  <div className="relative">
                    <div className="flex items-center">
                      <Combobox.Input
                        className="w-full rounded-lg border px-3 py-3 text-base"
                        placeholder={`Seleccionar ${labelOperador}`}
                        displayValue={(t: TrabajadorActivo | null) =>
                          t?.nombre ?? ''
                        }
                        onChange={(e) => setQuery(e.target.value)}
                      />
                      <Combobox.Button className="ml-2 p-2">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-500" />
                      </Combobox.Button>
                    </div>

                    <Transition
                      show={open}
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Combobox.Options className="mt-1 max-h-60 overflow-auto rounded bg-white shadow z-10">
                        {filtered.length === 0 ? (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            No hay resultados
                          </div>
                        ) : (
                          filtered.map((t) => (
                            <Combobox.Option
                              key={t.id_trabajador}
                              value={t}
                              className={({ active }) =>
                                `cursor-pointer px-3 py-2 ${active ? 'bg-gray-100' : ''}`
                              }
                            >
                              {({ selected }) => (
                                <div className="flex items-center justify-between">
                                  <span className={selected ? 'font-semibold' : ''}>
                                    {t.nombre}
                                  </span>
                                  {selected && (
                                    <CheckIcon className="h-4 w-4 text-green-600" />
                                  )}
                                </div>
                              )}
                            </Combobox.Option>
                          ))
                        )}
                      </Combobox.Options>
                    </Transition>
                  </div>
                )}
              </Combobox>

              {errorOperador && (
                <p className="text-red-600 text-sm mt-1">{errorOperador}</p>
              )}
            </div>

            {/* Cantidad */}
            <div>
              <label className="block font-medium mb-1">Cantidad</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                  className="px-3 py-2 bg-gray-200 rounded text-xl"
                >
                  −
                </button>

                <input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.target.value))}
                  className="w-20 text-center rounded border py-2 text-lg"
                  min={1}
                  max={cantidadTotal}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setCantidad((c) => Math.min(cantidadTotal, c + 1))
                  }
                  className="px-3 py-2 bg-gray-200 rounded text-xl"
                >
                  +
                </button>
              </div>

              {errorCantidad && (
                <p className="text-red-600 text-sm mt-1">{errorCantidad}</p>
              )}
            </div>

            {/* Horas */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Inicio – {labelOperador}
                  </label>
                  <input
                    type="time"
                    value={ini}
                    readOnly
                    className="rounded border px-3 py-2 bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Fin – {labelOperador}
                  </label>
                  <input
                    type="time"
                    value={fin}
                    readOnly
                    className="rounded border px-3 py-2 bg-gray-100"
                  />
                </div>
              </div>

              {errorHoras && (
                <p className="text-red-600 text-sm mt-1">{errorHoras}</p>
              )}
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-4 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded bg-gray-300 text-gray-800 text-base"
              >
                Volver
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-3 rounded bg-blue-600 text-white text-base disabled:opacity-50"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}
