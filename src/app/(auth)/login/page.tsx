"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import ModalError from "./ModalError";
import type { LoginDto } from "@/lib/auth";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [showError, setShowError] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dto: LoginDto = {
      idUsuario: Number(usuario),
      clave,
    };

    try {
      const res = await login(dto);
      if (res.rol === "admin" || res.rol === "encargado") {
        window.location.href = "/";
      }
    } catch (error: any) {
      setShowError(true);
    }
  };

  return (
    <div className="container mx-auto flex justify-center py-20 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Iniciar sesión en el sistema
        </h1>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="flex flex-col mb-4">
            <label htmlFor="username" className="text-lg">
              ID de usuario
            </label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="border border-gray-border text-gray-text rounded p-2 mt-1"
              required
            />
          </div>
          <div className="flex flex-col mb-6">
            <label htmlFor="password" className="text-lg">
              Contraseña
            </label>
            <input
              type="password"
              id="clave"
              name="clave"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              className="border border-gray-border rounded p-2 mt-1"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full text-xl bg-primary hover:bg-primary-dark text-white p-3 rounded-md transition-colors"
          >
            Ingresar
          </button>
        </form>

        <ModalError
          show={showError}
          onClose={() => setShowError(false)}
          mensaje="Error al iniciar sesión. Por favor, verifica tus credenciales."
        />
      </div>
    </div>
  );
}

