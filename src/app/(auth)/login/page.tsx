"use client";

import { useState } from "react";
import { login, LoginDto } from "../../../lib/auth";
import ModalError from "./ModalError";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [showError, setShowError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dto: LoginDto = { idUsuario: Number(usuario), clave };

    try {
      const res = await login(dto);
      // redirigir según rol
      if (res.rol === "admin") window.location.href = "/admin";
      else if (res.rol === "encargado") window.location.href = "/encargado";
      else window.location.href = "/";
    } catch (err) {
      setShowError(true);
    }
  };

  return (
    <div className="container mx-auto flex justify-center py-20 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">Iniciar sesión</h1>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="ID Usuario"
            required
            className="border p-2 mb-4"
          />
          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            placeholder="Contraseña"
            required
            className="border p-2 mb-6"
          />
          <button type="submit" className="w-full p-3 bg-primary text-white rounded">Ingresar</button>
        </form>

        <ModalError show={showError} onClose={() => setShowError(false)} mensaje="Error al iniciar sesión." />
      </div>
    </div>
  );
}
