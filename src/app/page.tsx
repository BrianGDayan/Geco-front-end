import Link from "next/link"

export default function Home() {
    const nroPlanilla = 10;
    return (
        <>
            <h1 className="text-3xl font-bold underline">Hello world!</h1>
            <Link href="/formulario-planilla">crear planilla</Link>
            <Link href="/planillas-actuales">ver planillas</Link>
            <Link href={`/planillas-actuales/${nroPlanilla}`}>planilla nro {nroPlanilla}</Link>
            <Link href="/">home</Link>
        </>
    ) 
}