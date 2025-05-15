export function formatearFecha(fechaString: string): string {
  const fecha = new Date(fechaString);
  return fecha.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}