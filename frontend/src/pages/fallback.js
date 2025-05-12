import { useEffect } from 'react';
import { useRouter } from 'next/router';

// Esta página solo redirige al usuario a la ruta / del App Router
export default function PagesHome() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/');
  }, [router]);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-950 text-white">
      <p className="text-amber-300 text-lg">Redirigiendo...</p>
    </div>
  );
}
