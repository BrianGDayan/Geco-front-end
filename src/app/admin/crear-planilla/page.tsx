'use client';

import { useState } from "react";
import PasoCabecera from "./PasoCabecera";
import PasoResumen from "./PasoResumen";
import { PlanillaDto, ElementoDto, DetalleDto } from "../../../lib/planillas";
import { AnimatePresence, motion } from "framer-motion";
import PasoElementos from "./PasoElementos";
import * as XLSX from "xlsx";

type ParseResult = {
  cabeceraPartial: Partial<Omit<PlanillaDto, "elemento">>;
  elementos: ElementoDto[];
};

async function parseExcelFile(file: File): Promise<ParseResult> {
  const ab = await file.arrayBuffer();
  const wb = XLSX.read(ab, { type: "array", cellDates: true });
  const ws = wb.Sheets[wb.SheetNames[0]];

  const get = (col: string, row: number) => {
    const v = ws[`${col}${row}`];
    return v ? v.v : undefined;
  };

  const excelDateToJs = (v: any) => {
    if (v == null) return undefined;
    if (v instanceof Date) return v;
    if (typeof v === "number") {
      // Excel serial date -> JS Date
      return new Date(Math.round((v - 25569) * 86400 * 1000));
    }
    const d = new Date(String(v));
    return isNaN(d.getTime()) ? undefined : d;
  };

  // Cabecera mapeada (según tu correspondencia)
  const cabeceraPartial: Partial<Omit<PlanillaDto, "elemento">> = {
    sector: String(get("C", 4) ?? "")?.trim() || "",
    nroPlano: String(get("F", 4) ?? "")?.trim() || "",
    encargadoElaborar: String(get("C", 5) ?? "")?.trim() || "",
    encargadoRevisar: String(get("C", 6) ?? "")?.trim() || "",
    encargadoAprobar: String(get("F", 5) ?? "")?.trim() || "",
    fecha: excelDateToJs(get("F", 6)) ?? new Date(),
    item: String(get("A", 17) ?? "")?.trim() || "",
    nroPlanilla: "", // queda vacío: header de impresión (no leído)
    obra: "", // idem
  };

  // Elementos y detalles (desde fila 17)
  const elementos: ElementoDto[] = [];
  let currentElementIndex = -1;
  let currentElementName: string | undefined;

  for (let r = 17; r <= 2000; r++) {
    const rawB = get("B", r);
    const rawC = get("C", r);
    const rawD = get("D", r);
    const rawE = get("E", r);
    const rawF = get("F", r);
    const rawG = get("G", r);
    const rawH = get("H", r);
    const rawI = get("I", r);

    const allEmpty =
      (rawB === undefined || String(rawB).trim() === "") &&
      (rawC === undefined || String(rawC).trim() === "") &&
      (rawD === undefined || String(rawD).trim() === "") &&
      (rawE === undefined || String(rawE).trim() === "") &&
      (rawF === undefined || String(rawF).trim() === "") &&
      (rawG === undefined || String(rawG).trim() === "") &&
      (rawH === undefined || String(rawH).trim() === "") &&
      (rawI === undefined || String(rawI).trim() === "");

    if (allEmpty) {
      // si llegamos a una fila vacía y no hay elemento en curso, cortamos.
      if (currentElementIndex === -1) return { cabeceraPartial, elementos };
      // si ya hubo elementos y encontramos fila totalmente vacía terminamos.
      break;
    }

    // Nombre de elemento: si en B hay valor lo usamos como nuevo elemento,
    // si está vacío asumimos continuación del elemento anterior (celdas merged).
    if (rawB !== undefined && String(rawB).trim() !== "") {
      currentElementName = String(rawB).trim();
      elementos.push({ nombre: currentElementName, detalle: [] });
      currentElementIndex = elementos.length - 1;
    } else if (currentElementIndex === -1) {
      // fila con detalle pero sin elemento asignado aún -> ignorar
      continue;
    }

    // Mapeo de detalle por columna
    const detalle: DetalleDto = {
      especificacion: "", // string vacío, ya no undefined
      posicion: rawD !== undefined ? String(rawD).trim() : "",
      tipo: rawE !== undefined && String(rawE).trim() !== "" ? Number(rawE) : 0,
      medidaDiametro: rawF !== undefined && String(rawF).trim() !== "" ? parseInt(String(rawF), 10) : 0,
      longitudCorte: rawG !== undefined && String(rawG).trim() !== "" ? Number(rawG) : 0,
      cantidadUnitaria: rawH !== undefined && String(rawH).trim() !== "" ? Number(rawH) : 0,
      nroElementos: rawI !== undefined && String(rawI).trim() !== "" ? parseInt(String(rawI), 10) : 0,
    };

    elementos[currentElementIndex].detalle.push(detalle);
  }

  return { cabeceraPartial, elementos };
}

export default function CrearPlanillaPage() {
  const [paso, setPaso] = useState(1);
  const [cabecera, setCabecera] = useState<Omit<PlanillaDto, "elemento">>({
    nroPlanilla: "",
    obra: "",
    nroPlano: "",
    sector: "",
    encargadoElaborar: "",
    encargadoRevisar: "",
    encargadoAprobar: "",
    fecha: new Date(),
    item: "",
  });

  const [elementos, setElementos] = useState<ElementoDto[]>([]);

  const siguientePaso = () => setPaso((p) => p + 1);
  const pasoAnterior = () => setPaso((p) => p - 1);

  const variants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { cabeceraPartial, elementos: parsed } = await parseExcelFile(file);
      setCabecera((prev) => ({ ...prev, ...cabeceraPartial }));
      if (parsed.length > 0) setElementos(parsed);
    } catch (err) {
      console.error("Error parseando Excel", err);
      window.alert("No se pudo leer el Excel. Revisa el archivo.");
    } finally {
      const input = e.target as HTMLInputElement;
      if (input) input.value = ""; 
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* IMPORT: botón para importar Excel */}
      <div className="flex justify-end mb-4">
        <label className="cursor-pointer px-3 py-2 border rounded bg-white">
          Importar Excel
          <input
            type="file"
            accept=".xlsx, .xls"
            className="hidden"
            onChange={onFileSelected}
          />
        </label>
      </div>

      <AnimatePresence mode="wait">
        {paso === 1 && (
          <motion.div
            key="paso1"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.3 }}
          >
            <PasoCabecera
              cabecera={cabecera}
              setCabecera={setCabecera}
              onNext={siguientePaso}
            />
          </motion.div>
        )}

        {paso === 2 && (
          <motion.div
            key="paso2"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.3 }}
          >
            <PasoElementos
              item={cabecera.item}
              elementos={elementos}
              setElementos={setElementos}
              onNext={siguientePaso}
              onBack={pasoAnterior}
            />
          </motion.div>
        )}

        {paso === 3 && (
          <motion.div
            key="paso3"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.3 }}
          >
           <PasoResumen
            planilla={{
              ...cabecera,
              elemento: elementos,
            }}
            onBack={pasoAnterior}
          />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
