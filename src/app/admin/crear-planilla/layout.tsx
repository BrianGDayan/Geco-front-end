export default function CrearPlanillaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex justify-center pt-2 px-4">
      <div className="max-w-xl w-full">
        {children}
      </div>
    </main>
  );
}

