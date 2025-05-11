'use client'; // Necesario para hooks como useState, useEffect (usados dentro de useBooks)

import React from 'react';
import BookCard from '@/components/BookCard';
// import { placeholderBooks } from '@/data/placeholderBooks'; // Ya no usaremos placeholderBooks
import useBooks from '../../hooks/useBooks'; // Importar el hook

export default function BibliotecaPage() {
  const { books, isLoading, error } = useBooks(); // Usar el hook

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-12 lg:p-24 bg-stone-900 text-white">
      <div className="w-full max-w-7xl">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-center mb-12 md:mb-16 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">
          Nuestra Biblioteca
        </h1>
        
        <p className="text-center text-lg text-stone-300 mb-12 md:mb-16 max-w-3xl mx-auto font-serif tracking-wide">
          Sumérgete en nuestra colección de mundos fantásticos y futuros distópicos. Cada libro es una nueva aventura esperando ser descubierta.
        </p>

        {isLoading && (
          <p className="text-center text-xl text-amber-300 font-serif">Cargando libros...</p>
        )}

        {error && (
          <p className="text-center text-xl text-red-400 font-serif">Error al cargar los libros: {error}</p>
        )}

        {!isLoading && !error && books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
            {books.map((book) => (
              // Asegúrate de que BookCard espera un prop llamado 'book'
              // y que la key sea única, por ejemplo book._id si viene del backend
              <div key={book._id} className="group transform hover:scale-105 transition-all duration-300">
                <div className="relative rounded-lg overflow-hidden shadow-2xl h-full bg-stone-800 border border-amber-700/20">
                  <BookCard book={book} />
                </div>
              </div>
            ))}
          </div>
        ) : null}
        
        {!isLoading && !error && books.length === 0 && (
          <p className="text-center text-xl text-stone-400">Nuestra biblioteca está creciendo o no se encontraron libros. ¡Vuelve pronto!</p>
        )}
      </div>
    </main>
  );
} 