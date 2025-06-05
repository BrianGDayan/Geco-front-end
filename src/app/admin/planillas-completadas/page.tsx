import { getPlanillasCompletadas } from '@/lib/planillas';
import PlanillaListAdmin from '@/components/PlanillaListAdmin';

export default async function PlanillasCompletadasPage() {
  const planillas = await getPlanillasCompletadas();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Planillas Completadas</h1>
      <PlanillaListAdmin planillas={planillas} tipo="completadas" />
    </div>
  );
}
