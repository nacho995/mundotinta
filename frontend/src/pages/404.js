import React from 'react';
import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-stone-950">
      <div className="text-center">
        <h1 className="text-6xl font-serif font-bold mb-6 text-amber-300">404</h1>
        <h2 className="text-2xl font-serif mb-8 text-stone-200">Página no encontrada</h2>
        <p className="text-stone-300 mb-8 max-w-lg mx-auto">
          Lo sentimos, la página que estás buscando no existe o ha sido movida a otra ubicación.
        </p>
        <Link 
          href="/"
          className="px-6 py-2 bg-gradient-to-r from-[#A0522D] to-[#8B4513] text-white font-semibold rounded-md shadow-md hover:from-[#8B4513] hover:to-[#A0522D] transition-all"
        >
          Volver a la página principal
        </Link>
      </div>
    </div>
  );
}
