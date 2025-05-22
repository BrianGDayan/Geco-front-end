import SelectorDeObras from "./SelectorDeObras";

export default function homeAdmin() {
    return (
    <div className="mt-9 flex flex-col items-center h-screen">
      <h1 className="text-2xl font-semibold">Corte y doblado de hierro</h1>
      <div className="flex gap-32">
        <div className="bg-gray-100 p-6 rounded-xl shadow-md w-[720px] text-center">
          <h2 className="text-xl font-semibold mb-2">Rendimiento por obra</h2>
          <SelectorDeObras />
        </div>
        <div className="bg-gray-100 p-6 rounded-xl shadow-md w-[720px] text-center">
          <h2 className="text-xl font-semibold mb-2">Rendimiento por tarea</h2>
        
        </div>
      </div>
    </div>
  );
}