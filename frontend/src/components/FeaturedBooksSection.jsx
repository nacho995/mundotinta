"use client";

import { useState, useEffect } from 'react';
import BookCard from '@/components/BookCard';
import useGoogleBooks from '@/hooks/useGoogleBooks';
import Link from 'next/link';
import ClientParticles from '@/components/ClientParticles';

export default function FeaturedBooksSection() {
  // Obtener libros usando el hook de libros
  const { books, isLoading, error } = useGoogleBooks();
  
  // Estado para los filtros y libros
  const [activeGenre, setActiveGenre] = useState('Todos');
  const [filteredBooks, setFilteredBooks] = useState([]);
  
  // Aplicar filtro cuando cambia el género activo o la lista de libros
  useEffect(() => {
    if (!books || books.length === 0) {
      setFilteredBooks([]);
      return;
    }
    
    if (activeGenre === 'Todos') {
      // Limitar a 8 libros para la sección destacada
      setFilteredBooks(books.slice(0, 8));
    } else {
      const filtered = books.filter(book => book.genre === activeGenre);
      setFilteredBooks(filtered.slice(0, 8));
    }
  }, [activeGenre, books]);
  return (
    <section id="libros" className="w-full py-20 md:py-32 relative overflow-hidden">
      {/* Fondo dinámico con la nueva paleta de colores - más transparente */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-900/80 to-black/80 z-0"></div>
      
      {/* Textura vintage */}
      <div className="absolute inset-0 bg-[url('/images/paper-texture.jpg')] bg-cover opacity-[0.07] mix-blend-overlay z-0"></div>
      
      {/* Elementos decorativos flotantes con los nuevos colores - más suaves */}
      <div className="absolute left-1/4 top-10 w-96 h-96 rounded-full bg-[#5e4534]/5 mix-blend-overlay filter blur-[100px] animate-float-slow z-0"></div>
      <div className="absolute right-1/4 bottom-10 w-96 h-96 rounded-full bg-[#8B4513]/5 mix-blend-overlay filter blur-[100px] animate-pulse-slower z-0"></div>
      <div className="absolute right-1/3 top-1/3 w-80 h-80 rounded-full bg-[#A0522D]/5 mix-blend-overlay filter blur-[100px] z-0"></div>
      
      {/* Efecto de partículas doradas */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: 'radial-gradient(circle at center, rgba(139,69,19,0.05) 0%, transparent 8%)',
        backgroundSize: '25px 25px',
        backgroundPosition: '0 0, 12px 12px'
      }}></div>
      
      {/* Separador superior con efecto de brillo dorado */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#A0522D]/40 to-transparent"></div>

      {/* Contenido principal */}
      <div className="container relative mx-auto px-4 z-10">
        {/* Título con estilo elegante en dorado y blanco */}
        <div className="text-center mb-16 relative">
          <div className="inline-block relative">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-3">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d3a87d] to-[#e6c9ab]">MUNDOS POR DESCUBRIR</span>
            </h2>
            <div className="absolute -inset-1 blur-xl bg-[#b87333]/10 -z-10 rounded-lg"></div>
          </div>
          
          {/* Símbolos de biblioteca antigua */}
          <div className="flex justify-center gap-8 mt-2 mb-6">
            <div className="text-[#A0522D]/60">✧</div>
            <div className="w-20 h-0.5 mt-3 bg-gradient-to-r from-[#A0522D]/40 via-[#b87333]/60 to-[#A0522D]/40"></div>
            <div className="text-[#A0522D]/60">✧</div>
          </div>
          
          {/* Subtítulo con estilo vintage */}
          <p className="text-stone-300 text-lg mt-8 max-w-2xl mx-auto font-serif tracking-wide">
            Cada libro es un portal a dimensiones inexploradas, donde la imaginación desafía los límites de lo posible
          </p>
        </div>
        
        {/* Selector de categorías estilo biblioteca antigua */}
        <div className="flex flex-wrap justify-center gap-4 mb-14">
          <button className="group relative px-6 py-2 bg-stone-900/80 text-[#e6c9ab] hover:text-[#f0e6d2] border-b border-[#A0522D]/30 hover:border-[#b87333] transition-all duration-500 font-serif tracking-wide rounded-sm shadow-md overflow-hidden transform hover:scale-105">
            {/* Efecto de brillo que se desplaza */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#A0522D]/0 via-[#b87333]/20 to-[#A0522D]/0 opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000"></span>
            {/* Resplandor de borde */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ boxShadow: "inset 0 0 5px rgba(184,115,51,0.5)" }}></span>
            <span className="relative z-10">Todos</span>
          </button>
          
          <button 
            onClick={() => setActiveGenre('Fantasía')}
            className={`group relative px-6 py-2 ${activeGenre === 'Fantasía' ? 'bg-[#5e4534]/90 text-[#f0e6d2]' : 'bg-stone-900/80 text-[#e6c9ab]'} hover:text-[#f0e6d2] border-b ${activeGenre === 'Fantasía' ? 'border-[#b87333]' : 'border-[#A0522D]/30'} hover:border-[#b87333] transition-all duration-500 font-serif tracking-wide rounded-sm shadow-md overflow-hidden transform hover:scale-105`}
          >
            {/* Efecto de brillo que se desplaza */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#A0522D]/0 via-[#b87333]/20 to-[#A0522D]/0 opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000"></span>
            {/* Resplandor de borde */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ boxShadow: "inset 0 0 5px rgba(184,115,51,0.5)" }}></span>
            <span className="relative z-10">Fantasía</span>
          </button>
          
          <button 
            onClick={() => setActiveGenre('Ciencia Ficción')}
            className={`group relative px-6 py-2 ${activeGenre === 'Ciencia Ficción' ? 'bg-stone-800/90 text-[#f0e6d2]' : 'bg-stone-900/80 text-[#e6c9ab]'} hover:text-[#f0e6d2] border-b ${activeGenre === 'Ciencia Ficción' ? 'border-[#b87333]' : 'border-[#A0522D]/30'} hover:border-[#b87333] transition-all duration-500 font-serif tracking-wide rounded-sm shadow-md overflow-hidden transform hover:scale-105`}
          >
            {/* Efecto de brillo que se desplaza */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#A0522D]/0 via-[#b87333]/20 to-[#A0522D]/0 opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000"></span>
            {/* Resplandor de borde */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ boxShadow: "inset 0 0 5px rgba(184,115,51,0.5)" }}></span>
            <span className="relative z-10">Ciencia Ficción</span>
          </button>
        </div>  
                {/* Grid de libros con efectos dinámicos */}
        <div className="relative">
          {/* Efecto de luz en el centro con tono dorado/verde - más sutil */}
          <div className="absolute top-1/2 left-0 w-full h-[500px] -translate-y-1/2 bg-gradient-to-r from-[#5e4534]/0 via-[#8B4513]/5 to-[#5e4534]/0 rotate-1 z-0"></div>
          
          {/* Estados de carga y error */}
          {isLoading && (
            <div className="col-span-4 text-center py-16">
              <div className="inline-block w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#e6c9ab] text-lg font-serif mt-4">Cargando mundos literarios...</p>
            </div>
          )}
          
          {error && (
            <div className="col-span-4 text-center py-16 px-4">
              <div className="relative bg-gradient-to-b from-stone-800/95 to-stone-900/95 border border-amber-700/40 rounded-lg p-8 md:p-12 shadow-lg max-w-3xl mx-auto">
                {/* Efecto de brillo sutil en los bordes */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-700/0 via-amber-700/30 to-amber-700/0 rounded-lg -z-10 blur-sm"></div>
                
                <div className="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-6 text-amber-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  
                  <h3 className="text-2xl md:text-3xl text-amber-300 font-serif mb-4 text-center leading-relaxed">
                    Nuestros libros están siendo encuadernados
                  </h3>
                  
                  <p className="text-stone-300 max-w-xl mx-auto font-serif leading-relaxed text-center mb-6">
                    {error}
                  </p>
                  
                  {/* Decoración inferior */}
                  <div className="flex justify-center mt-4">
                    <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-600/40 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Grid con efectos de hover estilo libro antiguo */}
          {!isLoading && !error && (
            <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 z-10">
              {filteredBooks.map((book) => (
                <div key={book._id || book.id} className="group transform hover:scale-105 transition-all duration-500">
                  <div className="relative rounded-lg overflow-hidden shadow-2xl h-full">
                    <BookCard book={book} />
                  </div>
                  
                  {/* Partículas doradas que aparecen en hover */}
                  <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#b87333]/80 blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300 animate-float-slow"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-1 h-1 rounded-full bg-[#c19a6b]/70 blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-500 animate-float-slow"></div>
                </div>
              ))}
              
              {filteredBooks.length === 0 && (
                <div className="col-span-4 text-center py-16">
                  <p className="text-[#e6c9ab] text-lg font-serif italic">No se encontraron libros en esta categoría</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Botón estilo biblioteca antigua */}
        <div className="text-center mt-20">
          <Link href="/biblioteca"
             className="relative overflow-hidden inline-flex items-center justify-center px-10 py-4 text-lg
                     bg-gradient-to-r from-[#8B4513] to-[#5e4534] hover:from-[#A0522D] hover:to-[#8B4513]
                     text-[#e6c9ab] shadow-xl
                     rounded-sm border border-[#d3a87d]/30 group/btn transform hover:scale-105 transition-all duration-300 font-serif tracking-widest">
            {/* Partículas brillantes */}
            <ClientParticles />
            
            {/* Resplandor de borde */}
            <div className="absolute -inset-1 opacity-0 group-hover/btn:opacity-100 bg-gradient-to-r from-[#b87333] via-[#d3a87d] to-[#b87333] rounded-lg blur-md transition-all duration-500 group-hover/btn:duration-200"></div>
            
            <span className="relative z-10 flex items-center justify-center gap-1.5">
              <span className="relative group-hover/btn:text-[#f0e6d2] transition-colors duration-300">
                EXPLORAR BIBLIOTECA
                {/* Subrayado animado */}
                <span className="absolute left-0 -bottom-1 h-px w-0 group-hover/btn:w-full bg-[#e6c9ab]/30 transition-all duration-700 delay-200"></span>
              </span>
              
              {/* Flecha con animación */}
              <svg className="ml-2 w-5 h-5 transform transition-transform duration-500 group-hover/btn:translate-x-1 text-[#e6c9ab] group-hover/btn:text-[#f0e6d2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </span>
          </Link>
        </div>
        
        {/* Adorno inferior estilo biblioteca antigua */}
        <div className="flex justify-center mt-14 opacity-60">
          <div className="text-[#A0522D] text-xl">✧ ✧ ✧</div>
        </div>
      </div>
      
      {/* Separador inferior con efecto de brillo dorado */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#A0522D]/40 to-transparent"></div>
    </section>
  );
} 