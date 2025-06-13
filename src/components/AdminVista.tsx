// components/AdminVista.tsx
'use client';

import React, { useState } from 'react';
import { PlanillaResponse, DetalleResponse } from '@/lib/planillas';
import AdminHeader from './AdminHeader';
import AdminTablaRegistro from './AdminTablaRegistro';
import AdminFooter from './AdminFooter';

interface Props {
  planilla: PlanillaResponse;
  idTarea: number;
}

export default function AdminVista({ planilla, idTarea }: Props) {
  const [key, setKey] = useState(0);
  const reload = () => setKey((k) => k + 1);

  // Extendemos cada detalle con su nombre de elemento
  const detallesConNombre: (DetalleResponse & { nombre_elemento: string })[] =
    planilla.elemento.flatMap((elem) =>
      elem.detalle.map((d) => ({
        ...d,
        nombre_elemento: elem.nombre_elemento,
      }))
    );

  return (
    <div key={key}>
      <AdminHeader planilla={planilla} />

      <AdminTablaRegistro
        planilla={planilla}
        detalles={detallesConNombre}
        idTarea={idTarea}
        onSave={reload}
      />

      <AdminFooter planilla={planilla} />
    </div>
  );
}
