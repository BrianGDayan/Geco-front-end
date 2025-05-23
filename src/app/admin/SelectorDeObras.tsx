"use client";

import { useEffect, useState } from "react";
import { Listbox } from "@headlessui/react";
import clsx from "clsx";
import { getObras } from "@/lib/planillas"; 
import { getRendimientosPorObra } from "@/lib/planillas";

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
    getObras()
      .then((data) => setObras(data))
      .catch((err) => console.error("Error al cargar obras:", err));
  }, []);

  useEffect(() => {
    if (obraSeleccionada) {
      const obraParam = obraSeleccionada === "Todas" ? "todas" : obraSeleccionada;
      getRendimientosPorObra(obraParam)
        .then((data) => setRendimientos(data))
        .catch((err) => console.error("Error al cargar rendimientos:", err));
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
            <div className="bg-primary-light text-white p-4 rounded-lg shadow-md space-y-4 w-full">
              <div className="space-y-2">
                <RendimientoItem
                  label="Corte (trabajador)"
                  valor={rendimientos.rendimiento_global_corte_trabajador}
                />
                <RendimientoItem
                  label="Doblado (trabajador)"
                  valor={rendimientos.rendimiento_global_doblado_trabajador}
                />
                <RendimientoItem
                  label="Empaquetado (trabajador)"
                  valor={rendimientos.rendimiento_global_empaquetado_trabajador}
                />
              </div>
              <div className="space-y-2">
                <RendimientoItem
                  label="Corte (ayudante)"
                  valor={rendimientos.rendimiento_global_corte_ayudante}
                />
                <RendimientoItem
                  label="Doblado (ayudante)"
                  valor={rendimientos.rendimiento_global_doblado_ayudante}
                />
                <RendimientoItem
                  label="Empaquetado (ayudante)"
                  valor={rendimientos.rendimiento_global_empaquetado_ayudante}
                />
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

function RendimientoItem({ label, valor }: { label: string; valor: number | null }) {
  return (
    <div className="flex justify-between">
      <span className="font-semibold text-white">{valor?.toFixed(3) ?? "-"}</span>
      <span className="text-sm">{label}</span>
    </div>
  );
}


