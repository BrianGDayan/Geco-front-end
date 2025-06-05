'use client';

import { useRouter } from 'next/navigation';
import PlanillaCard from '@/components/PlanillaCard';
import { PlanillaSummary } from '@/lib/planillas';

interface Props {
  planillas: PlanillaSummary[];
}

export default function PlanillaListEncargado({ planillas }: Props) {
  const router = useRouter();

  const handleRegistrar = (nro: string, tarea: number) => {
    router.push(`/encargado/planillas-en-curso/${nro}/tarea/${tarea}/registrar`);
  };

  return (
    <div className="space-y-6">
      {planillas.map((p) => (
        <PlanillaCard
          key={p.nro_planilla}
          planilla={p}
          mostrarEliminar={false}
          onCorte={() => handleRegistrar(p.nro_planilla, 1)}
          onDoblado={() => handleRegistrar(p.nro_planilla, 2)}
          onEmpaque={() => handleRegistrar(p.nro_planilla, 3)}
          modo="encargado"
        />
      ))}
    </div>
  );
}

