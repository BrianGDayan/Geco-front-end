import { notFound } from "next/navigation";

export default async function RegistrosTarea( { params }: { params: Promise<{ nroPlanilla: string, idTarea: string }> } ) {
    const { nroPlanilla, idTarea } = await params;
    if (![1, 2, 3].includes(parseInt(idTarea))) {
        notFound();
    }
    return (
        <div>
        <h1>Registros de la planilla {nroPlanilla} para la tarea {idTarea}</h1>
        </div>
    );
} 