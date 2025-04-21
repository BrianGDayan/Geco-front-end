import Navbar from "./navbar";

export default function AuthLayout({ 
    children, 
}: { 
    children: React.ReactNode; 
}) {
    return (
        <div>
            <Navbar />
            <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                {children}
            </main>
        </div>
        
    );
}
