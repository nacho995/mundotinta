'use client'; // Necesario para hooks como useState, useEffect

import React, { useState, useEffect } from 'react';
import BookCard from '@/components/BookCard';
import useGoogleBooks from '@/hooks/useGoogleBooks'; // Importar el hook de Google Books

export default function BibliotecaPage() {
  const { books, isLoading, error } = useGoogleBooks(); // Usar el hook de Google Books
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [activeGenre, setActiveGenre] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // Filtrar los libros cuando cambia la lista, el género seleccionado o el término de búsqueda
  useEffect(() => {
    if (!books || books.length === 0) {
      setFilteredBooks([]);
      setSearchResults([]);
      return;
    }
    
    // Primero filtrar por género
    let genreFilteredBooks;
    if (activeGenre === 'Todos') {
      genreFilteredBooks = books;
    } else {
      genreFilteredBooks = books.filter(book => book.genre === activeGenre);
    }
    
    // Luego filtrar por término de búsqueda si existe
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      const results = genreFilteredBooks.filter(book => 
        book.title.toLowerCase().includes(term) || 
        (book.author && book.author.toLowerCase().includes(term)) ||
        (book.publisher && book.publisher.toLowerCase().includes(term)) ||
        (book.description && book.description.toLowerCase().includes(term))
      );
      setSearchResults(results);
      setFilteredBooks(results);
    } else {
      setSearchResults(genreFilteredBooks);
      setFilteredBooks(genreFilteredBooks);
    }
  }, [books, activeGenre, searchTerm]);
  
  // Función para manejar la búsqueda
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Función para limpiar la búsqueda
  const clearSearch = () => {
    setSearchTerm('');
  };

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
        
        {/* Filtros de género y barra de búsqueda */}
        {!isLoading && !error && books.length > 0 && (
          <div className="space-y-8 mb-14">
            {/* Filtros de género */}
            <div className="flex flex-wrap justify-center gap-4">
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
            
            {/* Barra de búsqueda con estilo temático */}
            <div className="max-w-xl mx-auto w-full px-4">
              <div className="relative group">
                {/* Efecto de brillo en el borde */}
                <div className="absolute -inset-0.5 bg-amber-700/20 rounded-lg blur-sm group-hover:bg-amber-700/30 transition-all duration-300 group-focus-within:bg-amber-600/40"></div>
                
                <div className="relative flex items-center bg-stone-800/90 border border-amber-900/40 rounded-lg overflow-hidden group-hover:border-amber-800/60 group-focus-within:border-amber-700/80 transition-all duration-300">
                  {/* Icono de búsqueda */}
                  <div className="flex items-center justify-center h-full pl-4 pr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  
                  {/* Campo de entrada */}
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Buscar por título, autor o editorial..."
                    className="w-full py-3 px-2 bg-transparent text-stone-200 placeholder-stone-400 focus:outline-none font-serif text-base"
                  />
                  
                  {/* Botón para limpiar búsqueda */}
                  {searchTerm && (
                    <button 
                      onClick={clearSearch}
                      className="flex items-center justify-center h-full pr-4 pl-2 text-stone-400 hover:text-amber-300 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Contador de resultados */}
              {searchTerm && (
                <div className="text-center mt-2 text-xs text-stone-400 font-serif">
                  {searchResults.length === 0 ? (
                    <span>No se encontraron resultados para "{searchTerm}"</span>
                  ) : (
                    <span>Se encontraron {searchResults.length} {searchResults.length === 1 ? 'resultado' : 'resultados'} para "{searchTerm}"</span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Estados de carga y error */}
        {isLoading && (
          <div className="text-center py-16 px-4 max-w-2xl mx-auto">
            <div className="relative bg-gradient-to-b from-stone-800 to-stone-900 border border-amber-900/30 rounded-lg px-8 py-12 shadow-md">
              {/* Efecto de brillo pulsante en los bordes */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-700/0 via-amber-700/30 to-amber-700/0 rounded-lg -z-10 blur-sm animate-pulse"></div>
              
              <div className="flex justify-center items-center flex-col">
                <div className="w-16 h-20 mx-auto bg-stone-700 rounded-r relative overflow-hidden flex items-center justify-center mb-6">
                  {/* Páginas del libro */}
                  <div className="w-14 h-16 bg-stone-200 absolute animate-pulse"></div>
                  {/* Brillo que se mueve */}
                  <div className="w-full h-full bg-gradient-to-r from-transparent via-amber-200/20 to-transparent absolute animate-[shimmer_2s_infinite] -translate-x-full" 
                       style={{ animationTimingFunction: "ease-in-out" }}></div>
                </div>
                {/* Sombra debajo del libro */}
                <div className="w-16 h-2 mx-auto bg-black/40 rounded-full mt-1 blur-sm"></div>
                
                <p className="text-amber-300 text-lg font-serif mt-6">Explorando nuestro catálogo de libros...</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-16 px-4 max-w-2xl mx-auto">
            <div className="relative bg-gradient-to-b from-stone-800/95 to-stone-900/95 border border-amber-700/40 rounded-lg p-8 md:p-12 shadow-lg">
              {/* Efecto de brillo sutil en los bordes */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-700/0 via-amber-700/30 to-amber-700/0 rounded-lg -z-10 blur-sm"></div>
              
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-6 text-amber-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                
                <h3 className="text-2xl md:text-3xl text-amber-300 font-serif mb-4 text-center leading-relaxed">
                  Biblioteca en renovación
                </h3>
                
                <p className="text-stone-300 max-w-xl mx-auto font-serif leading-relaxed text-center mb-6">
                  {error}
                </p>
                
                <div className="mt-6 w-full max-w-sm mx-auto bg-gradient-to-r from-stone-800 to-stone-900 p-6 rounded-lg border border-amber-700/20">
                  <p className="text-amber-200 font-serif text-center text-sm italic mb-2">Mientras tanto, te invitamos a</p>
                  <div className="flex justify-center space-x-4">
                    <a href="/" className="px-5 py-2 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-amber-100 rounded-md shadow-md transition-all duration-300 text-sm font-medium">
                      Volver al inicio
                    </a>
                    <button onClick={() => window.location.reload()} className="px-5 py-2 border border-amber-600 hover:bg-amber-700/20 text-amber-300 rounded-md shadow-md transition-all duration-300 text-sm font-medium">
                      Reintentar
                    </button>
                  </div>
                </div>
                
                {/* Decoración inferior */}
                <div className="flex justify-center mt-8">
                  <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-600/40 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Listado de libros */}
        {!isLoading && !error && books.length > 0 && filteredBooks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20">
            {filteredBooks.map((book) => (
              <div key={book._id || book.id} className="w-full max-w-[280px] mx-auto">
                <div className="bg-stone-800 border border-amber-900/30 rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-[1.02] duration-300">
                  <BookCard book={book} />
                </div>
              </div>
            ))}
          </div>
        )}
        
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
