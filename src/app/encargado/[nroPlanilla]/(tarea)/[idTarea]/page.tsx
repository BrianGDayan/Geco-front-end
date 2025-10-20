'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPlanillaByNro, PlanillaResponse } from "../../../../../lib/planillas";
import RegistroVista from '../../../../../components/RegistroVista';
import { ChevronLeft } from 'lucide-react';

interface Props {
  params: Promise<{ nroPlanilla: string; idTarea: string }>;
}

export default function RegistrarDatosPage({ params }: Props) {
  const { nroPlanilla, idTarea } = React.use(params);
  const router = useRouter();
  const [planilla, setPlanilla] = useState<PlanillaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadFlag, setReloadFlag] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPlanillaByNro(nroPlanilla, Number(idTarea))
      .then((p) => {
        setPlanilla(p);
        setLoading(false);
      })
      .catch(() => router.push('/login'));
  }, [nroPlanilla, idTarea, reloadFlag, router]);

  if (loading) return <div className="p-6">Cargando…</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-7xl p-6">
        <div className="sticky top-0 z-50 bg-gray-100 pb-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center bg-[#226FB7] hover:bg-[#1a5aa3] text-white px-4 py-2 rounded transition"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Volver atrás
          </button>
        </div>
        <RegistroVista
          planilla={planilla!}
          idTarea={Number(idTarea)}
          onRegistroGuardado={() => setReloadFlag((f) => !f)}
        />
      </div>
    </div>
  );
}
