'use client';

import React, { useEffect, useState, Fragment } from 'react';
import useSWR from 'swr';
import { Dialog, Combobox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';
import { getTrabajadoresActivos, TrabajadorActivo } from '@/lib/trabajadores';
import { CreateRegistro } from '@/lib/registros';
import { useTimers, secToTimeHHMM } from '@/hooks/useTimers';

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

  const [nombre1, setNombre1] = useState<string>('');
  const [nombre2, setNombre2] = useState<string>('');
  const [query1, setQuery1] = useState<string>('');
  const [query2, setQuery2] = useState<string>('');
  const [cantidad, setCantidad] = useState<number>(1);
  const [ini1, setIni1] = useState<string>('');
  const [fin1, setFin1] = useState<string>('');
  const [ini2, setIni2] = useState<string>('');
  const [fin2, setFin2] = useState<string>('');
  const [showAyudante, setShowAyudante] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorCantidad, setErrorCantidad] = useState('');
  const [errorHoras1, setErrorHoras1] = useState('');
  const [errorHoras2, setErrorHoras2] = useState('');
  const { data: trabajadores = [] } = useSWR<TrabajadorActivo[]>('/trabajadores/activos', getTrabajadoresActivos);

  const [label1, label2] = labels[idTarea] || ['Oficial', 'Ayudante'];

  const { getTimer, startTimer, stopTimer, clearTimer } = useTimers();
  const timer = getTimer(idDetalleTarea);

  useEffect(() => {
    // Si el temporizador tiene meta con nombre guardado, prellenar.
    if (timer?.meta?.nombre1) setNombre1(timer.meta.nombre1);
    if (timer?.meta?.nombre2) { setNombre2(timer.meta.nombre2); setShowAyudante(true); }
    if (timer?.meta?.cantidad) setCantidad(timer.meta.cantidad);
    // Si está detenido y tiene elapsed, rellenar ini/fin usando startedAt/stoppedAt
    if (timer && !timer.running && timer.startedAt && timer.stoppedAt) {
      const s = new Date(timer.startedAt);
      const e = new Date(timer.stoppedAt);
      setIni1(`${String(s.getHours()).padStart(2,'0')}:${String(s.getMinutes()).padStart(2,'0')}`);
      setFin1(`${String(e.getHours()).padStart(2,'0')}:${String(e.getMinutes()).padStart(2,'0')}`);
    }
    // If running, show live elapsed in UI only.
  }, [idDetalleTarea, timer]);

  const filtrar = (query: string, arr: TrabajadorActivo[]) =>
    query.trim() === '' ? arr : arr.filter(t => t.nombre.toLowerCase().includes(query.toLowerCase()));

  const filtered1 = filtrar(query1, trabajadores);
  const filtered2 = filtrar(query2, trabajadores);

  const diffHoras = (start: string, end: string) => {
    if (!start || !end) return 0;
    const [h1, m1] = start.split(':').map(Number);
    const [h2, m2] = end.split(':').map(Number);
    const minutos = h2 * 60 + m2 - (h1 * 60 + m1);
    return minutos > 0 ? +(minutos / 60).toFixed(2) : 0;
  };

  const horaActual = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const handleSelectNombre1 = (value: string | null) => setNombre1(value ?? '');
  const handleSelectNombre2 = (value: string | null) => setNombre2(value ?? '');

  // controlar inicio/parada desde modal
  const handleStart = () => {
    startTimer({
      idDetalleTarea,
      idDetalle,
      idTarea,
      meta: { nombre1, nombre2: nombre2 || undefined, cantidad },
    });
  };
  const handleStop = () => {
    stopTimer(idDetalleTarea);
  };
  const handleClear = () => {
    clearTimer(idDetalleTarea);
    // limpieza local
    setIni1(''); setFin1(''); setNombre1(''); setNombre2('');
    setShowAyudante(false);
  };

  // Si el timer está corriendo, calcular horas desde startedAt
  const runningElapsedSec = timer?.running ? timer.elapsedSec ?? 0 : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorCantidad(''); setErrorHoras1(''); setErrorHoras2('');

    // si existe timer detenido usar sus timestamps para calcular horas
    if (cantidad <= 0 || cantidad > cantidadTotal) {
      setErrorCantidad(`Debe ser mayor a 0 y ≤ ${cantidadTotal}`);
      return;
    }
    if (!nombre1) {
      setErrorHoras1('Seleccioná el operario principal.');
      return;
    }

    // preferir timestamps de temporizador cuando existan
    let horasTrab = 0;
    let horasAyu = 0;

    if (timer && !timer.running && timer.startedAt && timer.stoppedAt) {
      const s = new Date(timer.startedAt);
      const e = new Date(timer.stoppedAt);
      horasTrab = +( (e.getTime() - s.getTime()) / 3600000 ).toFixed(2);
      // prefill ini/fin inputs for display/storage
      setIni1(`${String(s.getHours()).padStart(2,'0')}:${String(s.getMinutes()).padStart(2,'0')}`);
      setFin1(`${String(e.getHours()).padStart(2,'0')}:${String(e.getMinutes()).padStart(2,'0')}`);
    } else {
      horasTrab = diffHoras(ini1, fin1);
    }

    if (horasTrab <= 0) {
      setErrorHoras1('Horas del principal no válidas.');
      return;
    }

    if (showAyudante && nombre2) {
      if (ini2 && fin2) {
        horasAyu = diffHoras(ini2, fin2);
        if (horasAyu <= 0) {
          setErrorHoras2('Horas del ayudante no válidas.');
          return;
        }
      } else {
        // intentar usar meta del timer si existe (no implementamos tiempos separados para ayudante en timer)
        horasAyu = 0;
      }
    }

    setIsSubmitting(true);

    const payload: any = {
      idDetalle,
      idTarea,
      cantidad,
      horasTrabajador: horasTrab,
      nombreTrabajador: nombre1,
    };
    if (showAyudante && nombre2) {
      payload.nombreAyudante = nombre2;
      payload.horasAyudante = horasAyu;
    }

    try {
      await CreateRegistro(payload);
      // si guardó, limpiar timer asociado
      clearTimer(idDetalleTarea);
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
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 shadow-lg max-h-[90vh] overflow-y-auto">
        <Dialog.Title className="text-lg font-semibold mb-3">Nuevo registro</Dialog.Title>

        <div className="flex justify-between mb-4 text-sm">
          <div className="w-full rounded-lg border px-3 py-3 text-base">Cantidad total: {cantidadTotal}</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Operario principal */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">{label1}</label>

            <Combobox value={nombre1} onChange={handleSelectNombre1}>
              {({ open }) => (
                <div className="relative">
                  <div className="flex items-center">
                    <Combobox.Input
                      className="w-full rounded-lg border px-3 py-3 text-base"
                      placeholder={`Seleccionar ${label1}`}
                      displayValue={(v: string | null) => v ?? ''}
                      onChange={e => setQuery1(e.target.value)}
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
                      {filtered1.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-gray-500">No hay resultados</div>
                      ) : (
                        filtered1.map(t => (
                          <Combobox.Option
                            key={t.id_trabajador}
                            value={t.nombre}
                            className={({ active }) => `cursor-pointer px-3 py-2 ${active ? 'bg-gray-100' : ''}`}
                          >
                            {({ selected }) => (
                              <div className="flex items-center justify-between">
                                <span className={`${selected ? 'font-semibold' : ''}`}>{t.nombre}</span>
                                {selected && <CheckIcon className="h-4 w-4 text-green-600" />}
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
          </div>

          {/* Ayudante */}
          <div>
            <label className="flex items-center gap-2 select-none">
              <input type="checkbox" checked={showAyudante} onChange={e => setShowAyudante(e.target.checked)} />
              Agregar {label2}
            </label>

            {showAyudante && (
              <div className="mt-2">
                <label className="block text-sm font-medium mb-1">{label2}</label>

                <Combobox value={nombre2} onChange={handleSelectNombre2}>
                  {({ open }) => (
                    <div className="relative">
                      <div className="flex items-center">
                        <Combobox.Input
                          className="w-full rounded-lg border px-3 py-3 text-base"
                          placeholder={`Seleccionar ${label2}`}
                          displayValue={(v: string | null) => v ?? ''}
                          onChange={e => setQuery2(e.target.value)}
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
                          {filtered2.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-gray-500">No hay resultados</div>
                          ) : (
                            filtered2.map(t => (
                              <Combobox.Option
                                key={t.id_trabajador}
                                value={t.nombre}
                                className={({ active }) => `cursor-pointer px-3 py-2 ${active ? 'bg-gray-100' : ''}`}
                              >
                                {({ selected }) => (
                                  <div className="flex items-center justify-between">
                                    <span className={`${selected ? 'font-semibold' : ''}`}>{t.nombre}</span>
                                    {selected && <CheckIcon className="h-4 w-4 text-green-600" />}
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
              </div>
            )}
          </div>

          {/* Cantidad */}
          <div>
            <label className="block font-medium mb-1">Cantidad</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCantidad(c => Math.max(1, c - 1))}
                className="px-3 py-2 bg-gray-200 rounded text-xl"
                aria-label="Disminuir cantidad"
              >
                −
              </button>
              <input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                value={cantidad}
                onChange={e => setCantidad(Number(e.target.value))}
                className="w-20 text-center rounded border py-2 text-lg"
                min={1}
                max={cantidadTotal}
                required
              />
              <button
                type="button"
                onClick={() => setCantidad(c => Math.min(cantidadTotal, c + 1))}
                className="px-3 py-2 bg-gray-200 rounded text-xl"
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
            {errorCantidad && <p className="text-red-600 text-sm mt-1">{errorCantidad}</p>}
          </div>

          {/* Horas y temporizador */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium mb-1">Inicio – {label1}</label>
                <input type="time" value={ini1} onChange={e => setIni1(e.target.value)} className="rounded border px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Fin – {label1}</label>
                <input type="time" value={fin1} onChange={e => setFin1(e.target.value)} className="rounded border px-3 py-2" />
              </div>

              <div className="flex flex-col items-end">
                {/* Botones temporizador local */}
                <div className="mb-1">
                  {timer?.running ? (
                    <button type="button" onClick={handleStop} className="px-3 py-2 bg-red-600 text-white rounded">Detener</button>
                  ) : (
                    <button type="button" onClick={handleStart} className="px-3 py-2 bg-green-600 text-white rounded">Iniciar</button>
                  )}
                </div>

                <div className="text-xs text-gray-600">
                  {timer?.running ? `En curso • ${secToTimeHHMM(timer.elapsedSec ?? 0)}` : timer && !timer.running && timer.elapsedSec ? `Última: ${secToTimeHHMM(timer.elapsedSec)}` : '—'}
                </div>

                {timer && !timer.running && (
                  <button type="button" onClick={handleClear} className="mt-2 text-xs text-red-600 underline">Limpiar temporizador</button>
                )}
              </div>
            </div>

            {errorHoras1 && <p className="text-red-600 text-sm mt-1">{errorHoras1}</p>}
          </div>

          {/* Ayudante horas */}
          {showAyudante && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Inicio – {label2}</label>
                <input type="time" value={ini2} onChange={e => setIni2(e.target.value)} className="rounded border px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fin – {label2}</label>
                <input type="time" value={fin2} onChange={e => setFin2(e.target.value)} className="rounded border px-3 py-2" />
              </div>
              {errorHoras2 && <p className="text-red-600 text-sm mt-1">{errorHoras2}</p>}
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end gap-4 mt-4">
            <button type="button" onClick={onClose} className="px-5 py-3 rounded bg-gray-300 text-gray-800 text-base">Volver</button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-3 rounded bg-blue-600 text-white text-base disabled:opacity-50">
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
