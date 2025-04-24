"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
    { name: "Crear planilla", href: "/formulario-planilla" },
    { name: "Listado de planillas", href: "/planillas-actuales" },
    { name: "Inicio", href: "/planillas-actuales" },
]


export default function Navbar() {
    const pathname = usePathname();
    return(
        <div className="flex flex-col h-screen">
            <nav className="bg-primary border border-gray-800 p-4">
                <ul className="flex space-x-4">
                    {navLinks.map((link) => {
                    const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/");
                    return (
                        <li key={link.name}>
                            <Link className={isActive ? "font-bold mr-4" : "text-gray-50 mr-4"} href={link.href} key={link.name}>
                                {link.name}
                            </Link>
                        </li>
                    )
                    })}
                </ul>
            </nav>
        </div>
    )
}