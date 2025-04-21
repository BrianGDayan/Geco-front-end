import { redirect } from 'next/navigation';

export default function Home() {
    const nroPlanilla = 10;
    return (
        redirect('/login')
    ) 
}