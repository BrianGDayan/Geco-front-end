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
    <div className="px-4 sm:px-6 py-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
        Planillas en Curso
      </h1>

      {planillas && planillas.length === 0 ? (
        <p className="text-red-600 text-lg text-center">
          Actualmente no hay planillas
        </p>
      ) : (
        <PlanillaListEncargado planillas={planillas!} />
      )}
    </div>
  );
}
