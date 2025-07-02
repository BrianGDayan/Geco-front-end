'use client';

import React from 'react';
import { PlanillaResponse } from '@/lib/planillas';
import PlanillaHeader from './PlanillaHeader';
import PlanillaCardRegistro from './PlanillaCardRegistro';

interface Props {
  planilla: PlanillaResponse;
  idTarea: number;
  onRegistroGuardado: () => void;
}

export default function RegistroVista({
  planilla,
  idTarea,
  onRegistroGuardado,
}: Props) {
  return (
    <>
      <PlanillaHeader planilla={planilla} idTarea={idTarea}/>
      {planilla.elemento.map(elem => (
        <PlanillaCardRegistro
          key={elem.id_elemento}
          elementoNombre={elem.nombre_elemento}
          detalles={elem.detalle}
          idTarea={idTarea}
          onRegistroGuardado={onRegistroGuardado}
        />
      ))}
    </>
  );
}

