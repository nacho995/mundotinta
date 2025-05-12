import { useEffect } from 'react';
import { useRouter } from 'next/router';

// Esta página ya no es necesaria, redirigimos a la página principal
export default function LoginHelperRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirigir al usuario a la página principal
    router.push('/');
  }, [router]);
  
  // No renderizamos nada, ya que redirigimos inmediatamente
  return null;
}
