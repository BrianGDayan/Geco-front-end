'use client';

import { useState } from "react";
import PasoCabecera from "./PasoCabecera";
import PasoResumen from "./PasoResumen";
import { PlanillaDto, ElementoDto } from "@/lib/planillas";
import { AnimatePresence, motion } from "framer-motion";
import PasoElementos from "./PasoElementos";

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

  return (
    <div className="p-4 max-w-4xl mx-auto">
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
