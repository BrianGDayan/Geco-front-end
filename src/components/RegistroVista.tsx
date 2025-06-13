// components/RegistroVista.tsx
'use client';

import React from 'react';
import { PlanillaResponse } from '@/lib/planillas';
import PlanillaHeader from './PlanillaHeader';
import PlanillaCardRegistro from './PlanillaCardRegistro';

interface Props {
  planilla: PlanillaResponse;
  idTarea: number;
}

export default function RegistroVista({ planilla, idTarea }: Props) {
  return (
    <>
      <PlanillaHeader planilla={planilla} />
      {planilla.elemento.map((elem) =>
        elem.detalle.map((det) => (
          <PlanillaCardRegistro
            key={`${elem.nombre_elemento}-${det.posicion}`}
            elementoNombre={elem.nombre_elemento}
            detalle={det}
            idTarea={idTarea}
          />
        ))
      )}
    </>
  );
}
