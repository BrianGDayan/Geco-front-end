import PlanillaCard from '@/components/PlanillaCard';
import { PlanillaSummary } from '@/lib/planillas';

interface Props {
  planillas: PlanillaSummary[];
  tipo: 'en-curso' | 'completadas';
}

export default function PlanillaListAdmin({ planillas, tipo }: Props) {
  return (
    <div className="space-y-6">
      {planillas.map((p) => (
        <PlanillaCard
          key={p.nro_planilla}
          planilla={p}
          mostrarEliminar={tipo === 'completadas'}
          onCorte={(nro) =>
            window.location.assign(`/admin/planillas-${tipo}/${nro}/tarea/1`)
          }
          onDoblado={(nro) =>
            window.location.assign(`/admin/planillas-${tipo}/${nro}/tarea/2`)
          }
          onEmpaque={(nro) =>
            window.location.assign(`/admin/planillas-${tipo}/${nro}/tarea/3`)
          }
          modo="admin"
        />
      ))}
    </div>
  );
}
