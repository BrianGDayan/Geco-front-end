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
      <p>Login page content goes here.</p>
      <button onClick={handleClick}>Ingresar</button>
    </div>
  );
}