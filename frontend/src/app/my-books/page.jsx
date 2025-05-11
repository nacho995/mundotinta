'use client';

import React from 'react';
import Link from 'next/link';

export default function MyBooksPage() {
  // En el futuro, aquí podrías obtener y mostrar los libros del usuario.
  // También podrías querer verificar si el usuario está autenticado antes de mostrar esta página.

  return (
    <main 
      className="flex min-h-screen flex-col items-center justify-center p-8 md:p-12 lg:p-24 bg-stone-950 text-white"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239a8478' fill-opacity='0.09'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundColor: '#1c1a17',
      }}
    >
      <div className="w-full max-w-2xl bg-stone-900/90 backdrop-blur-sm p-8 md:p-10 rounded-xl shadow-2xl border border-amber-700/30 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
          Mis Libros
        </h1>
        <div className="w-32 h-px bg-gradient-to-r from-amber-600/0 via-amber-500 to-amber-600/0 mx-auto mb-8"></div>
        <p className="text-lg text-stone-300 mb-8 font-serif">
          ¡Bienvenido a tu biblioteca personal! Aquí podrás ver y gestionar tus libros.
        </p>
        <p className="text-md text-stone-400 mb-4">
          (Próximamente: listado de libros, opciones para añadir nuevos, etc.)
        </p>
        <Link href="/" className="font-medium text-amber-400 hover:text-amber-300 transition-colors">
          Volver a la página principal
        </Link>
      </div>
    </main>
  );
} 