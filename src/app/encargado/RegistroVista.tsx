// components/RegistroVista.tsx
'use client';

import React from 'react';
import PlanillaHeader from './PlanillaHeader';
import PlanillaCardRegistro from './PlanillaCardRegistro';
import { PlanillaResponse } from '@/lib/planillas';

interface Props {
  planilla: PlanillaResponse;
}

export default function RegistroVista({ planilla }: Props) {
  return (
    <>
      {/* Encabezado con datos generales */}
      <PlanillaHeader planilla={planilla} />

      {/* Por cada elemento y cada detalle, mostramos una tarjeta */}
      {planilla.elemento.map((elem) =>
        elem.detalle.map((det) => (
          <PlanillaCardRegistro
            key={`${elem.nombre_elemento}-${det.posicion}`}
            elementoNombre={elem.nombre_elemento}
            detalle={det}
          />
        ))
      )}
    </>
  );
}
