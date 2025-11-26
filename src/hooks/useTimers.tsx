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
  slot: number;              // 1,2,3 según rol
  startedAt: string | null;  // ISO
  stoppedAt: string | null;  // ISO
  running: boolean;
  elapsedSec?: number;
};

type TimersMap = Record<string, TimerEntry>; // key = `${idDetalleTarea}-${slot}`

type TimersContextType = {
  timers: TimersMap;
  startTimer: (args: {
    idDetalleTarea: number;
    idDetalle: number;
    idTarea: number;
    slot: number;
  }) => void;
  stopTimer: (idDetalleTarea: number, slot: number) => void;
  clearTimer: (idDetalleTarea: number, slot: number) => void;
  getTimer: (idDetalleTarea: number, slot: number) => TimerEntry | undefined;
  tickNow: () => void;
};

const STORAGE_KEY = 'timers-v2';
const TimersContext = createContext<TimersContextType | null>(null);

function makeKey(idDetalleTarea: number, slot: number) {
  return `${idDetalleTarea}-${slot}`;
}

export function TimersProvider({ children }: { children: React.ReactNode }) {
  const [timers, setTimers] = useState<TimersMap>({});
  const intervalRef = useRef<number | null>(null);

  // Carga inicial desde localStorage
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined'
        ? localStorage.getItem(STORAGE_KEY)
        : null;
      if (!raw) return;

      const parsed = JSON.parse(raw) as any[];
      const map: TimersMap = {};

      parsed.forEach((item) => {
        if (!item) return;
        // formato nuevo: { key, ...entry }
        if (item.key && typeof item.key === 'string') {
          const { key, ...entry } = item;
          map[key] = entry as TimerEntry;
        } else if (typeof item.idDetalleTarea === 'number') {
          // posible formato viejo: un solo timer por detalle_tarea → lo migro a slot 1
          const key = makeKey(item.idDetalleTarea, 1);
          map[key] = {
            idDetalleTarea: item.idDetalleTarea,
            idDetalle: item.idDetalle,
            idTarea: item.idTarea,
            slot: item.slot ?? 1,
            startedAt: item.startedAt ?? null,
            stoppedAt: item.stoppedAt ?? null,
            running: !!item.running,
            elapsedSec: item.elapsedSec ?? 0,
          };
        }
      });

      setTimers(map);
    } catch {
      setTimers({});
    }
  }, []);

  // Persistir en localStorage
  useEffect(() => {
    try {
      const arr = Object.entries(timers).map(([key, entry]) => ({
        key,
        ...entry,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    } catch {
      // ignore
    }
  }, [timers]);

  // Intervalo para actualizar elapsedSec de timers corriendo
  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setTimers((prev) => {
        const copy: TimersMap = { ...prev };
        const now = Date.now();
        Object.entries(copy).forEach(([key, t]) => {
          if (t.running && t.startedAt) {
            const started = new Date(t.startedAt).getTime();
            copy[key] = {
              ...t,
              elapsedSec: Math.max(0, Math.floor((now - started) / 1000)),
            };
          }
        });
        return copy;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const startTimer: TimersContextType['startTimer'] = ({
    idDetalleTarea,
    idDetalle,
    idTarea,
    slot,
  }) => {
    const nowIso = new Date().toISOString();
    const key = makeKey(idDetalleTarea, slot);

    setTimers((prev) => {
      const existing = prev[key];
      const entry: TimerEntry = {
        idDetalleTarea,
        idDetalle,
        idTarea,
        slot,
        startedAt: existing?.running ? existing.startedAt : nowIso,
        stoppedAt: null,
        running: true,
        elapsedSec: 0,
      };
      return { ...prev, [key]: entry };
    });
  };

  const stopTimer: TimersContextType['stopTimer'] = (
    idDetalleTarea,
    slot,
  ) => {
    const key = makeKey(idDetalleTarea, slot);
    const nowIso = new Date().toISOString();

    setTimers((prev) => {
      const entry = prev[key];
      if (!entry) return prev;
      const started = entry.startedAt
        ? new Date(entry.startedAt).getTime()
        : Date.now();
      const elapsed = Math.max(
        0,
        Math.floor((Date.now() - started) / 1000),
      );
      return {
        ...prev,
        [key]: {
          ...entry,
          stoppedAt: nowIso,
          running: false,
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
    setTimers((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const getTimer: TimersContextType['getTimer'] = (
    idDetalleTarea,
    slot,
  ) => {
    const key = makeKey(idDetalleTarea, slot);
    return timers[key];
  };

  const tickNow = () => {
    setTimers((prev) => ({ ...prev }));
  };

  const value: TimersContextType = {
    timers,
    startTimer,
    stopTimer,
    clearTimer,
    getTimer,
    tickNow,
  };

  return (
    <TimersContext.Provider value={value}>
      {children}
    </TimersContext.Provider>
  );
}

export function useTimers() {
  const ctx = useContext(TimersContext);
  if (!ctx) throw new Error('useTimers must be used within TimersProvider');
  return ctx;
}

export function formatSecToHourDecimal(sec: number) {
  const decimal = +(sec / 3600).toFixed(2);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return { h, m, decimal };
}

export function secToTimeHHMM(sec: number) {
  const h = Math.floor(sec / 3600)
    .toString()
    .padStart(2, '0');
  const m = Math.floor((sec % 3600) / 60)
    .toString()
    .padStart(2, '0');
  return `${h}:${m}`;
}
