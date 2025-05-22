"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarLinkProps {
  href: string;
  children: React.ReactNode;
  isDropdown?: boolean;
}

export function NavbarLink({ href, children, isDropdown = false }: NavbarLinkProps) {
  const pathname = usePathname();
  const active = pathname === href;

  const baseClasses = isDropdown
    ? "block px-4 py-2 rounded"
    : "px-4 py-2 rounded-md";

  const activeClasses = isDropdown
    ? active
      ? "bg-primary-light font-semibold"
      : "hover:bg-primary-light"
    : active
    ? "bg-primary-dark font-bold"
    : "hover:bg-primary-dark";

  return (
    <Link
      href={href}
      className={`${baseClasses} ${activeClasses} transition-colors duration-200`}
    >
      {children}
    </Link>
  );
}
