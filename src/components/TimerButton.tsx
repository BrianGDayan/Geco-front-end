'use client';

import React from 'react';
import { useTimers } from '../hooks/useTimers';

interface Props {
  idDetalleTarea: number;
  idDetalle: number;
  idTarea: number;
  slot?: number;
}

export default function TimerButton({
  idDetalleTarea,
  idDetalle,
  idTarea,
  slot = 1,
}: Props) {
  const { getTimer, startTimer, stopTimer } = useTimers();
  const timer = getTimer(idDetalleTarea, slot);

  const running = !!timer?.running;
  const elapsed = timer?.elapsedSec ?? 0;

  const mm = Math.floor(elapsed / 60)
    .toString()
    .padStart(2, '0');
  const ss = (elapsed % 60).toString().padStart(2, '0');

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (running) {
      stopTimer(idDetalleTarea, slot);
    } else {
      startTimer({ idDetalleTarea, idDetalle, idTarea, slot });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-1 rounded-md text-white text-sm font-semibold transition ${
        running ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
      }`}
    >
      {mm}:{ss} — {running ? 'Parar' : 'Iniciar'}
    </button>
  );
}
