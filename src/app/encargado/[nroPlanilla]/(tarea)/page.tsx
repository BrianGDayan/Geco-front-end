// app/encargado/planillas-en-curso/[nroPlanilla]/tarea/[idTarea]/registrar/page.tsx
import { getPlanillaByNro } from '@/lib/planillas';
import RegistroVista from '@/components/RegistroVista';

interface Params {
  params: {
    nroPlanilla: string;
    idTarea: string;
  };
}

export default async function RegistrarDatosPage({ params }: Params) {
  const { nroPlanilla, idTarea } = params;
  const planilla = await getPlanillaByNro(nroPlanilla, Number(idTarea));

  return (
    <div className="min-h-screen bg-gray-bg">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <RegistroVista planilla={planilla} />
      </div>
    </div>
  );
}
