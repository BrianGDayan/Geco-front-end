// app/encargado/planillas-en-curso/[nroPlanilla]/tarea/[idTarea]/registrar/page.tsx
'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPlanillaByNro, PlanillaResponse } from '@/lib/planillas';
import RegistroVista from '@/components/RegistroVista';

interface Props { params: Promise<{ nroPlanilla: string; idTarea: string }> }

export default function RegistrarDatosPage({ params }: Props) {
  const { nroPlanilla, idTarea } = use(params);
  const router = useRouter();
  const [planilla, setPlanilla] = useState<PlanillaResponse|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlanillaByNro(nroPlanilla, Number(idTarea))
      .then(p => { setPlanilla(p); setLoading(false); })
      .catch(() => router.push('/login'));
  }, [nroPlanilla, idTarea, router]);

  if (loading) return <div className="p-6">Cargando…</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-7xl p-6">
        <RegistroVista planilla={planilla!} idTarea={Number(idTarea)} />
      </div>
    </div>
  );
}
