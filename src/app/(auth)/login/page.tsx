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
    <div className="mt-9 flex flex-col items-center h-screen">
      <h1 className="text-2xl font-semibold">Iniciar sesión en el sistema</h1>
      <form className="flex flex-col" action="" method="post">
        <div className="flex flex-col mt-5">
          <label htmlFor="username" className="text-lg">ID de usuario</label>
          <input type="text" id="username" name="username" className="border border-gray-border text-gray-text rounded p-2 mt-1" required />
        </div>
        <div className="flex flex-col mt-4">
          <label htmlFor="password" className="text-lg">Contraseña</label>
          <input type="password" id="password" name="password" className="border border-gray-border rounded p-2 mt-1" required />
        </div>
        <button className="flex justify-center mt-5 text-xl bg-primary hover:bg-primary-dark text-white p-3 rounded-md" onClick={handleClick}>Ingresar</button>
      </form>
    </div>
  );
}