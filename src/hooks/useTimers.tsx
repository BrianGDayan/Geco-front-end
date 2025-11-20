'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

export type TimerEntry = {
  idDetalleTarea: number;
  idDetalle: number;
  idTarea: number;
  startedAt: string | null;
  stoppedAt: string | null;
  running: boolean;
  meta?: {
    nombre?: string;
    idTrabajador?: number;
  };
  elapsedSec?: number;
};

type TimersContextType = {
  timers: Record<number, TimerEntry>;
  startTimer: (entry: { idDetalleTarea: number; idDetalle: number; idTarea: number; meta?: TimerEntry['meta'] }) => void;
  stopTimer: (idDetalleTarea: number) => void;
  clearTimer: (idDetalleTarea: number) => void;
  getTimer: (idDetalleTarea: number) => TimerEntry | undefined;
  tickNow: () => void;
};

const STORAGE_KEY = 'timers-v1';
const TimersContext = createContext<TimersContextType | null>(null);

export function TimersProvider({ children }: { children: React.ReactNode }) {
  const [timers, setTimers] = useState<Record<number, TimerEntry>>({});
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as TimerEntry[];
        const map: Record<number, TimerEntry> = {};
        parsed.forEach((t) => (map[t.idDetalleTarea] = t));
        setTimers(map);
      }
    } catch {
      setTimers({});
    }
  }, []);

  useEffect(() => {
    const arr = Object.values(timers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  }, [timers]);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setTimers((prev) => {
        const copy: Record<number, TimerEntry> = { ...prev };
        const now = Date.now();
        Object.values(copy).forEach((t) => {
          if (t.running && t.startedAt) {
            const started = new Date(t.startedAt).getTime();
            t.elapsedSec = Math.max(0, Math.floor((now - started) / 1000));
          }
        });
        return copy;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const persist = (updater: (prev: Record<number, TimerEntry>) => Record<number, TimerEntry>) =>
    setTimers((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.values(next)));
      } catch {}
      return next;
    });

  const startTimer = ({
    idDetalleTarea,
    idDetalle,
    idTarea,
    meta,
  }: {
    idDetalleTarea: number;
    idDetalle: number;
    idTarea: number;
    meta?: TimerEntry['meta'];
  }) => {
    const nowIso = new Date().toISOString();
    persist((prev) => {
      const existing = prev[idDetalleTarea];
      const entry: TimerEntry = {
        idDetalleTarea,
        idDetalle,
        idTarea,
        startedAt: existing?.running ? existing.startedAt : nowIso,
        stoppedAt: null,
        running: true,
        meta: { ...(existing?.meta || {}), ...(meta || {}) },
        elapsedSec: 0,
      };
      return { ...prev, [idDetalleTarea]: entry };
    });
  };

  const stopTimer = (idDetalleTarea: number) => {
    const nowIso = new Date().toISOString();
    persist((prev) => {
      const entry = prev[idDetalleTarea];
      if (!entry) return prev;
      const started = entry.startedAt ? new Date(entry.startedAt).getTime() : Date.now();
      const elapsed = Math.max(0, Math.floor((Date.now() - started) / 1000));
      const stopped: TimerEntry = {
        ...entry,
        stoppedAt: nowIso,
        running: false,
        elapsedSec: elapsed,
      };
      return { ...prev, [idDetalleTarea]: stopped };
    });
  };

  const clearTimer = (idDetalleTarea: number) => {
    persist((prev) => {
      const copy = { ...prev };
      delete copy[idDetalleTarea];
      return copy;
    });
  };

  const getTimer = (idDetalleTarea: number) => timers[idDetalleTarea];

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

  return <TimersContext.Provider value={value}>{children}</TimersContext.Provider>;
}

export function useTimers() {
  const ctx = useContext(TimersContext);
  if (!ctx) throw new Error('useTimers must be used within TimersProvider');
  return ctx;
}

export function formatSecToHourDecimal(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const decimal = +(sec / 3600).toFixed(2);
  return { h, m, decimal };
}

export function secToTimeHHMM(sec: number) {
  const d = new Date(Date.now() + sec * 1000);
  const h = Math.floor(sec / 3600)
    .toString()
    .padStart(2, '0');
  const m = Math.floor((sec % 3600) / 60)
    .toString()
    .padStart(2, '0');
  return `${h}:${m}`;
}
