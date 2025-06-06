// components/AdminVista.tsx
'use client';

import React, { useState } from 'react';
import { PlanillaResponse, DetalleResponse, RegistroResponse } from '@/lib/planillas';
import AdminHeader from './AdminHeader';
import AdminTablaRegistro from './AdminTablaRegistro';
import AdminFooter from './AdminFooter';

interface Props {
  planilla: PlanillaResponse;
  idTarea: number;
}

export default function AdminVista({ planilla, idTarea }: Props) {
  // Para forzar un “re-render” local si guardamos cambios
  const [key, setKey] = useState(0);

  // Volver a cargar la vista (por ejemplo después de guardar)
  const reload = () => setKey((k) => k + 1);

  // Obtenemos todos los “detalles” filtrados a la tarea actual
  // (PlanillaResponse.elemento[].detalle[].detalle_tarea[0].registro)
  const detalles: DetalleResponse[] = planilla.elemento.flatMap((elem) =>
    elem.detalle.filter((d) => d.detalle_tarea.some((dt) => dt.tarea.nombre_tarea === ''))
    // Note: Aquí asumimos que el backend ya filtró por idTarea, 
    // así que cada detalle trae un único detalle_tarea con registro[]
    // Si no es el caso, filtrar por d.detalle_tarea.id_tarea === idTarea
  );

  return (
    <div key={key}>
      {/* Encabezado de la planilla */}
      <AdminHeader planilla={planilla} />

      {/* Tabla con todos los detalles y registros para esta tarea */}
      <AdminTablaRegistro
        planilla={planilla}
        detalles={detalles}
        idTarea={idTarea}
        onSave={reload}
      />

      {/* Pie de página: pesos totales y rendimientos */}
      <AdminFooter planilla={planilla} />
    </div>
  );
}
