import Image from "next/image";

export default function Header() {
    return (
        <header className="bg-primary text-white p-2">
            <div className="container mx-auto flex justify-between items-center">
                <Image
                    src="/img/logo.png"
                    alt="GECO logo"
                    width={150}
                    height={57}
                    className="rounded-full"
                />
                <h1 className="text-2xl font-bold">Sistema de control de gestión</h1>
            </div>
        </header>
    );
}