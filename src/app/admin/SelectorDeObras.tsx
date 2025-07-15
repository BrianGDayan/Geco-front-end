'use client';

import { useEffect, useState } from "react";
import { Listbox } from "@headlessui/react";
import clsx from "clsx";
import { getObras, getRendimientosPorObra } from "@/lib/planillas";

interface Rendimientos {
  rendimiento_global_corte_trabajador: number | null;
  rendimiento_global_doblado_trabajador: number | null;
  rendimiento_global_empaquetado_trabajador: number | null;
  rendimiento_global_corte_ayudante: number | null;
  rendimiento_global_doblado_ayudante: number | null;
  rendimiento_global_empaquetado_ayudante: number | null;
}

export default function SelectorDeObras() {
  const [obras, setObras] = useState<string[]>([]);
  const [obraSeleccionada, setObraSeleccionada] = useState<string | null>(null);
  const [rendimientos, setRendimientos] = useState<Rendimientos | null>(null);

  useEffect(() => {
    getObras().then((data) => setObras(data));
  }, []);

  useEffect(() => {
    if (obraSeleccionada) {
      const obraParam = obraSeleccionada === "Todas" ? "todas" : obraSeleccionada;
      getRendimientosPorObra(obraParam).then((data) => setRendimientos(data));
    } else {
      setRendimientos(null);
    }
  }, [obraSeleccionada]);

  const sumaAyudantes =
    (rendimientos?.rendimiento_global_corte_trabajador ?? 0) +
    (rendimientos?.rendimiento_global_corte_ayudante ?? 0) +
    (rendimientos?.rendimiento_global_empaquetado_trabajador ?? 0) +
    (rendimientos?.rendimiento_global_empaquetado_ayudante ?? 0) +
    (rendimientos?.rendimiento_global_doblado_ayudante ?? 0);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Selector de obra */}
      <div className="w-full">
        <Listbox value={obraSeleccionada} onChange={setObraSeleccionada}>
          <div className="relative w-full">
            <Listbox.Button className="border px-4 py-2 rounded w-full text-left">
              {obraSeleccionada || "Seleccionar obra"}
            </Listbox.Button>
            <Listbox.Options className="absolute z-10 mt-1 border rounded shadow w-full bg-white">
              <Listbox.Option value="Todas">
                {({ active }) => (
                  <div className={clsx("px-4 py-2 cursor-pointer", active && "bg-gray-200")}>
                    Todas
                  </div>
                )}
              </Listbox.Option>
              {obras.map((obra) => (
                <Listbox.Option key={obra} value={obra}>
                  {({ active }) => (
                    <div className={clsx("px-4 py-2 cursor-pointer", active && "bg-gray-200")}>
                      {obra}
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>

      {/* Resultados de rendimiento */}
      <div className="w-full">
        {rendimientos ? (
          <div>
            <h2 className="text-lg font-medium mb-2">
              Rendimientos de {obraSeleccionada}
            </h2>
            <div className="bg-primary-light text-white p-6 rounded-2xl shadow-md space-y-6 w-full">
              <div className="space-y-3">
                <RendimientoItem
                  label="Corte (Cortador 1)"
                  valor={rendimientos.rendimiento_global_corte_trabajador}
                />
                <RendimientoItem
                  label="Doblado (Doblador)"
                  valor={rendimientos.rendimiento_global_doblado_trabajador}
                />
                <RendimientoItem
                  label="Empaquetado (Empaquetador 1)"
                  valor={rendimientos.rendimiento_global_empaquetado_trabajador}
                />
              </div>
              <div className="space-y-3">
                <RendimientoItem
                  label="Corte (Cortador 2)"
                  valor={rendimientos.rendimiento_global_corte_ayudante}
                />
                <RendimientoItem
                  label="Doblado (Ayudante)"
                  valor={rendimientos.rendimiento_global_doblado_ayudante}
                />
                <RendimientoItem
                  label="Empaquetado (Empaquetador 2)"
                  valor={rendimientos.rendimiento_global_empaquetado_ayudante}
                />
              </div>

              {/* Bloque Suma de Rendimientos */}
              <div className="border-t border-white/40 pt-5">
                <h3 className="text-base font-bold mb-3 tracking-wide uppercase">
                  Suma de rendimientos
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
                  {/* Doblador */}
                  <div>
                    <h4 className="text-sm font-medium text-white/90 mb-1">Doblador</h4>
                    <p className="text-xl font-extrabold text-white">
                      {(rendimientos.rendimiento_global_doblado_trabajador ?? 0).toFixed(3)}
                    </p>
                  </div>
                  {/* Ayudantes */}
                  <div>
                    <h4 className="text-sm font-medium text-white/90 mb-1">Ayudantes</h4>
                    <p className="text-xl font-extrabold text-white">
                      {sumaAyudantes.toFixed(3)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Seleccione una obra para ver rendimientos.</p>
        )}
      </div>
    </div>
  );
}

function RendimientoItem({ label, valor }: { label: string; valor: number | null }) {
  return (
    <div className="flex justify-between">
      <span className="font-semibold text-white text-lg">{valor?.toFixed(3) ?? "-"}</span>
      <span className="text-sm">{label}</span>
    </div>
  );
}
