import Navbar from "./Navbar";

export default function AuthLayout({ 
    children, 
}: { 
    children: React.ReactNode; 
}) {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="flex flex-col items-center justify-center p-4">
                {children}
            </main>
        </div>
    );
}
