'use client';

import useSWR from 'swr';
import { ElementoDto, DetalleDto, getDiametros } from "@/lib/planillas";
import { useEffect, useState } from "react";
import { PlusCircle, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { uploadEspecificacion } from "@/lib/planillas";
import { CldImage } from "next-cloudinary";

interface PasoElementosProps {
  item: string;
  elementos: ElementoDto[];
  setElementos: (e: ElementoDto[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const DEFAULT_DETALLE: DetalleDto = {
  especificacion: '',
  posicion: '',
  tipo: undefined,
  medidaDiametro: undefined,
  longitudCorte: undefined,
  cantidadUnitaria: undefined,
  nroElementos: undefined,
  nroIguales: undefined,
};

export default function PasoElementos({
  item,
  elementos,
  setElementos,
  onNext,
  onBack,
}: PasoElementosProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [errores, setErrores] = useState<Record<string, boolean>>({});
  const { data: diametros, error: diamError } = useSWR('/planillas/diametros', getDiametros);


  useEffect(() => {
    if (elementos.length === 0) {
      setElementos([{ nombre: "", detalle: [{ ...DEFAULT_DETALLE }] }]);
      setExpanded({ 0: true });
    }
  }, []);

  const esCampoInvalido = (clave: string) => !!errores[clave];

  const agregarElemento = () => {
    setElementos([
      ...elementos,
      { nombre: "", detalle: [{ ...DEFAULT_DETALLE }] },
    ]);
    setExpanded((prev) => ({ ...prev, [elementos.length]: true }));
  };

  const eliminarElemento = (i: number) => {
    const arr = [...elementos];
    arr.splice(i, 1);
    setElementos(arr);
  };

  const toggleExpand = (key: number) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const agregarDetalle = (i: number) => {
    const arr = [...elementos];
    arr[i].detalle.push({ ...DEFAULT_DETALLE });
    setElementos(arr);
  };

  const eliminarDetalle = (i: number, j: number) => {
    const arr = [...elementos];
    arr[i].detalle.splice(j, 1);
    setElementos(arr);
  };

  const validarCampos = () => {
    const nuevos: Record<string, boolean> = {};
    elementos.forEach((el, i) => {
      if (!el.nombre.trim()) nuevos[`el-${i}-nombre`] = true;
    });
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  };

const handleFileChange = async (
  file: File,
  i: number,
  j: number
) => {
  try {
    const oldId = elementos[i].detalle[j].especificacion || undefined;
    const { publicId } = await uploadEspecificacion(file, oldId);

    const updated = elementos.map((el, ei) =>
      ei !== i
        ? el
        : {
            ...el,
            detalle: el.detalle.map((det, dj) =>
              dj === j ? { ...det, especificacion: publicId } : det
            ),
          }
    );
    setElementos(updated);
  } catch (e) {
    window.alert("Error al subir la imagen. Por favor intenta de nuevo.");
  }
};

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">
        Ingrese los elementos de la planilla
      </h2>
      <input
        type="text"
        placeholder={item}
        disabled
        className="w-full border border-gray-border bg-gray-bg rounded-md px-2 py-1"
      />

      <div className="space-y-4">
        {elementos.map((el, i) => (
          <div
            key={i}
            className="border rounded-lg bg-white shadow p-4 space-y-3"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={`Elemento ${i + 1}`}
                value={el.nombre}
                onChange={(e) => {
                  const arr = [...elementos];
                  arr[i].nombre = e.target.value;
                  setElementos(arr);
                }}
                className={`flex-grow border rounded px-2 py-1 ${
                  esCampoInvalido(`el-${i}-nombre`)
                    ? "border-red-500"
                    : "border-gray-border"
                }`}
              />
              {i === 0 ? (
                <PlusCircle
                  size={20}
                  className="text-green-600 cursor-pointer"
                  onClick={agregarElemento}
                />
              ) : (
                <Trash2
                  size={20}
                  className="text-red-600 cursor-pointer"
                  onClick={() => eliminarElemento(i)}
                />
              )}
            </div>

            {el.detalle.map((det, j) => {
              const key = i * 100 + j;
              const isOpen = expanded[key] || false;
              return (
                <div key={key} className="border-t pt-3 space-y-3">
                  <div className="flex items-center gap-4">
                    <p title={det.especificacion || `Detalle ${j + 1}`} className="flex-1 border rounded px-2 py-1 bg-gray-100 text-gray-700 truncate overflow-hidden whitespace-nowrap">
                     {det.especificacion ? det.especificacion : `Detalle ${j + 1}`}
                    </p>
                    <label className="cursor-pointer text-blue-600 hover:underline">
                      📁
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileChange(file, i, j);
                        }}
                      />
                    </label>
                  {det.especificacion && (
                    <CldImage
                      src={det.especificacion}
                      width={80}
                      height={80}
                      alt="Miniatura detalle"
                      crop="scale"
                      className="h-20 w-20 object-contain rounded"
                    />
                  )}
                    <button onClick={() => toggleExpand(key)}>
                      {isOpen ? <ChevronUp /> : <ChevronDown />}
                    </button>
                    {j === 0 ? (
                      <PlusCircle
                        size={18}
                        className="text-green-600 cursor-pointer"
                        onClick={() => agregarDetalle(i)}
                      />
                    ) : (
                      <Trash2
                        size={18}
                        className="text-red-600 cursor-pointer"
                        onClick={() => eliminarDetalle(i, j)}
                      />
                    )}
                  </div>

                  <div
                    className="transition-all overflow-hidden"
                    style={{ maxHeight: isOpen ? "500px" : "0px", opacity: isOpen ? 1 : 0 }}
                  >
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <input
                        type="text"
                        placeholder="Posición"
                        value={det.posicion ?? ''}
                        onChange={(e) => {
                          const arr = [...elementos];
                          arr[i].detalle[j].posicion = e.target.value;
                          setElementos(arr);
                        }}
                        className="border rounded px-2 py-1 placeholder-gray-text"
                      />
                      <input
                        type="number"
                        placeholder="Tipo"
                        value={det.tipo ?? ''}
                        onChange={(e) => {
                          const arr = [...elementos];
                          arr[i].detalle[j].tipo = +e.target.value;
                          setElementos(arr);
                        }}
                        className="border rounded px-2 py-1 placeholder-gray-text"
                      />
                      {!diamError && diametros ? (
                        <select
                          value={det.medidaDiametro ?? ''}
                          onChange={(e) => {
                            const raw = e.target.value;
                            const val = raw === '' ? undefined : parseInt(raw, 10);
                            const arr = [...elementos];
                            arr[i].detalle[j].medidaDiametro = val!;
                            setElementos(arr);
                          }}
                          className="border rounded px-2 py-1 text-gray-text placeholder-gray-text"
                        >
                          <option value="" disabled>
                            Ø (mm)
                          </option>
                          {diametros.map((d) => (
                            <option key={d.medida_diametro} value={d.medida_diametro}>
                              {d.medida_diametro}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          placeholder="Ø (mm)"
                          value={det.medidaDiametro ?? ''}
                          disabled
                          className="border rounded px-2 py-1"
                        />
                      )}
                      <input
                        type="number"
                        placeholder="Long. Corte (m)"
                        value={det.longitudCorte ?? ''}
                        onChange={(e) => {
                          const arr = [...elementos];
                          arr[i].detalle[j].longitudCorte = +e.target.value;
                          setElementos(arr);
                        }}
                        className="border rounded px-2 py-1 placeholder-gray-text"
                      />
                      <input
                        type="number"
                        placeholder="Cant. Unitaria"
                        value={det.cantidadUnitaria ?? ''}
                        onChange={(e) => {
                          const arr = [...elementos];
                          arr[i].detalle[j].cantidadUnitaria = +e.target.value;
                          setElementos(arr);
                        }}
                        className="border rounded px-2 py-1 placeholder-gray-text"
                      />
                      <input
                        type="number"
                        placeholder="N° Elementos"
                        value={det.nroElementos ?? ''}
                        onChange={(e) => {
                          const arr = [...elementos];
                          arr[i].detalle[j].nroElementos = +e.target.value;
                          setElementos(arr);
                        }}
                        className="border rounded px-2 py-1 placeholder-gray-text"
                      />
                      <input
                        type="number"
                        placeholder="N° Iguales"
                        value={det.nroIguales ?? ''}
                        onChange={(e) => {
                          const arr = [...elementos];
                          arr[i].detalle[j].nroIguales = +e.target.value;
                          setElementos(arr);
                        }}
                        className="border rounded px-2 py-1 placeholder-gray-text"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Volver atrás
        </button>
        <button
          onClick={() => { if (validarCampos()) onNext(); }}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
        >
          Registrar planilla
        </button>
      </div>
    </div>
  );
}
