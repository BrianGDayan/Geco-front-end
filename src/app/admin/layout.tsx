import Navbar from "./Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex justify-center p-6">
        {/* Aquí subimos de max-w-4xl a max-w-7xl */}
        <div className="max-w-7xl w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
