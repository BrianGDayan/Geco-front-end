'use client';

import { PlanillaDto } from "@/lib/planillas";
import { ChangeEvent, useState } from "react";

interface PasoCabeceraProps {
  cabecera: Omit<PlanillaDto, "elemento">;
  setCabecera: (data: Omit<PlanillaDto, "elemento">) => void;
  onNext: () => void;
}

export default function PasoCabecera({
  cabecera,
  setCabecera,
  onNext,
}: PasoCabeceraProps) {
  const [error, setError] = useState("");
  const [errorFecha, setErrorFecha] = useState("");
  const [camposInvalidos, setCamposInvalidos] = useState<string[]>([]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCabecera({ ...cabecera, [name]: value });
  };

  const validarYContinuar = () => {
    const camposObligatorios: (keyof Omit<PlanillaDto, "elemento">)[] = [
      "nroPlanilla",
      "obra",
      "nroPlano",
      "sector",
      "encargadoElaborar",
      "encargadoRevisar",
      "item",
      "fecha",
    ];

    const nuevosInvalidos = camposObligatorios.filter((campo) => {
      const valor = cabecera[campo];
      return (
        valor === undefined ||
        valor === null ||
        (typeof valor === "string" && valor.trim() === "")
      );
    });

    setCamposInvalidos(nuevosInvalidos);

    if (nuevosInvalidos.length > 0) {
      setError("Completá los campos obligatorios.");
      return;
    }

    const esFechaValida =
      cabecera.fecha instanceof Date && !isNaN(cabecera.fecha.getTime());

    if (!esFechaValida) {
      setErrorFecha("La fecha ingresada no es válida.");
      return;
    }

    setError("");
    setErrorFecha("");
    onNext();
  };

  const hoy = new Date().toISOString().split("T")[0];

  const esCampoInvalido = (campo: string) => camposInvalidos.includes(campo);

  return (
    <div>
      <h1 className="text-2xl font-bold text-center">Ingrese los datos de la planilla</h1>
      <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
        {/* Campo: Número de planilla */}
        <div className="flex flex-col mt-5">
          <label htmlFor="nroPlanilla" className="text-lg">Número de planilla</label>
          <input
            type="text"
            id="nroPlanilla"
            name="nroPlanilla"
            value={cabecera.nroPlanilla}
            onChange={handleChange}
            className={`border rounded p-2 mt-1 ${esCampoInvalido("nroPlanilla") ? "border-red-500" : "border-gray-border"}`}
            maxLength={30}
            required
          />
        </div>

        {/* Campo: Obra */}
        <div className="flex flex-col mt-4">
          <label htmlFor="obra" className="text-lg">Obra</label>
          <input
            type="text"
            id="obra"
            name="obra"
            value={cabecera.obra}
            onChange={handleChange}
            className={`border rounded p-2 mt-1 ${esCampoInvalido("obra") ? "border-red-500" : "border-gray-border"}`}
            maxLength={30}
            required
          />
        </div>

        {/* Campo: Número de plano */}
        <div className="flex flex-col mt-4">
          <label htmlFor="nroPlano" className="text-lg">Número de plano</label>
          <input
            type="text"
            id="nroPlano"
            name="nroPlano"
            value={cabecera.nroPlano}
            onChange={handleChange}
            className={`border rounded p-2 mt-1 ${esCampoInvalido("nroPlano") ? "border-red-500" : "border-gray-border"}`}
            maxLength={30}
            required
          />
        </div>

        {/* Campo: Sector */}
        <div className="flex flex-col mt-4">
          <label htmlFor="sector" className="text-lg">Sector</label>
          <input
            type="text"
            id="sector"
            name="sector"
            value={cabecera.sector}
            onChange={handleChange}
            className={`border rounded p-2 mt-1 ${esCampoInvalido("sector") ? "border-red-500" : "border-gray-border"}`}
            maxLength={30}
            required
          />
        </div>

        {/* Campo: Encargado de elaborar */}
        <div className="flex flex-col mt-4">
          <label htmlFor="encargadoElaborar" className="text-lg">Encargado de elaborar</label>
          <input
            type="text"
            id="encargadoElaborar"
            name="encargadoElaborar"
            value={cabecera.encargadoElaborar}
            onChange={handleChange}
            className={`border rounded p-2 mt-1 ${esCampoInvalido("encargadoElaborar") ? "border-red-500" : "border-gray-border"}`}
            maxLength={5}
            required
          />
        </div>

        {/* Campo: Encargado de revisar */}
        <div className="flex flex-col mt-4">
          <label htmlFor="encargadoRevisar" className="text-lg">Encargado de revisar</label>
          <input
            type="text"
            id="encargadoRevisar"
            name="encargadoRevisar"
            value={cabecera.encargadoRevisar}
            onChange={handleChange}
            className={`border rounded p-2 mt-1 ${esCampoInvalido("encargadoRevisar") ? "border-red-500" : "border-gray-border"}`}
            maxLength={5}
            required
          />
        </div>

        {/* Campo: Encargado de aprobar */}
        <div className="flex flex-col mt-4">
          <label htmlFor="encargadoAprobar" className="text-lg">Encargado de aprobar</label>
          <input
            type="text"
            id="encargadoAprobar"
            name="encargadoAprobar"
            value={cabecera.encargadoAprobar}
            onChange={handleChange}
            className="border border-gray-border rounded p-2 mt-1"
            maxLength={5}
          />
        </div>

        {/* Campo: Fecha */}
        <div className="flex flex-col mt-4">
          <label htmlFor="fecha" className="text-lg">Fecha</label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            max={hoy}
            value={cabecera.fecha ? cabecera.fecha.toISOString().split("T")[0] : ""}
            onChange={(e) => {
              const nuevaFecha = e.target.value ? new Date(e.target.value) : null;
              setCabecera({ ...cabecera, fecha: nuevaFecha as Date });
            }}
            className={`border rounded p-2 mt-1 ${esCampoInvalido("fecha") || errorFecha ? "border-red-500" : "border-gray-border"}`}
            required
          />
          {errorFecha && <p className="text-red-500 text-sm mt-1">{errorFecha}</p>}
        </div>

        {/* Campo: Item */}
        <div className="flex flex-col mt-4">
          <label htmlFor="item" className="text-lg">Item</label>
          <input
            type="text"
            id="item"
            name="item"
            value={cabecera.item}
            onChange={handleChange}
            className={`border rounded p-2 mt-1 ${esCampoInvalido("item") ? "border-red-500" : "border-gray-border"}`}
            maxLength={20}
            required
          />
        </div>

        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

        <button
          type="button"
          onClick={validarYContinuar}
          className="flex justify-center mt-5 text-xl bg-primary hover:bg-primary-dark text-white p-3 rounded-md"
        >
          Siguiente
        </button>
      </form>
    </div>
  );
}
