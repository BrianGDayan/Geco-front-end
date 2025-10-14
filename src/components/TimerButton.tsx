'use client';

import React, { useEffect, useState } from 'react';
import { useTimers, formatSecToHourDecimal } from '@/hooks/useTimers';

interface Props {
  idDetalleTarea: number;
  idDetalle: number;
  idTarea: number;
  className?: string;
}

export default function TimerButton({ idDetalleTarea, idDetalle, idTarea, className }: Props) {
  const { getTimer, startTimer, stopTimer } = useTimers();
  const [, tick] = useState(0); // para forzar re-render

  const timer = getTimer(idDetalleTarea);
  const running = timer?.running ?? false;

  // efecto para actualizar cada segundo mientras corre
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => tick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const elapsed = timer?.elapsedSec ?? (timer?.startedAt && timer?.stoppedAt ? Math.floor((new Date(timer.stoppedAt!).getTime() - new Date(timer.startedAt!).getTime()) / 1000) : 0);
  const { h, m } = formatSecToHourDecimal(elapsed);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (running) stopTimer(idDetalleTarea);
    else startTimer({ idDetalleTarea, idDetalle, idTarea });
  };

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-2 px-3 py-1 rounded text-sm border ${running ? 'bg-red-600 text-white' : 'bg-green-600 text-white'} ${className || ''}`}
      title={running ? 'Detener temporizador' : 'Iniciar temporizador'}
    >
      <span className="font-mono text-xs">{String(h).padStart(2, '0')}:{String(Math.floor(m)).padStart(2, '0')}</span>
      <span>{running ? 'Parar' : 'Iniciar'}</span>
    </button>
  );
}
