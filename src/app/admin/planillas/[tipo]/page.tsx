'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPlanillasCompletadas, getPlanillasEnCurso, PlanillaSummary } from '@/lib/planillas';
import PlanillaListAdmin from '@/components/PlanillaListAdmin';
import { motion } from 'framer-motion';

const variants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
};

type Props = {
  params: Promise<{
    tipo: 'completadas' | 'en-curso';
  }>;
};

export default function PlanillasPageClient({ params }: Props) {
  const { tipo } = use(params);
  const router = useRouter();
  const [planillas, setPlanillas] = useState<PlanillaSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFn =
      tipo === 'completadas' ? getPlanillasCompletadas : getPlanillasEnCurso;

    fetchFn()
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
  }, [tipo, router]);

  if (loading) {
    return <div className="p-6">Cargando…</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Error al cargar planillas: {error}
      </div>
    );
  }

  const title =
    tipo === 'completadas' ? 'Planillas Completadas' : 'Planillas en Curso';

  return (
    <motion.div
      className="p-6"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl font-bold mb-6 text-center">{title}</h1>

      {planillas && planillas.length === 0 ? (
        <p className="text-red-600 text-lg text-center">
          Actualmente no hay planillas
        </p>
      ) : (
        <PlanillaListAdmin planillas={planillas!} tipo={tipo} />
      )}
    </motion.div>
  );
}
