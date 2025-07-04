'use client';

import React, { useMemo } from 'react';
import { PlanillaResponse } from '@/lib/planillas';

interface Props {
  planilla: PlanillaResponse;
}

type Stats = { sumTrab: number; sumAyu: number; count: number };

export default function AdminFooter({ planilla }: Props) {
  const { peso_total, pesos_diametro } = planilla;
  const total = typeof peso_total === 'number' ? peso_total.toFixed(3) : '—';
  const lista = Array.isArray(pesos_diametro) ? pesos_diametro : [];

  const agrupadoPorTipo = useMemo(() => {
    const mapa = new Map<string, { corte: Stats; doblado: Stats; empaquetado: Stats }>();
    planilla.elemento.forEach(({ detalle }) =>
      detalle.forEach((det) => {
        const key = det.tipo;
        if (!mapa.has(key)) {
          mapa.set(key, {
            corte: { sumTrab: 0, sumAyu: 0, count: 0 },
            doblado: { sumTrab: 0, sumAyu: 0, count: 0 },
            empaquetado: { sumTrab: 0, sumAyu: 0, count: 0 },
          });
        }
        const stats = mapa.get(key)!;
        det.detalle_tarea.forEach((dt) => {
          const tarea = dt.tarea.nombre_tarea;
          dt.registro.forEach(({ rendimiento_trabajador: tr, rendimiento_ayudante: ay }) => {
            if (tarea === 'Corte') {
              stats.corte.sumTrab += tr;
              stats.corte.sumAyu += ay;
              stats.corte.count++;
            } else if (tarea === 'Doblado') {
              stats.doblado.sumTrab += tr;
              stats.doblado.sumAyu += ay;
              stats.doblado.count++;
            } else if (tarea === 'Empaquetado') {
              stats.empaquetado.sumTrab += tr;
              stats.empaquetado.sumAyu += ay;
              stats.empaquetado.count++;
            }
          });
        });
      })
    );
    return Array.from(mapa.entries()).map(([tipo, s]) => ({
      tipo,
      corte1: s.corte.count ? s.corte.sumTrab / s.corte.count : 0,
      corte2: s.corte.count ? s.corte.sumAyu / s.corte.count : 0,
      dobl1: s.doblado.count ? s.doblado.sumTrab / s.doblado.count : 0,
      dobl2: s.doblado.count ? s.doblado.sumAyu / s.doblado.count : 0,
      empaq1: s.empaquetado.count ? s.empaquetado.sumTrab / s.empaquetado.count : 0,
      empaq2: s.empaquetado.count ? s.empaquetado.sumAyu / s.empaquetado.count : 0,
    }));
  }, [planilla]);

  return (
    <section className="space-y-8 max-w-7xl mx-auto px-4">
      {/* Peso Total y por Diámetro */}
      <div className="bg-gray-bg rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-primary-dark mb-4 text-center">
          Peso Total (Tn)
        </h2>
        <div className="flex flex-col items-center mb-6">
          <span className="text-4xl font-extrabold text-primary-mid mb-4">
            {total}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
            {lista.length ? (
              lista.map(({ diametro, peso }, i) => (
                <div key={i} className="bg-white rounded-lg p-3 flex flex-col items-center">
                  <span className="text-sm font-medium text-gray-text mb-1">
                    Ø {diametro}
                  </span>
                  <span className="text-lg font-semibold text-gray-text">
                    {typeof peso === 'number' ? peso.toFixed(3) : '—'}
                  </span>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No hay datos por diámetro
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Medidas de Rendimiento */}
      <div>
        <h2 className="text-xl font-bold text-primary-dark mb-4 text-center">
          Medidas de Rendimiento
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agrupadoPorTipo.map((t) => (
            <div key={t.tipo} className="bg-white rounded-2xl shadow p-5">
              <h3 className="text-lg font-semibold text-secondary-dark mb-3 text-center">
                Tipo {t.tipo}
              </h3>
              <ul className="space-y-2 text-gray-text">
                <li className="flex justify-between">
                  <span>Corte:</span>
                  <span>
                    {t.corte1.toFixed(3)} / {t.corte2.toFixed(3)}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Doblado:</span>
                  <span>
                    {t.dobl1.toFixed(3)} / {t.dobl2.toFixed(3)}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Empaquetado:</span>
                  <span>
                    {t.empaq1.toFixed(3)} / {t.empaq2.toFixed(3)}
                  </span>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Rendimientos Globales */}
      {planilla.rendimiento_global_corte_trabajador !== undefined && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-primary-dark mb-4 text-center">
            Rendimientos Globales
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {/* Corte */}
            <div>
              <h3 className="text-sm font-medium text-gray-text mb-1">
                Corte
              </h3>
              <p className="text-lg font-bold text-gray-text">
                {planilla.rendimiento_global_corte_trabajador.toFixed(2)} /{' '}
                {planilla.rendimiento_global_corte_ayudante.toFixed(2)}
              </p>
            </div>
            {/* Doblado */}
            <div>
              <h3 className="text-sm font-medium text-gray-text mb-1">
                Doblado
              </h3>
              <p className="text-lg font-bold text-gray-text">
                {planilla.rendimiento_global_doblado_trabajador.toFixed(2)} /{' '}
                {planilla.rendimiento_global_doblado_ayudante.toFixed(2)}
              </p>
            </div>
            {/* Empaquetado */}
            <div>
              <h3 className="text-sm font-medium text-gray-text mb-1">
                Empaquetado
              </h3>
              <p className="text-lg font-bold text-gray-text">
                {planilla.rendimiento_global_empaquetado_trabajador.toFixed(2)} /{' '}
                {planilla.rendimiento_global_empaquetado_ayudante.toFixed(2)}
              </p>
            </div>
          </div>

          <h3 className="mt-6 text-md font-semibold text-primary-dark text-center">
            Suma de Rendimientos
          </h3>
          <p className="text-lg font-bold text-gray-text text-center">
            {(
              (planilla.rendimiento_global_corte_trabajador ?? 0) +
              (planilla.rendimiento_global_doblado_trabajador ?? 0) +
              (planilla.rendimiento_global_empaquetado_trabajador ?? 0)
            ).toFixed(2)}{' '}
            /{' '}
            {(
              (planilla.rendimiento_global_corte_ayudante ?? 0) +
              (planilla.rendimiento_global_doblado_ayudante ?? 0) +
              (planilla.rendimiento_global_empaquetado_ayudante ?? 0)
            ).toFixed(2)}
          </p>
        </div>
      )}
    </section>
  );
}
