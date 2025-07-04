"use client";

import { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import clsx from "clsx";
import { getRendimientosPorTarea } from "@/lib/trabajadores"; 

interface TrabajadorPerformance {
  id: number;
  nombre: string;
  rendimiento: number;
}

const tareas = [
  { id: 1, label: "Corte" },
  { id: 2, label: "Doblado" },
  { id: 3, label: "Empaquetado" },
];

export default function SelectorDeTareas() {
  const [tareaSeleccionada, setTareaSeleccionada] = useState<number | null>(null);
  const [rendimientos, setRendimientos] = useState<TrabajadorPerformance[]>([]);

  useEffect(() => {
    if (tareaSeleccionada !== null) {
      getRendimientosPorTarea(tareaSeleccionada)
        .then((data) => setRendimientos(data))
        .catch((err) => console.error("Error cargando rendimientos:", err));
    } else {
      setRendimientos([]);
    }
  }, [tareaSeleccionada]);

  return (
    <div className="flex flex-col gap-4">
      {/* Selector de tarea */}
      <Listbox
        value={tareaSeleccionada}
        onChange={setTareaSeleccionada as any}
      >
        <div className="relative w-60">
          <Listbox.Button className="w-full border px-4 py-2 rounded bg-white text-left">
            {tareaSeleccionada
              ? tareas.find((t) => t.id === tareaSeleccionada)?.label
              : "Seleccionar tarea"}
          </Listbox.Button>
          <Listbox.Options className="absolute mt-1 w-full bg-white border rounded shadow z-10">
            {tareas.map((tarea) => (
              <Listbox.Option key={tarea.id} value={tarea.id}>
                {({ active }) => (
                  <div
                    className={clsx(
                      "px-4 py-2 cursor-pointer",
                      active && "bg-gray-200"
                    )}
                  >
                    {tarea.label}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>

      {/* Tabla de resultados */}
      <table className="table-auto border w-96 bg-white">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">Nro</th>
            <th className="border px-4 py-2">Trabajador</th>
            <th className="border px-4 py-2">Rendimiento</th>
          </tr>
        </thead>
        <tbody>
          {tareaSeleccionada === null
            ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="border px-4 py-2 text-center">{i + 1}</td>
                  <td className="border px-4 py-2"></td>
                  <td className="border px-4 py-2"></td>
                </tr>
              ))
            : rendimientos.map((t, index) => (
                <tr key={t.id}>
                  <td className="border px-4 py-2 text-center">{index + 1}</td>
                  <td className="border px-4 py-2">{t.nombre}</td>
                  <td className="border px-4 py-2">{t.rendimiento.toFixed(3)}</td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
