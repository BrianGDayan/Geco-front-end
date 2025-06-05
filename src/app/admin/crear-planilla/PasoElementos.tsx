'use client';

import { ElementoDto, DetalleDto } from "@/lib/planillas";
import { useEffect, useState } from "react";
import { PlusCircle, Trash2, ChevronDown, ChevronUp } from "lucide-react";

interface PasoElementosProps {
  item: string;
  elementos: ElementoDto[];
  setElementos: (e: ElementoDto[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PasoElementos({
  item,
  elementos,
  setElementos,
  onNext,
  onBack,
}: PasoElementosProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [errores, setErrores] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (elementos.length === 0) {
      setElementos([{ nombre: '', detalle: [{} as DetalleDto] }]);
      setExpanded({ 0: true });
    }
  }, []);


  const esCampoInvalido = (clave: string) => errores[clave];

  const agregarElemento = () => {
    setElementos([
      ...elementos,
      { nombre: '', detalle: [{} as any] },
    ]);
    setExpanded((prev) => ({ ...prev, [elementos.length]: true }));
  };

  const eliminarElemento = (i: number) => {
    const arr = [...elementos];
    arr.splice(i, 1);
    setElementos(arr);
    const exp = { ...expanded };
    delete exp[i];
    Object.keys(exp).forEach((k) => {
      const idx = Number(k);
      if (idx > i) {
        exp[idx - 1] = exp[idx];
        delete exp[idx];
      }
    });
    setExpanded(exp);
  };

  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const agregarDetalle = (i: number) => {
    const arr = [...elementos];
    arr[i].detalle.push({} as any);
    setElementos(arr);
  };

  const eliminarDetalle = (i: number, j: number) => {
    const arr = [...elementos];
    arr[i].detalle.splice(j, 1);
    setElementos(arr);
  };

  const validarCampos = () => {
    const nuevosErrores: Record<string, boolean> = {};
    elementos.forEach((el, i) => {
      if (!el.nombre.trim()) nuevosErrores[`el-${i}-nombre`] = true;
      el.detalle.forEach((det, j) => {
        [
          'especificacion',
          'posicion',
          'tipo',
          'medidaDiametro',
          'longitudCorte',
          'cantidadUnitaria',
          'nroElementos',
          'nroIguales'
        ].forEach((campo) => {
          if (det[campo as keyof DetalleDto] === undefined || det[campo as keyof DetalleDto] === null || det[campo as keyof DetalleDto] === '') {
            nuevosErrores[`det-${i}-${j}-${campo}`] = true;
          }
        });
      });
    });
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-semibold">Ingrese los elementos de la planilla</h2>
      <input
        type="text"
        placeholder={item}
        disabled
        className="w-full border border-gray-border bg-gray-bg rounded-md px-2 py-1"
      />

      <div className="space-y-4">
        {elementos.map((el, i) => (
          <div key={i} className="border rounded-lg bg-white shadow p-4 space-y-3 min-h-[160px]">
            {/* Header del elemento */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={`Elemento ${i + 1}`}
                className={`flex-grow border rounded px-2 py-1 ${esCampoInvalido(`el-${i}-nombre`) ? "border-red-500" : "border-gray-border"}`}
                value={el.nombre}
                onChange={(e) => {
                  const arr = [...elementos];
                  arr[i].nombre = e.target.value;
                  setElementos(arr);
                }}
                maxLength={50}
                required
              />
              {i === 0 ? (
                <button onClick={agregarElemento} className="text-green-600">
                  <PlusCircle size={20} />
                </button>
              ) : (
                <Trash2
                  size={20}
                  className="text-red-600 cursor-pointer"
                  onClick={() => eliminarElemento(i)}
                />
              )}
            </div>

            {/* Detalles */}
            {el.detalle.map((_, j) => {
              const isOpen = expanded[i * 100 + j];

              const clase = (campo: string) =>
                `border rounded p-1 w-full ${esCampoInvalido(`det-${i}-${j}-${campo}`) ? 'border-red-500' : 'border-gray-border'}`;

              return (
                <div key={j} className="space-y-2 border-t pt-2">
                  {/* Cabecera del detalle */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Detalle ${j + 1}`}
                      className={`flex-grow ${clase("especificacion")}`}
                      value={el.detalle[j]?.especificacion ?? ""}
                      onChange={(e) => {
                        const arr = [...elementos];
                        arr[i].detalle[j] = {
                          ...arr[i].detalle[j],
                          especificacion: e.target.value,
                        };
                        setElementos(arr);
                      }}
                      maxLength={50}
                      required
                    />
                    <button onClick={() => toggleExpand(i * 100 + j)} className="text-blue-600">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {j === 0 ? (
                      <button onClick={() => agregarDetalle(i)} className="text-green-600">
                        <PlusCircle size={18} />
                      </button>
                    ) : (
                      <Trash2
                        size={18}
                        className="text-red-600 cursor-pointer"
                        onClick={() => eliminarDetalle(i, j)}
                      />
                    )}
                  </div>

                  {/* Contenido expandible */}
                  <div
                    className={`transition-all duration-300 overflow-hidden`}
                    style={{ maxHeight: isOpen ? '500px' : '0px', opacity: isOpen ? 1 : 0 }}
                  >
                    <div className="space-y-2 mt-2">
                      <div className="flex gap-2">
                        <input type="number" className={clase("posicion") } placeholder="Posición" value={el.detalle[j]?.posicion ?? ''} onChange={e => { const arr = [...elementos]; arr[i].detalle[j] = { ...arr[i].detalle[j], posicion: +e.target.value }; setElementos(arr); }} required />
                        <input type="number" className={clase("tipo") } placeholder="Tipo" value={el.detalle[j]?.tipo ?? ''} onChange={e => { const arr = [...elementos]; arr[i].detalle[j] = { ...arr[i].detalle[j], tipo: +e.target.value }; setElementos(arr); }} required />
                        <input type="number" className={clase("medidaDiametro") } placeholder="Diámetro (mm)" value={el.detalle[j]?.medidaDiametro ?? ''} onChange={e => { const arr = [...elementos]; arr[i].detalle[j] = { ...arr[i].detalle[j], medidaDiametro: +e.target.value }; setElementos(arr); }} required />
                      </div>
                      <div className="flex gap-2">
                        <input type="number" className={clase("longitudCorte") } placeholder="Longitud de corte (m)" value={el.detalle[j]?.longitudCorte ?? ''} onChange={e => { const arr = [...elementos]; arr[i].detalle[j] = { ...arr[i].detalle[j], longitudCorte: +e.target.value }; setElementos(arr); }} required />
                        <input type="number" className={clase("cantidadUnitaria") } placeholder="Cantidad unitaria" value={el.detalle[j]?.cantidadUnitaria ?? ''} onChange={e => { const arr = [...elementos]; arr[i].detalle[j] = { ...arr[i].detalle[j], cantidadUnitaria: +e.target.value }; setElementos(arr); }} required />
                        <input type="number" className={clase("nroElementos") } placeholder="N° de elementos" value={el.detalle[j]?.nroElementos ?? ''} onChange={e => { const arr = [...elementos]; arr[i].detalle[j] = { ...arr[i].detalle[j], nroElementos: +e.target.value }; setElementos(arr); }} required />
                      </div>
                      <div>
                        <input type="number" className={clase("nroIguales") } placeholder="N° de iguales" value={el.detalle[j]?.nroIguales ?? ''} onChange={e => { const arr = [...elementos]; arr[i].detalle[j] = { ...arr[i].detalle[j], nroIguales: +e.target.value }; setElementos(arr); }} required />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Navegación */}
      <div className="flex justify-between">
        <button onClick={onBack} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
          Volver atrás
        </button>
        <button
          onClick={() => {
            if (validarCampos()) onNext();
          }}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
        >
          Registrar planilla
        </button>
      </div>
    </div>
  );
}
