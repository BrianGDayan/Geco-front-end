export default function EncargadoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="flex flex-col w-full max-w-4xl px-4 sm:px-6 py-4 mx-auto">
        {children}
      </main>
    </div>
  );
}
