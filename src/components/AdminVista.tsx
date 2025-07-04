'use client';

import React from "react";
import useSWR from "swr";
import { getPlanillaByNro, PlanillaResponse } from "@/lib/planillas";
import AdminHeader from "./AdminHeader";
import AdminTablaRegistro from "./AdminTablaRegistro";
import AdminFooter from "./AdminFooter";

interface Props {
  nroPlanilla: string;
  idTarea: number;
}

export default function AdminVista({ nroPlanilla, idTarea }: Props) {
  const { data: planilla, mutate, error } = useSWR<PlanillaResponse>(
    ["/planillas", nroPlanilla, idTarea],
    () => getPlanillaByNro(nroPlanilla, idTarea)
  );

  const handleSave = async () => {
    await mutate();
  };

  if (error) return <div className="p-6 text-red-500">Error cargando planilla</div>;
  if (!planilla) return <div className="p-6">Cargando planilla…</div>;

  const detallesConNombre = planilla.elemento.flatMap((elem) =>
    elem.detalle.map((d) => ({
      ...d,
      nombre_elemento: elem.nombre_elemento,
      campos_modificados: d.campos_modificados,
    }))
  );

  return (
    <>
      <AdminHeader planilla={planilla} />
      <AdminTablaRegistro
        planilla={planilla}
        detalles={detallesConNombre}
        idTarea={idTarea}
        onSave={handleSave}
      />
      <AdminFooter planilla={planilla} />
    </>
  );
}
