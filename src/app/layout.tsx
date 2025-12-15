import { TimersProvider } from "../hooks/useTimers";
import "./globals.css";
import Header from "./Header";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Sistema de control de gestion",
  description: "Control de gestion de la empresa GECO",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
     <TimersProvider>
        <body className="font-sans bg-gray-bg overflow-x-hidden">
          <Header />
          {children}
        </body>
      </TimersProvider>
    </html>
  );
}
