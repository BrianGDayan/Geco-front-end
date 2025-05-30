'use client';

import { useState } from "react";
import { CreatePlanilla, PlanillaDto } from "@/lib/planillas";
import { useRouter } from "next/navigation";

interface PasoResumenProps {
  planilla: PlanillaDto;
  onBack: () => void;
}

export default function PasoResumen({ planilla, onBack }: PasoResumenProps) {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnviar = async () => {
    setEnviando(true);
    setError(null);
    try {
      const response = await CreatePlanilla(planilla);
      console.log("Planilla creada con éxito:", response);
      router.push("/admin/planillas");
    } catch (err: any) {
      console.error("Error al enviar la planilla:", err);
      setError("Ocurrió un error al enviar la planilla.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Resumen de la planilla</h2>

      <div className="border p-4 rounded-md bg-gray-50 space-y-1">
        <p><strong>Obra:</strong> {planilla.obra}</p>
        <p><strong>N° Planilla:</strong> {planilla.nroPlanilla}</p>
        <p><strong>N° Plano:</strong> {planilla.nroPlano}</p>
        <p><strong>Sector:</strong> {planilla.sector}</p>
        <p><strong>Item:</strong> {planilla.item}</p>
        <p><strong>Fecha:</strong> {new Date(planilla.fecha).toLocaleDateString()}</p>
        <p><strong>Elaborado por:</strong> {planilla.encargadoElaborar}</p>
        <p><strong>Revisado por:</strong> {planilla.encargadoRevisar}</p>
        <p><strong>Aprobado por:</strong> {planilla.encargadoAprobar}</p>
        <p><strong>Cantidad de elementos:</strong> {planilla.elemento.length}</p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100"
        >
          Volver
        </button>
        <button
          onClick={handleEnviar}
          disabled={enviando}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {enviando ? "Enviando..." : "Confirmar y Enviar"}
        </button>
      </div>
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
