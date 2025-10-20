'use client';

import { useRouter } from 'next/navigation';
import PlanillaCard from '../components/PlanillaCard';
import { PlanillaSummary } from '../lib/planillas';

interface Props {
  planillas: PlanillaSummary[];
}

export default function PlanillaListEncargado({ planillas }: Props) {
  const router = useRouter();

  const goToRegistro = (nro: string, tarea: number) => {
    router.push(`/encargado/${nro}/${tarea}`);
  };

  return (
    <div className="space-y-6">
      {planillas.map((p) => (
        <PlanillaCard
          key={p.nro_planilla}
          planilla={p}
          mostrarEliminar={false}
          onCorte={() => goToRegistro(p.nro_planilla, 1)}
          onDoblado={() => goToRegistro(p.nro_planilla, 2)}
          onEmpaque={() => goToRegistro(p.nro_planilla, 3)}
          modo="encargado"
        />
      ))}
    </div>
  );
}


