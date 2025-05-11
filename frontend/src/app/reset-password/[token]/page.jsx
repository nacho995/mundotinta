'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // useParams para leer el token de la URL
import Link from 'next/link';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValidating, setIsTokenValidating] = useState(true);

  const params = useParams(); // Hook para acceder a los parámetros de la ruta
  const router = useRouter();

  useEffect(() => {
    if (params?.token) {
      setToken(params.token);
      // Aquí podrías añadir una llamada al backend para validar el token si es necesario,
      // pero usualmente la validación se hace al enviar el formulario de nueva contraseña.
      // Por ahora, solo asumimos que si hay token, intentamos mostrar el form.
      setIsTokenValidating(false);
    } else {
      setIsTokenValidating(false); // No hay token en la URL
      setError('Token de reseteo no proporcionado en la URL.');
    }
  }, [params]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    if (!token) {
      setError('Token de reseteo no encontrado o inválido.');
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setIsLoading(false);
      return;
    }
    if (!password) {
      setError('Por favor, ingresa tu nueva contraseña.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, confirmPassword }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Algo salió mal al resetear la contraseña');
      }
      
      setMessage(data.message || 'Contraseña actualizada con éxito. Serás redirigido al login.');
      setPassword('');
      setConfirmPassword('');
      // Aquí podrías guardar el nuevo token (data.token) si el backend lo devuelve y loguea automáticamente
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      console.error('Error en resetPassword:', err);
      setError(err.message || 'Error al actualizar la contraseña.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isTokenValidating) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-stone-950 text-white">
            <p className="font-serif text-amber-400">Verificando token...</p>
        </main>
    );
  }

  return (
    <main 
      className="flex min-h-screen flex-col items-center justify-center p-8 md:p-12 lg:p-24 bg-stone-950 text-white"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239a8478' fill-opacity='0.09'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundColor: '#1c1a17',
      }}
    >
      <div className="w-full max-w-sm bg-stone-900/90 backdrop-blur-sm p-8 md:p-10 rounded-xl shadow-2xl border border-amber-700/30">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
          Restablecer Contraseña
        </h1>
        <div className="w-24 h-px bg-gradient-to-r from-amber-600/0 via-amber-500 to-amber-600/0 mx-auto mb-8"></div>
        
        {token && !error && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-300 mb-1 font-serif">
                Nueva Contraseña
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-stone-800/70 border border-amber-700/40 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:shadow-md focus:shadow-amber-500/30 transition-all placeholder-stone-500 text-stone-200"
                placeholder="Mínimo 6 caracteres"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-300 mb-1 font-serif">
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 bg-stone-800/70 border border-amber-700/40 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:shadow-md focus:shadow-amber-500/30 transition-all placeholder-stone-500 text-stone-200"
                placeholder="Repite tu nueva contraseña"
                required
                disabled={isLoading}
              />
            </div>

            {message && <p className="text-sm text-green-400 font-serif py-2">{message}</p>}
            {error && <p className="text-sm text-red-400 font-serif py-2">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
            </button>
          </form>
        )}
        {error && !token && <p className="text-center text-red-400 font-serif py-2">{error}</p>}
        {!token && !isTokenValidating && !error && (
            <p className="text-center text-red-400 font-serif py-2">Token inválido o no proporcionado en la URL.</p>
        )}

        <p className="mt-8 text-center text-sm text-stone-400 font-serif">
          <Link href="/login" className="font-medium text-amber-400 hover:text-amber-300 transition-colors">
            Volver a Iniciar Sesión
          </Link>
        </p>
      </div>
    </main>
  );
} 