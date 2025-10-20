'use client';

import React from 'react';
import useSWR from 'swr';
import { getPlanillaByNro, getPlanillaCompleta, PlanillaResponse } from '../lib/planillas';
import AdminHeader from './AdminHeader';
import AdminTablaRegistro from './AdminTablaRegistro';
import AdminFooter from './AdminFooter';

interface Props {
  nroPlanilla: string;
  idTarea: number;
}

export default function AdminVista({ nroPlanilla, idTarea }: Props) {
  // Planilla filtrada: para header y tabla de registros
  const {
    data: planillaFiltrada,
    mutate: mutateFiltrada,
    error: errorFiltrada,
  } = useSWR<PlanillaResponse>(
    ['planilla', nroPlanilla, idTarea],
    () => getPlanillaByNro(nroPlanilla, idTarea)
  );

  // Planilla completa: para footer
  const {
    data: planillaCompleta,
    mutate: mutateCompleta,
    error: errorCompleta,
  } = useSWR<PlanillaResponse>(
    ['planillaCompleta', nroPlanilla],
    () => getPlanillaCompleta(nroPlanilla)
  );

  const handleSave = async () => {
    await Promise.all([mutateFiltrada(), mutateCompleta()]);
  };

  if (errorFiltrada || errorCompleta)
    return <div className="p-6 text-red-500">Error cargando planilla</div>;
  if (!planillaFiltrada || !planillaCompleta)
    return <div className="p-6">Cargando planilla…</div>;

  const detallesConNombre = planillaFiltrada.elemento.flatMap((elem) =>
    elem.detalle.map((d) => ({
      ...d,
      nombre_elemento: elem.nombre_elemento,
      campos_modificados: d.campos_modificados,
    }))
  );

  return (
    <>
      <AdminHeader planilla={planillaFiltrada} idTarea={idTarea} />
      <AdminTablaRegistro
        planilla={planillaFiltrada}
        detalles={detallesConNombre}
        idTarea={idTarea}
        onSave={handleSave}
      />
      <AdminFooter planilla={planillaCompleta} />
    </>
  );
}
