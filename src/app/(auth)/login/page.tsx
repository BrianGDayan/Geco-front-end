"use client";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const handleClick = () => {
    // Aquí puedes manejar la lógica de inicio de sesión
    console.log("Iniciar sesión");
    router.push("/")
  };
  return (
    <div>
      <h1>Iniciar sesión</h1>
      <button onClick={handleClick}>Ingresar</button>
    </div>
  );
}