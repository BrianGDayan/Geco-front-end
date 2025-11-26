'use client';

import React, { useMemo } from 'react';
import { PlanillaResponse } from '../lib/planillas';

interface Props {
  planilla: PlanillaResponse;
}

export default function AdminFooter({ planilla }: Props) {
  const total = planilla.peso_total.toFixed(3);
  const lista = Array.isArray(planilla.pesos_diametro) ? planilla.pesos_diametro : [];

  const agrupadoPorTipo = useMemo(() => {
    const mapa = new Map<
      number,
      {
        corte: number[];
        doblado: number[];
        dobladoA1: number[];
        dobladoA2: number[];
        empaque: number[];
        empaqueA1: number[];
      }
    >();

    for (const elem of planilla.elemento) {
      for (const det of elem.detalle) {
        const tipo = det.tipo;
        if (!mapa.has(tipo)) {
          mapa.set(tipo, {
            corte: [],
            doblado: [],
            dobladoA1: [],
            dobladoA2: [],
            empaque: [],
            empaqueA1: []
          });
        }

        const bloque = mapa.get(tipo)!;

        for (const dt of det.detalle_tarea) {
          const tarea = dt.tarea.nombre_tarea;

          for (const reg of dt.registro) {
            const ops = reg.operadores || [];

            const op1 = ops[0]?.rendimiento ?? 0;
            const op2 = ops[1]?.rendimiento ?? 0;
            const op3 = ops[2]?.rendimiento ?? 0;

            if (tarea === "Corte") {
              bloque.corte.push(op1);
              bloque.corte.push(op2);
            }

            if (tarea === "Doblado") {
              bloque.doblado.push(op1);
              bloque.dobladoA1.push(op2);
              bloque.dobladoA2.push(op3);
            }

            if (tarea === "Empaquetado") {
              bloque.empaque.push(op1);
              bloque.empaqueA1.push(op2);
            }
          }
        }
      }
    }

    return Array.from(mapa.entries()).map(([tipo, b]) => {
      const avg = (arr: number[]) =>
        arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0;

      return {
        tipo,
        corte1: avg(b.corte.slice(0, b.corte.length / 2)),
        corte2: avg(b.corte.slice(b.corte.length / 2)),
        dobl1: avg(b.doblado),
        dobl2: avg(b.dobladoA1),
        dobl3: avg(b.dobladoA2),
        emp1: avg(b.empaque),
        emp2: avg(b.empaqueA1),
        noDoblado: tipo === 1,
        noEmpaque: tipo === 4
      };
    });
  }, [planilla]);

  return (
    <section className="space-y-8 max-w-7xl mx-auto px-4">

      {/* —— PESO —— */}
      <div className="bg-gray-bg rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-primary-dark mb-4 text-center">Peso Total (Tn)</h2>

        <div className="flex flex-col items-center mb-6">
          <span className="text-4xl font-extrabold text-primary-mid mb-4">{total}</span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
            {lista.map(({ diametro, peso }, i) => (
              <div key={i} className="bg-white rounded-lg p-3 flex flex-col items-center">
                <span className="text-sm font-medium text-gray-text mb-1">Ø {diametro}</span>
                <span className="text-lg font-semibold text-gray-text">{peso.toFixed(3)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* —— RENDIMIENTOS POR TIPO —— */}
      <div>
        <h2 className="text-xl font-bold text-primary-dark mb-4 text-center">Medidas de Rendimiento</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {agrupadoPorTipo.map((t) => (
            <div key={t.tipo} className="bg-white rounded-2xl shadow p-5">
              <h3 className="text-lg font-semibold text-secondary-dark mb-3 text-center">
                Tipo {t.tipo}
              </h3>

              <ul className="space-y-2 text-gray-text">

                {/* Corte */}
                <li className="flex justify-between">
                  <span>Corte:</span>
                  <span>
                    {t.corte1.toFixed(3)} / {t.corte2.toFixed(3)}
                  </span>
                </li>

                {/* Doblado */}
                <li className="flex justify-between">
                  <span>Doblado:</span>
                  {t.noDoblado ? (
                    <span>No corresponde</span>
                  ) : (
                    <span>
                      {t.dobl1.toFixed(3)} / {t.dobl2.toFixed(3)} / {t.dobl3.toFixed(3)}
                    </span>
                  )}
                </li>

                {/* Empaque */}
                <li className="flex justify-between">
                  <span>Empaquetado:</span>
                  {t.noEmpaque ? (
                    <span>No corresponde</span>
                  ) : (
                    <span>
                      {t.emp1.toFixed(3)} / {t.emp2.toFixed(3)}
                    </span>
                  )}
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* —— RENDIMIENTOS GLOBALES —— */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-primary-dark mb-4 text-center">
          Rendimientos Globales
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <h3 className="text-sm font-medium text-gray-text mb-1">Corte</h3>
            <p className="text-xl font-bold text-gray-text">
              {planilla.rendimiento_global_corte_trabajador.toFixed(3)} /
              {planilla.rendimiento_global_corte_ayudante.toFixed(3)}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-text mb-1">Doblado</h3>
            <p className="text-xl font-bold text-gray-text">
              {planilla.rendimiento_global_doblado_trabajador.toFixed(3)} /
              {planilla.rendimiento_global_doblado_ayudante.toFixed(3)} /
              {planilla.rendimiento_global_doblado_ayudante2.toFixed(3)}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-text mb-1">Empaquetado</h3>
            <p className="text-xl font-bold text-gray-text">
              {planilla.rendimiento_global_empaquetado_trabajador.toFixed(3)} /
              {planilla.rendimiento_global_empaquetado_ayudante.toFixed(3)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
