
export default function EncargadoLayout({ 
    children, 
}: { 
    children: React.ReactNode; 
}) {
    return (
        <div className="min-h-screen bg-gray-100">
            <main className="flex flex-col items-center justify-center p-4">
                {children}
            </main>
        </div>
    );
}
