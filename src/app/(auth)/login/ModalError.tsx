"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ModalErrorProps {
  show: boolean;
  onClose: () => void;
  mensaje: string;
}

export default function ModalError({ show, onClose, mensaje }: ModalErrorProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg p-8 min-h-[150px] max-w-sm w-full flex flex-col justify-between"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="text-lg font-semibold mb-4">Error</h2>
            <p className="mb-6">{mensaje}</p>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
