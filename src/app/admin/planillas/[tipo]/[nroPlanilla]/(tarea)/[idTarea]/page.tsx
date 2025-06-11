'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPlanillaByNro, PlanillaResponse } from '@/lib/planillas';
import AdminVista from '@/components/AdminVista';

interface Props {
  params: Promise<{
    nroPlanilla: string;
    idTarea: string;
  }>;
}

export default function AdminVerDatosPage({ params }: Props) {
  // Desenrollamos params
  const { nroPlanilla, idTarea } = use(params);
  const router = useRouter();
  const [planilla, setPlanilla] = useState<PlanillaResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlanillaByNro(nroPlanilla, Number(idTarea))
      .then((data) => {
        setPlanilla(data);
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
  }, [nroPlanilla, idTarea, router]);

  if (loading) return <div className="p-6">Cargando…</div>;
  if (error)
    return (
      <div className="p-6 text-red-500">
        Error al cargar datos de planilla: {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-bg">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <AdminVista planilla={planilla!} idTarea={Number(idTarea)} />
      </div>
    </div>
  );
}
