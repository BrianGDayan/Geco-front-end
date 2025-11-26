'use client';

import React from 'react';
import { useTimers, secToTimeHHMM } from '../hooks/useTimers';

interface TimerButtonProps {
  idDetalle: number;
  idDetalleTarea: number;
  idTarea: number;
  slot: number;                  // 1,2,3
  onStopped: () => void;
  disabled?: boolean;
}

export default function TimerButton({
  idDetalle,
  idDetalleTarea,
  idTarea,
  slot,
  onStopped,
  disabled = false,
}: TimerButtonProps) {
  const { getTimer, startTimer, stopTimer } = useTimers();
  const timer = getTimer(idDetalleTarea, slot);

  const hasTimer = !!timer;
  const isRunning = !!timer?.running;
  const sec = timer?.elapsedSec ?? 0;

  const label = (() => {
    if (!hasTimer) return 'Iniciar';
    if (isRunning) return `Detener (${secToTimeHHMM(sec)})`;
    return 'Ver registro';
  })();

  const handleClick = () => {
    if (disabled) return;

    if (!hasTimer) {
      startTimer({ idDetalleTarea, idDetalle, idTarea, slot });
      return;
    }

    if (isRunning) {
      stopTimer(idDetalleTarea, slot);
      onStopped();
      return;
    }

    // Timer detenido: solo abrir modal sin tocar tiempos
    onStopped();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`px-3 py-1 rounded text-xs sm:text-sm border ${
        disabled
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
          : isRunning
          ? 'bg-primary text-white'
          : 'bg-white text-primary border-primary'
      }`}
    >
      {label}
    </button>
  );
}
