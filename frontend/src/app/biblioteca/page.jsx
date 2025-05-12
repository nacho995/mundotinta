'use client'; // Necesario para hooks como useState, useEffect (usados dentro de useBooks)

import React, { useState, useEffect } from 'react';
import BookCard from '@/components/BookCard';
// import { placeholderBooks } from '@/data/placeholderBooks'; // Ya no usaremos placeholderBooks
import useBooks from '../../hooks/useBooks'; // Importar el hook

export default function BibliotecaPage() {
  const { books, isLoading, error } = useBooks(); // Usar el hook
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [activeGenre, setActiveGenre] = useState('Todos');
  
  // Filtrar los libros cuando cambia la lista o el género seleccionado
  useEffect(() => {
    if (!books || books.length === 0) {
      setFilteredBooks([]);
      return;
    }
    
    if (activeGenre === 'Todos') {
      setFilteredBooks(books);
    } else {
      setFilteredBooks(books.filter(book => book.genre === activeGenre));
    }
  }, [books, activeGenre]);

  return (
    <main className="flex min-h-screen flex-col items-center py-16 px-2 sm:px-6 md:px-8 bg-stone-900 text-white">
      <div className="w-full max-w-[1440px]">
        {/* Cabecera con título y elementos decorativos */}
        <div className="text-center mb-16 relative">
          <div className="inline-block relative mb-4">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">
              Nuestra Biblioteca
            </h1>
            <div className="absolute -inset-1 blur-xl bg-[#b87333]/10 -z-10 rounded-lg"></div>
          </div>
          
          {/* Separador decorativo */}
          <div className="flex justify-center gap-8 my-4 items-center">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-600/50 to-transparent"></div>
            <div className="text-amber-600/60 font-serif text-lg">✧</div>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-600/50 to-transparent"></div>
          </div>
          
          <p className="text-center text-lg text-stone-300 mt-6 max-w-3xl mx-auto font-serif tracking-wide leading-relaxed">
            Sumérgete en nuestra colección de mundos fantásticos y futuros distópicos. 
            Cada libro es una nueva aventura esperando ser descubierta.
          </p>
        </div>
        
        {/* Filtros de género con estilo temático */}
        {!isLoading && !error && books.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mb-14">
            {['Todos', 'Fantasía', 'Ciencia Ficción'].map((genre) => (
              <button
                key={genre}
                onClick={() => setActiveGenre(genre)}
                className={`group relative px-6 py-2 
                  ${activeGenre === genre 
                    ? 'bg-stone-800/90 text-amber-300 border-b border-amber-500' 
                    : 'bg-stone-900/80 text-stone-400 hover:text-amber-300 border-b border-stone-700 hover:border-amber-600/50'} 
                  transition-all duration-500 font-serif tracking-wide rounded-sm shadow-md overflow-hidden transform hover:scale-105`}
              >
                {/* Efecto de brillo que se desplaza */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-amber-600/0 via-amber-600/20 to-amber-600/0 opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000"></span>
                
                {/* Resplandor de borde */}
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                      style={{ boxShadow: "inset 0 0 5px rgba(184,115,51,0.5)" }}></span>
                
                <span className="relative z-10">{genre}</span>
              </button>
            ))}
          </div>
        )}

        {/* Estados de carga y error */}
        {isLoading && (
          <div className="text-center py-16 px-4 max-w-2xl mx-auto">
            <div className="relative bg-gradient-to-b from-stone-800 to-stone-900 border border-amber-700/30 rounded-lg px-8 py-10 shadow-md">
              {/* Efecto de brillo pulsante en los bordes */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-700/0 via-amber-700/30 to-amber-700/0 rounded-lg -z-10 blur-sm animate-pulse"></div>
              
              <div className="mb-6 relative">
                {/* Animación de carga con estilo de libro */}
                <div className="w-16 h-20 mx-auto bg-stone-700 rounded-r relative overflow-hidden flex items-center justify-center">
                  {/* Páginas del libro */}
                  <div className="w-14 h-16 bg-stone-200 absolute animate-pulse"></div>
                  {/* Brillo que se mueve */}
                  <div className="w-full h-full bg-gradient-to-r from-transparent via-amber-200/20 to-transparent absolute animate-[shimmer_2s_infinite] -translate-x-full" 
                       style={{ animationTimingFunction: "ease-in-out" }}></div>
                </div>
                {/* Sombra debajo del libro */}
                <div className="w-16 h-2 mx-auto bg-black/40 rounded-full mt-1 blur-sm"></div>
              </div>
              
              <p className="text-xl text-amber-300 font-serif mb-2">Cargando la biblioteca...</p>
              <p className="text-stone-400 text-sm font-serif">Preparando mundos para explorar</p>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-16 px-4 max-w-2xl mx-auto">
            <div className="relative bg-gradient-to-b from-stone-800 to-stone-900 border border-red-700/30 rounded-lg px-8 py-10 shadow-md">
              {/* Efecto de borde rojo */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-700/0 via-red-700/30 to-red-700/0 rounded-lg -z-10 blur-sm"></div>
              
              <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mx-auto mb-5 text-red-500/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              
              <p className="text-xl text-red-400 font-serif mb-3">Error al cargar los libros</p>
              
              <div className="bg-stone-900/80 px-4 py-3 rounded border border-red-900/30 max-w-lg mx-auto text-left">
                <p className="text-stone-300 text-sm font-mono break-words">{error}</p>
              </div>
              
              <p className="text-stone-400 text-sm mt-4">Por favor, inténtalo de nuevo más tarde.</p>
            </div>
          </div>
        )}

        {/* Cuadrícula de libros con mejor espaciado */}
        {!isLoading && !error && filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 px-1 mx-auto max-w-full">
            {filteredBooks.map((book) => (
              <div key={book._id} className="w-full max-w-[320px] mx-auto">
                <BookCard book={book} />
              </div>
            ))}
          </div>
        ) : null}
        
        {/* Mensaje cuando no hay libros en el filtro seleccionado */}
        {!isLoading && !error && books.length > 0 && filteredBooks.length === 0 && (
          <div className="text-center py-12 px-6 max-w-2xl mx-auto">
            <div className="relative bg-gradient-to-b from-stone-800 to-stone-900 border border-amber-700/30 rounded-lg px-8 py-10 shadow-md">
              {/* Efecto de brillo sutil en los bordes */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-700/0 via-amber-700/30 to-amber-700/0 rounded-lg -z-10 blur-sm"></div>
              
              <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mx-auto mb-5 text-amber-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
              
              <p className="text-xl text-amber-300 font-serif mb-3">
                No se encontraron libros en la categoría "<span className="font-semibold">{activeGenre}</span>"
              </p>
              
              <p className="text-stone-300 max-w-xl mx-auto font-serif leading-relaxed text-sm">
                Por favor, selecciona otra categoría o vuelve más tarde cuando tengamos nuevos títulos.
              </p>
            </div>
          </div>
        )}
        
        {/* Mensaje cuando la biblioteca está vacía */}
        {!isLoading && !error && books.length === 0 && (
          <div className="text-center py-16 px-4 max-w-2xl mx-auto">
            <div className="relative bg-gradient-to-b from-stone-800 to-stone-900 border border-amber-700/30 rounded-lg px-8 py-12 shadow-md">
              {/* Efecto de brillo sutil en los bordes */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-700/0 via-amber-700/30 to-amber-700/0 rounded-lg -z-10 blur-sm"></div>
              
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-6 text-amber-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              
              <p className="text-2xl text-amber-300 font-serif mb-4">¡Nuestra biblioteca está creciendo!</p>
              
              <p className="text-stone-300 max-w-xl mx-auto font-serif leading-relaxed">
                Estamos añadiendo nuevos mundos para explorar constantemente. 
                ¡Vuelve pronto para descubrir qué aventuras te esperan!
              </p>
              
              {/* Decoración inferior */}
              <div className="flex justify-center mt-8">
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-600/40 to-transparent"></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Decoración inferior */}
        <div className="flex justify-center mt-20 opacity-60">
          <div className="text-amber-600 text-xl font-serif">✦ ✦ ✦</div>
        </div>
      </div>
    </main>
  );
} 