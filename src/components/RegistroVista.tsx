'use client';

import React from 'react';
import { PlanillaResponse } from '../lib/planillas';
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

  const tareaLabels: Record<number, string> = {
    1: 'Corte',
    2: 'Doblado',
    3: 'Empaquetado',
  };

  return (
    <>
      {/* HEADER CON FONDO BLANCO Y LETRA AZUL OSCURO */}
      <div className="rounded-lg shadow p-5 mb-6">
        <h2 className="text-2xl font-bold tracking-wide" style={{ color: "#1a3c6e" }}>
          Datos de {tareaLabels[idTarea]} de la planilla {planilla.nro_planilla}
        </h2>
      </div>

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


