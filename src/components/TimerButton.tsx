'use client';

import React from 'react';
import { useTimers } from '../hooks/useTimers';

interface Props {
  idDetalleTarea: number;
  idDetalle: number;
  idTarea: number;
  className?: string;
}

export default function TimerButton({
  idDetalleTarea,
  idDetalle,
  idTarea,
  className,
}: Props) {
  const { timers, startTimer, stopTimer } = useTimers();
  const timer = timers[idDetalleTarea];

  const running = !!timer?.running;
  const elapsed = timer?.elapsedSec ?? (timer?.startedAt && timer?.stoppedAt
    ? Math.floor((new Date(timer.stoppedAt!).getTime() - new Date(timer.startedAt!).getTime()) / 1000)
    : 0);

  // Mostrar mm:ss para que se vea el avance segundo a segundo
  const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const seconds = (elapsed % 60).toString().padStart(2, '0');
  const timeLabel = `${minutes}:${seconds}`;

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
      <span className="font-mono text-xs">{timeLabel}</span>
      <span>{running ? 'Parar' : 'Iniciar'}</span>
    </button>
  );
}
