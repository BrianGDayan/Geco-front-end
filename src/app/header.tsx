import Image from "next/image";

export default function Header() {
    return (
        <header className="bg-primary-dark text-white p-1">
            <div className="container mr-auto flex justify-between items-center">
                <Image
                    src="/img/logo.png"
                    alt="GECO logo"
                    width={180}
                    height={52}
                    className="w-auto h-auto"
                />
                <h1 className="text-3xl font-bold mx-auto flex justify-center" >Sistema de control de gestión</h1>
            </div>
        </header>
    );
}