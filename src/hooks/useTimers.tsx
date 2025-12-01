'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

export type TimerEntry = {
  idDetalleTarea: number;
  idDetalle: number;
  idTarea: number;
  slot: number;
  startedAt: string | null;   // ISO string
  stoppedAt: string | null;   // ISO string
  running: boolean;
  elapsedSec: number;         // segundos acumulados
};

type TimersContextType = {
  timers: Record<string, TimerEntry>;
  startTimer: (args: {
    idDetalleTarea: number;
    idDetalle: number;
    idTarea: number;
    slot: number;
  }) => void;
  stopTimer: (idDetalleTarea: number, slot: number) => void;
  clearTimer: (idDetalleTarea: number, slot: number) => void;
  getTimer: (idDetalleTarea: number, slot: number) => TimerEntry | undefined;
};

const TimersContext = createContext<TimersContextType | undefined>(undefined);

const STORAGE_KEY = 'geco-timers-v2';

function makeKey(idDetalleTarea: number, slot: number): string {
  return `${idDetalleTarea}-${slot}`;
}

export function TimersProvider({ children }: { children: React.ReactNode }) {
  const [timers, setTimers] = useState<Record<string, TimerEntry>>({});
  const initializedRef = useRef(false);

  // Cargar desde localStorage al montar
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    try {
      const raw = typeof window !== 'undefined'
        ? window.localStorage.getItem(STORAGE_KEY)
        : null;
      if (!raw) return;

      const parsed: Record<string, TimerEntry> = JSON.parse(raw);

      const now = Date.now();
      const fixed: Record<string, TimerEntry> = {};

      Object.entries(parsed).forEach(([key, t]) => {
        let elapsed = t.elapsedSec || 0;

        if (t.running && t.startedAt) {
          const startMs = new Date(t.startedAt).getTime();
          if (!Number.isNaN(startMs)) {
            const diff = Math.max(0, Math.floor((now - startMs) / 1000));
            elapsed = diff;
          }
        }

        fixed[key] = {
          ...t,
          elapsedSec: elapsed,
        };
      });

      setTimers(fixed);
    } catch {
      // si hay error, ignoramos y empezamos vacío
    }
  }, []);

  // Guardar en localStorage cuando cambian
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(timers));
    } catch {
      // ignorar errores de storage
    }
  }, [timers]);

  // Tick de 1s para actualizar elapsedSec de timers corriendo
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => {
        const now = Date.now();
        let changed = false;
        const next: Record<string, TimerEntry> = {};

        for (const [key, t] of Object.entries(prev)) {
          if (t.running && t.startedAt) {
            const startMs = new Date(t.startedAt).getTime();
            if (!Number.isNaN(startMs)) {
              const diff = Math.max(
                0,
                Math.floor((now - startMs) / 1000),
              );
              if (diff !== t.elapsedSec) {
                changed = true;
                next[key] = { ...t, elapsedSec: diff };
                continue;
              }
            }
          }
          next[key] = t;
        }

        return changed ? next : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const startTimer: TimersContextType['startTimer'] = ({
    idDetalleTarea,
    idDetalle,
    idTarea,
    slot,
  }) => {
    const key = makeKey(idDetalleTarea, slot);
    const nowIso = new Date().toISOString();

    setTimers(prev => {
      const existing = prev[key];
      return {
        ...prev,
        [key]: {
          idDetalleTarea,
          idDetalle,
          idTarea,
          slot,
          startedAt: nowIso,
          stoppedAt: null,
          running: true,
          elapsedSec: existing?.elapsedSec ?? 0,
        },
      };
    });
  };

  const stopTimer: TimersContextType['stopTimer'] = (
    idDetalleTarea,
    slot,
  ) => {
    const key = makeKey(idDetalleTarea, slot);
    const nowIso = new Date().toISOString();

    setTimers(prev => {
      const t = prev[key];
      if (!t || !t.startedAt) return prev;

      const startMs = new Date(t.startedAt).getTime();
      const stopMs = new Date(nowIso).getTime();

      const elapsed =
        !Number.isNaN(startMs) && stopMs > startMs
          ? Math.floor((stopMs - startMs) / 1000)
          : t.elapsedSec;

      return {
        ...prev,
        [key]: {
          ...t,
          running: false,
          stoppedAt: nowIso,
          elapsedSec: elapsed,
        },
      };
    });
  };

  const clearTimer: TimersContextType['clearTimer'] = (
    idDetalleTarea,
    slot,
  ) => {
    const key = makeKey(idDetalleTarea, slot);
    setTimers(prev => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const getTimer: TimersContextType['getTimer'] = (
    idDetalleTarea,
    slot,
  ) => {
    const key = makeKey(idDetalleTarea, slot);
    return timers[key];
  };

  const value: TimersContextType = {
    timers,
    startTimer,
    stopTimer,
    clearTimer,
    getTimer,
  };

  return (
    <TimersContext.Provider value={value}>
      {children}
    </TimersContext.Provider>
  );
}

export function useTimers(): TimersContextType {
  const ctx = useContext(TimersContext);
  if (!ctx) {
    throw new Error('useTimers debe usarse dentro de TimersProvider');
  }
  return ctx;
}
