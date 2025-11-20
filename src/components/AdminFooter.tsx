'use client';

import React, { useMemo } from 'react';
import { PlanillaResponse } from '../lib/planillas';

interface Props {
  planilla: PlanillaResponse;
}

type Stats = { sumTrab: number; sumAyu: number; sumAyu2: number; count: number };

export default function AdminFooter({ planilla }: Props) {
  const {
    peso_total,
    pesos_diametro,
    rendimiento_global_corte_trabajador,
    rendimiento_global_corte_ayudante,
    rendimiento_global_doblado_trabajador,
    rendimiento_global_doblado_ayudante,
    rendimiento_global_doblado_ayudante2,
    rendimiento_global_empaquetado_trabajador,
    rendimiento_global_empaquetado_ayudante,
  } = planilla;

  const total = typeof peso_total === 'number' ? peso_total.toFixed(3) : '—';
  const lista = Array.isArray(pesos_diametro) ? pesos_diametro : [];

  const agrupadoPorTipo = useMemo(() => {
    const mapa = new Map<
      string,
      {
        corte: Stats;
        doblado: Stats;
        empaquetado: Stats;
      }
    >();

    planilla.elemento.forEach(({ detalle }) =>
      detalle.forEach((det) => {
        const key = det.tipo.toString();

        if (!mapa.has(key)) {
          mapa.set(key, {
            corte: { sumTrab: 0, sumAyu: 0, sumAyu2: 0, count: 0 },
            doblado: { sumTrab: 0, sumAyu: 0, sumAyu2: 0, count: 0 },
            empaquetado: { sumTrab: 0, sumAyu: 0, sumAyu2: 0, count: 0 },
          });
        }

        const stats = mapa.get(key)!;

        det.detalle_tarea.forEach((dt) => {
          const tarea = dt.tarea.nombre_tarea;

          dt.registro.forEach(
            ({ rendimiento_trabajador: tr, rendimiento_ayudante: ay, rendimiento_ayudante2: ay2 }) => {
              if (tarea === 'Corte') {
                stats.corte.sumTrab += tr;
                stats.corte.sumAyu += ay ?? 0;
                stats.corte.sumAyu2 += 0;
                stats.corte.count++;
              } else if (tarea === 'Doblado') {
                stats.doblado.sumTrab += tr;
                stats.doblado.sumAyu += ay ?? 0;
                stats.doblado.sumAyu2 += ay2 ?? 0;
                stats.doblado.count++;
              } else if (tarea === 'Empaquetado') {
                stats.empaquetado.sumTrab += tr;
                stats.empaquetado.sumAyu += ay ?? 0;
                stats.empaquetado.sumAyu2 += 0;
                stats.empaquetado.count++;
              }
            }
          );
        });
      })
    );

    return Array.from(mapa.entries()).map(([tipo, s]) => {
      const t = Number(tipo);

      const corte1 = s.corte.count ? s.corte.sumTrab / s.corte.count : 0;
      const corte2 = s.corte.count ? s.corte.sumAyu / s.corte.count : 0;

      const dobl1 = s.doblado.count ? s.doblado.sumTrab / s.doblado.count : 0;
      const dobl2 = s.doblado.count ? s.doblado.sumAyu / s.doblado.count : 0;
      const dobl3 = s.doblado.count ? s.doblado.sumAyu2 / s.doblado.count : 0;

      const emp1 = s.empaquetado.count ? s.empaquetado.sumTrab / s.empaquetado.count : 0;
      const emp2 = s.empaquetado.count ? s.empaquetado.sumAyu / s.empaquetado.count : 0;

      return {
        tipo,
        corte1,
        corte2,
        dobl1,
        dobl2,
        dobl3,
        emp1,
        emp2,
        noDoblado: t === 1, // tipo 1 no tiene doblado
        noEmpaquetado: t === 4, // tipo 4 no tiene empaquetado
      };
    });
  }, [planilla]);

  const sumaAyudantes =
    rendimiento_global_corte_trabajador +
    rendimiento_global_corte_ayudante +
    rendimiento_global_empaquetado_trabajador +
    rendimiento_global_empaquetado_ayudante +
    rendimiento_global_doblado_ayudante +
    rendimiento_global_doblado_ayudante2;

  return (
    <section className="space-y-8 max-w-7xl mx-auto px-4">
      
      {/* Peso Total y por diámetro */}
      <div className="bg-gray-bg rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-primary-dark mb-4 text-center">Peso Total (Tn)</h2>
        <div className="flex flex-col items-center mb-6">
          <span className="text-4xl font-extrabold text-primary-mid mb-4">{total}</span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
            {lista.length ? (
              lista.map(({ diametro, peso }, i) => (
                <div key={i} className="bg-white rounded-lg p-3 flex flex-col items-center">
                  <span className="text-sm font-medium text-gray-text mb-1">Ø {diametro}</span>
                  <span className="text-lg font-semibold text-gray-text">{peso.toFixed(3)}</span>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">No hay datos por diámetro</div>
            )}
          </div>
        </div>
      </div>

      {/* Medidas de rendimiento por tipo */}
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
                  <span>{t.corte1.toFixed(3)} / {t.corte2.toFixed(3)}</span>
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

                {/* Empaquetado */}
                <li className="flex justify-between">
                  <span>Empaquetado:</span>
                  {t.noEmpaquetado ? (
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

      {/* Rendimientos globales */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-primary-dark mb-4 text-center">
          Rendimientos Globales
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <h3 className="text-sm font-medium text-gray-text mb-1">Corte</h3>
            <p className="text-xl font-bold text-gray-text">
              {rendimiento_global_corte_trabajador.toFixed(3)} /
              {rendimiento_global_corte_ayudante.toFixed(3)}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-text mb-1">Doblado</h3>
            <p className="text-xl font-bold text-gray-text">
              {rendimiento_global_doblado_trabajador.toFixed(3)} /
              {rendimiento_global_doblado_ayudante.toFixed(3)} /
              {rendimiento_global_doblado_ayudante2.toFixed(3)}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-text mb-1">Empaquetado</h3>
            <p className="text-xl font-bold text-gray-text">
              {rendimiento_global_empaquetado_trabajador.toFixed(3)} /
              {rendimiento_global_empaquetado_ayudante.toFixed(3)}
            </p>
          </div>
        </div>

        <h3 className="mt-8 text-base font-bold text-primary-dark text-center uppercase tracking-wide">
          Suma de Rendimientos
        </h3>

        <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-5">
          <div className="flex flex-col items-center px-3">
            <h3 className="text-sm font-medium text-gray-text mb-1">Doblador</h3>
            <p className="text-2xl font-extrabold text-primary-dark">
              {rendimiento_global_doblado_trabajador.toFixed(3)}
            </p>
          </div>

          <div className="flex flex-col items-center px-3">
            <h3 className="text-sm font-medium text-gray-text mb-1">Ayudantes</h3>
            <p className="text-2xl font-extrabold text-primary-dark">
              {sumaAyudantes.toFixed(3)}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
