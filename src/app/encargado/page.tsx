import { getPlanillasEnCurso } from '@/lib/planillas';
import PlanillaListEncargado from '@/components/PlanillaListEncargado';

export default async function HomeEncargadoPage() {
  const planillas = await getPlanillasEnCurso();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Planillas en Curso (Encargado)</h1>
      <PlanillaListEncargado planillas={planillas} />
    </div>
  );
}
