// app/page.tsx o cualquier componente
"use client";

import { Listbox } from "@headlessui/react";
import { useState } from "react";
import clsx from "clsx";

export default function RendimientosScreen() {
  const [obraSeleccionada, setObraSeleccionada] = useState<string | null>(null);
  const [tareaSeleccionada, setTareaSeleccionada] = useState<string | null>(null);
  const obras = ["Obra 1", "Obra 2"];
  const tareas = ["Doblado", "Corte", "Empaquetado"];

  const rendimientos = {
    doblado: 0.047,
    corte: 0.028,
    empaquetado: 0.012,
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-8">
        CORTE Y DOBLADO DE ARMADURA
      </h1>

      <div className="flex justify-center gap-32">
        {/* RENDIMIENTO POR OBRA */}
        <div className="flex flex-col gap-4">
          <Listbox value={obraSeleccionada} onChange={setObraSeleccionada}>
            <div className="relative w-60">
              <Listbox.Button className="w-full border px-4 py-2 rounded bg-white">
                {obraSeleccionada || "Seleccionar obra"}
              </Listbox.Button>
              <Listbox.Options className="absolute mt-1 w-full bg-white border rounded shadow z-10">
                {obras.map((obra) => (
                  <Listbox.Option key={obra} value={obra}>
                    {({ active }) => (
                      <div className={clsx("px-4 py-2", active && "bg-gray-200")}>
                        {obra}
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>

          <div className="bg-green-400 p-4 rounded space-y-2 text-white font-bold">
            <div className="flex justify-between">
              <span className="text-red-100">{rendimientos.doblado.toFixed(3)}</span>
              <span>DOBLADO</span>
            </div>
            <div className="flex justify-between">
              <span className="text-yellow-100">{rendimientos.corte.toFixed(3)}</span>
              <span>CORTE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-100">{rendimientos.empaquetado.toFixed(3)}</span>
              <span>EMPAQUETADO</span>
            </div>
          </div>

          <div className="bg-blue-500 p-4 rounded text-white font-bold">
            <div>SUMA DE RENDIMIENTOS</div>
            <div className="text-green-200 text-xl mt-2">
              {(rendimientos.doblado + rendimientos.corte + rendimientos.empaquetado).toFixed(3)}
            </div>
          </div>
        </div>

        {/* RENDIMIENTO POR TAREA */}
        <div className="flex flex-col gap-4">
          <Listbox value={tareaSeleccionada} onChange={setTareaSeleccionada}>
            <div className="relative w-60">
              <Listbox.Button className="w-full border px-4 py-2 rounded bg-white">
                {tareaSeleccionada || "Seleccionar tarea"}
              </Listbox.Button>
              <Listbox.Options className="absolute mt-1 w-full bg-white border rounded shadow z-10">
                {tareas.map((tarea) => (
                  <Listbox.Option key={tarea} value={tarea}>
                    {({ active }) => (
                      <div className={clsx("px-4 py-2", active && "bg-gray-200")}>
                        {tarea}
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>

          <table className="table-auto border w-96 bg-white">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">Nro</th>
                <th className="border px-4 py-2">Trabajador</th>
                <th className="border px-4 py-2">Rendimiento</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="border px-4 py-2 text-center">{i + 1}</td>
                  <td className="border px-4 py-2"></td>
                  <td className="border px-4 py-2"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
