'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPlanillasEnCurso, PlanillaSummary } from '@/lib/planillas';
import PlanillaListEncargado from '@/components/PlanillaListEncargado';

export default function PlanillasPageEncargado() {
  const router = useRouter();
  const [planillas, setPlanillas] = useState<PlanillaSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlanillasEnCurso()
      .then((data) => {
        const planillasConFecha = data.map((p) => ({
          ...p,
          fecha: new Date(p.fecha),
        }));
        setPlanillas(planillasConFecha);
        setLoading(false);
      })
      .catch((err) => {
        if (err.message === 'No autorizado') {
          router.push('/login');
        } else {
          setError(err.message);
          setLoading(false);
        }
      });
  }, [router]);

  if (loading) return <div className="p-6">Cargando…</div>;

  if (error)
    return (
      <div className="p-6 text-red-500">
        Error al cargar planillas: {error}
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Planillas en Curso</h1>
      <PlanillaListEncargado planillas={planillas!} />
    </div>
  );
}
