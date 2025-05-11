'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Asegúrate de que esta URL sea la correcta para tu backend
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Por favor, ingresa tu correo y contraseña.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al intentar iniciar sesión.');
      }

      // Guardar el token (puedes usar localStorage o context API)
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        // console.log('Login exitoso, token:', data.token);
        router.push('/my-books'); // Redirigir a la página de Mis Libros
      } else {
        throw new Error(data.message || 'No se recibió token del servidor.');
      }

    } catch (err) {
      console.error('Error en login:', err);
      setError(err.message || 'No se pudo conectar al servidor o hubo un error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main 
      className="flex min-h-screen flex-col items-center justify-center p-8 md:p-12 lg:p-24 bg-stone-950 text-white"
      style={{
        // Textura de papel sutil (SVG)
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239a8478' fill-opacity='0.09'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundColor: '#1c1a17', // Un color base piedra oscuro para el fondo
      }}
    >
      <div className="w-full max-w-sm bg-stone-900/90 backdrop-blur-sm p-8 md:p-10 rounded-xl shadow-2xl border border-amber-700/30">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
          Iniciar Sesión
        </h1>
        <div className="w-24 h-px bg-gradient-to-r from-amber-600/0 via-amber-500 to-amber-600/0 mx-auto mb-8"></div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-300 mb-1 font-serif">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-stone-800/70 border border-amber-700/40 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:shadow-md focus:shadow-amber-500/30 transition-all placeholder-stone-500 text-stone-200"
              placeholder="tu@email.com"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-300 mb-1 font-serif">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-stone-800/70 border border-amber-700/40 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:shadow-md focus:shadow-amber-500/30 transition-all placeholder-stone-500 text-stone-200"
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <Link href="/forgot-password" className="font-medium text-amber-400 hover:text-amber-300 transition-colors">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-[1.02]"
            disabled={isLoading}
          >
            {isLoading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        {error && <p className="mt-4 text-center text-sm text-red-400 font-serif">{error}</p>}
        <p className="mt-8 text-center text-sm text-stone-400 font-serif">
          ¿No tienes una cuenta?{' '}
          <Link href="/registro" className="font-medium text-amber-400 hover:text-amber-300 transition-colors">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </main>
  );
} 