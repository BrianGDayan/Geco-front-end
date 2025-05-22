"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import type { LoginDto } from "@/lib/auth"

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dto: LoginDto = {
      idUsuario: Number(usuario),
      clave
    }
    try {
      const res = await login(dto);
      console.log("Login exitoso", res);
      if (res.rol === "admin") {
        router.push("/admin");
      }
      else if (res.rol === "encargado") {
        router.push("/encargado");
      }
    }
    catch (error) {
      console.error("Error al iniciar sesión", error);
      alert("Error al iniciar sesión. Por favor, verifica tus credenciales.");
    } finally {
      setUsuario("");
      setClave("");
    }
  }
  return (
    <div className="mt-9 flex flex-col items-center h-screen">
      <h1 className="text-2xl font-semibold">Iniciar sesión en el sistema</h1>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="flex flex-col mt-5">
          <label htmlFor="username" className="text-lg">ID de usuario</label>
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
        <div className="flex flex-col mt-4">
          <label htmlFor="password" className="text-lg">Contraseña</label>
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
          className="flex justify-center mt-5 text-xl bg-primary hover:bg-primary-dark text-white p-3 rounded-md"
          >
            Ingresar
        </button>
      </form>
    </div>
  );
}