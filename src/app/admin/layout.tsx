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
        <div className="max-w-4xl w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

