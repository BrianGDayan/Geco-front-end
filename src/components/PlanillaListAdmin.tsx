'use client';

import { useRouter } from 'next/navigation';
import PlanillaCard from '@/components/PlanillaCard';
import { PlanillaSummary } from '@/lib/planillas';

interface Props {
  planillas: PlanillaSummary[];
  tipo: 'en-curso' | 'completadas';
}

export default function PlanillaListAdmin({ planillas, tipo }: Props) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {planillas.map((p) => (
        <PlanillaCard
          key={p.nro_planilla}
          planilla={p}
          mostrarEliminar={tipo === 'completadas'}
          onCorte={(nro) =>
            router.push(`/admin/planillas-${tipo}/${nro}/tarea/1`)
          }
          onDoblado={(nro) =>
            router.push(`/admin/planillas-${tipo}/${nro}/tarea/2`)
          }
          onEmpaque={(nro) =>
            router.push(`/admin/planillas-${tipo}/${nro}/tarea/3`)
          }
          modo="admin"
        />
      ))}
    </div>
  );
}
