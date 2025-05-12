'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiService } from '@/services/api';

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    booksCount: 0,
    favoritesCount: 0,
    memberSince: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Función para cargar el perfil del usuario
  const loadUserProfile = async () => {
    setIsLoading(true);
    try {
      const profile = await apiService.getUserProfile();
      setUserProfile(profile);
      setError(null);
    } catch (err) {
      console.error('Error al obtener el perfil:', err);
      setError('No se pudo cargar tu perfil. Por favor, intenta nuevamente más tarde.');
      
      // Si el error es de autenticación, redirigir al login
      if (err.message.includes('autenticación')) {
        router.push('/login');
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Verificar autenticación y obtener datos del usuario
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      // Si no hay token, redirigir al login
      router.push('/login');
      return;
    }
    
    // Cargar el perfil del usuario
    loadUserProfile();
  }, [router]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-950">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mb-4"></div>
          <div className="text-amber-500 text-xl">Cargando tu perfil...</div>
        </div>
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
      <div className="w-full max-w-2xl bg-stone-900/90 backdrop-blur-sm p-8 md:p-10 rounded-xl shadow-2xl border border-amber-700/30">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
            Mi Perfil
          </h1>
          <div className="w-32 h-px bg-gradient-to-r from-amber-600/0 via-amber-500 to-amber-600/0 mx-auto mb-8"></div>
        </div>
        
        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 p-6 flex flex-col items-center justify-center space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="text-red-400 text-lg text-center">{error}</p>
            <button 
              onClick={loadUserProfile}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-md transition-colors"
            >
              Intentar nuevamente
            </button>
          </div>
        )}
        
        {!error && (
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32 mx-auto overflow-hidden">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-800 to-amber-950 border border-amber-700/50 flex items-center justify-center transform hover:scale-105 transition-transform duration-300 shadow-md">
                  <span className="text-4xl font-serif text-amber-300">{userProfile.name?.charAt(0).toUpperCase() || '?'}</span>
                </div>
              </div>
              
              {/* Fecha de registro */}
              {userProfile.memberSince && (
                <div className="mt-3 text-xs text-center text-stone-400">
                  Miembro desde {new Date(userProfile.memberSince).toLocaleDateString()}
                </div>
              )}
            </div>
            
            {/* Información del usuario */}
            <div className="flex-grow">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-serif text-amber-400 mb-2">Información Personal</h2>
                  <div className="bg-stone-800/60 border border-amber-800/20 rounded-lg p-4 space-y-4 shadow-sm">
                    <div>
                      <label className="block text-sm font-medium text-stone-400 mb-1">Nombre de usuario</label>
                      <p className="text-lg text-stone-200">{userProfile.name || 'No disponible'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-400 mb-1">Correo electrónico</label>
                      <p className="text-lg text-stone-200">{userProfile.email || 'No disponible'}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-serif text-amber-400 mb-2">Estadísticas</h2>
                  <div className="bg-stone-800/60 border border-amber-800/20 rounded-lg p-4 shadow-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-stone-400 mb-1">Libros en biblioteca</label>
                        <p className="text-lg text-stone-200">{userProfile.booksCount || 0}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-400 mb-1">Libros favoritos</label>
                        <p className="text-lg text-stone-200">{userProfile.favoritesCount || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Acciones de usuario */}
                <div className="mt-4">
                  <div className="flex flex-col space-y-2">
                    <Link 
                      href="/my-books" 
                      className="w-full py-2 px-4 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-md text-center transition-colors"
                    >
                      Ver mis libros
                    </Link>
                    <Link 
                      href="/favorites" 
                      className="w-full py-2 px-4 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-md text-center transition-colors"
                    >
                      Ver mis favoritos
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Botones de acción */}
        <div className="mt-10 pt-6 border-t border-stone-700/50 flex flex-col md:flex-row justify-center md:justify-between items-center gap-4">
          <div className="flex space-x-4">
            <Link 
              href="/my-books" 
              className="font-medium text-amber-400 hover:text-amber-300 transition-colors"
            >
              Mis Libros
            </Link>
            <span className="text-stone-600">•</span>
            <Link 
              href="/favorites" 
              className="font-medium text-amber-400 hover:text-amber-300 transition-colors"
            >
              Favoritos
            </Link>
          </div>
          
          <button
            onClick={() => {
              localStorage.removeItem('authToken');
              localStorage.removeItem('userName');
              window.dispatchEvent(new Event('auth-state-changed'));
              router.push('/');
            }}
            className="px-4 py-2 bg-red-900/80 hover:bg-red-800 text-white text-sm font-medium rounded-md transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </main>
  );
}
