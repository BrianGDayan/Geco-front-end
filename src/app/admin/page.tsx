import SelectorDeObras from "./SelectorDeObras";
import SelectorDeTareas from "./SelectorDeTareas";

export default function HomeAdmin() {
  return (
    <div className="mt-9 flex flex-col items-center min-h-screen">
      <h1 className="text-2xl font-semibold">Corte y doblado de hierro</h1>
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-16 mt-8 w-full max-w-7xl px-4">
        {/* Rendimiento por obra */}
        <div className="flex-1 bg-gray-100 p-6 rounded-xl shadow-md text-center">
          <h2 className="text-xl font-semibold mb-4">Rendimiento por obra</h2>
          <SelectorDeObras />
        </div>

        {/* Rendimiento por tarea */}
        <div className="flex-1 bg-gray-100 p-6 rounded-xl shadow-md text-center">
          <h2 className="text-xl font-semibold mb-4">Rendimiento por tarea</h2>
          <SelectorDeTareas />
        </div>
      </div>
    </div>
  );
}
