import { getPlanillasEnCurso } from '@/lib/planillas';
import PlanillaListAdmin from '@/components/PlanillaListAdmin';

export default async function PlanillasEnCursoPage() {
  const planillas = await getPlanillasEnCurso();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Planillas en Curso</h1>
      <PlanillaListAdmin planillas={planillas} tipo="en-curso" />
    </div>
  );
}
