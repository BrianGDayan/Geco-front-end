import PlanillaCard from '@/components/PlanillaCard';
import { PlanillaSummary } from '@/lib/planillas';

interface Props {
  planillas: PlanillaSummary[];
}

export default function PlanillaListEncargado({ planillas }: Props) {
  return (
    <div className="space-y-6">
      {planillas.map((p) => (
        <PlanillaCard
          key={p.nro_planilla}
          planilla={p}
          mostrarEliminar={false}
          onCorte={(nro) =>
            window.location.assign(`/encargado/planillas-en-curso/${nro}/tarea/1/registrar`)
          }
          onDoblado={(nro) =>
            window.location.assign(`/encargado/planillas-en-curso/${nro}/tarea/2/registrar`)
          }
          onEmpaque={(nro) =>
            window.location.assign(`/encargado/planillas-en-curso/${nro}/tarea/3/registrar`)
          }
          modo="encargado"
        />
      ))}
    </div>
  );
}
