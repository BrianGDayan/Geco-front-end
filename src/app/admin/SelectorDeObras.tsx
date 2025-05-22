"use client";

import { useEffect, useState } from "react";
import { Listbox } from "@headlessui/react";
import clsx from "clsx";

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
    fetch("/api/obras")
      .then((res) => res.json())
      .then((data) => setObras(data));
  }, []);

  useEffect(() => {
    if (obraSeleccionada) {
      const obraParam = obraSeleccionada === "Todas" ? "todas" : obraSeleccionada;
      fetch(`/api/rendimientos?obra=${encodeURIComponent(obraParam)}`)
        .then((res) => res.json())
        .then((data) => setRendimientos(data));
    } else {
      setRendimientos(null);
    }
  }, [obraSeleccionada]);

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
                  <div
                    className={clsx(
                      "px-4 py-2 cursor-pointer",
                      active && "bg-gray-200"
                    )}
                  >
                    Todas
                  </div>
                )}
              </Listbox.Option>
              {obras.map((obra) => (
                <Listbox.Option key={obra} value={obra}>
                  {({ active }) => (
                    <div
                      className={clsx(
                        "px-4 py-2 cursor-pointer",
                        active && "bg-gray-200"
                      )}
                    >
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
            <div className="bg-primary-light text-white p-4 rounded-lg shadow-md space-y-4 w-full">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-white">
                    {rendimientos.rendimiento_global_corte_trabajador?.toFixed(3) ?? "-"}
                  </span>
                  <span className="text-sm">Corte (trabajador)</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-white">
                    {rendimientos.rendimiento_global_doblado_trabajador?.toFixed(3) ?? "-"}
                  </span>
                  <span className="text-sm">Doblado (trabajador)</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-white">
                    {rendimientos.rendimiento_global_empaquetado_trabajador?.toFixed(3) ?? "-"}
                  </span>
                  <span className="text-sm">Empaquetado (trabajador)</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-white">
                    {rendimientos.rendimiento_global_corte_ayudante?.toFixed(3) ?? "-"}
                  </span>
                  <span className="text-sm">Corte (ayudante)</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-white">
                    {rendimientos.rendimiento_global_doblado_ayudante?.toFixed(3) ?? "-"}
                  </span>
                  <span className="text-sm">Doblado (ayudante)</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-white">
                    {rendimientos.rendimiento_global_empaquetado_ayudante?.toFixed(3) ?? "-"}
                  </span>
                  <span className="text-sm">Empaquetado (ayudante)</span>
                </div>
              </div>
              <div className="border-t border-white/50 pt-4">
                <h3 className="text-sm font-semibold mb-1">Suma de rendimientos</h3>
                <p className="text-lg font-bold">
                  {(
                    (rendimientos.rendimiento_global_corte_trabajador ?? 0) +
                    (rendimientos.rendimiento_global_doblado_trabajador ?? 0) +
                    (rendimientos.rendimiento_global_empaquetado_trabajador ?? 0) +
                    (rendimientos.rendimiento_global_corte_ayudante ?? 0) +
                    (rendimientos.rendimiento_global_doblado_ayudante ?? 0) +
                    (rendimientos.rendimiento_global_empaquetado_ayudante ?? 0)
                  ).toFixed(3)}
                </p>
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

