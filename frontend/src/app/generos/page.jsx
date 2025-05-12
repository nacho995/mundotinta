'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { genres, commonElements, subgenres } from '@/data/genres';

export default function GenerosPage() {
  const router = useRouter();
  const [expandedGenre, setExpandedGenre] = useState(null);
  
  const handleGenreClick = (slug) => {
    // Si ya está expandido, navegar a la biblioteca con el filtro de género
    if (expandedGenre === slug) {
      router.push(`/biblioteca?genero=${slug}`);
    } else {
      // Si no, expandir el género
      setExpandedGenre(slug);
    }
  };

  // Encontrar el género expandido actual (si existe)
  const currentGenre = expandedGenre ? genres.find(g => g.slug === expandedGenre) : null;

  return (
    <main className="min-h-screen bg-stone-950 text-white pt-16 pb-24">
      {/* Cabecera con textura de pergamino antigua */}
      <div className="relative py-16 mb-12 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-stone-950/80 via-stone-900/50 to-stone-950/90"></div>
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
            Explora los Reinos de la Imaginación
          </h1>
          <p className="text-lg md:text-xl text-stone-300 max-w-4xl mx-auto font-serif">
            Desde los confines de galaxias inexploradas hasta los reinos olvidados de la magia ancestral, cada género te ofrece una puerta a lo inimaginable.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Sección principal de géneros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {genres.map((genero) => (
            <div 
              key={genero.slug} 
              className={`relative overflow-hidden rounded-lg shadow-xl transition-all duration-500 ${expandedGenre === genero.slug ? 'col-span-1 md:col-span-2 lg:row-span-2 lg:col-span-4 cursor-default' : 'cursor-pointer hover:shadow-lg hover:shadow-stone-800/20 transform hover:-translate-y-1'}`}
              onClick={() => handleGenreClick(genero.slug)}
            >
              {/* Card de género colapsada (vista predeterminada) */}
              {expandedGenre !== genero.slug && (
                <div className={`bg-gradient-to-br from-stone-900 to-stone-800 p-6 border border-${genero.color || 'amber'}-900/30 h-full flex flex-col justify-between`}>
                  <h2 className={`text-2xl font-serif font-bold mb-3 text-${genero.color || 'amber'}-300`}>
                    {genero.name}
                  </h2>
                  <p className="text-stone-400 mb-4 line-clamp-3">
                    {genero.description}
                  </p>
                  <span className={`mt-auto text-sm font-medium text-${genero.color || 'amber'}-400 flex items-center`}>
                    <span>Explorar género</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              )}
              
              {/* Card de género expandida */}
              {expandedGenre === genero.slug && (
                <div className={`relative bg-gradient-to-br from-stone-900 to-stone-900 border border-${genero.color || 'amber'}-900/30 overflow-hidden`}>
                  {/* Fondo con imagen difuminada */}
                  <div className="absolute inset-0 z-0 bg-stone-950 opacity-90"></div>
                  
                  <div className="relative z-10 p-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                      {/* Lado izquierdo: imagen y descripción */}
                      <div className="lg:w-1/3">
                        <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-2xl mb-6 bg-stone-800 border border-stone-700">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <h3 className={`text-2xl font-serif font-bold text-${genero.color || 'amber'}-300 p-4 text-center`}>
                              {genero.name}
                            </h3>
                          </div>
                        </div>
                        <div className="mb-6">
                          <h4 className="text-lg font-medium text-white mb-2">Sobre este género:</h4>
                          <p className="text-stone-300">
                            {genero.description}
                          </p>
                        </div>
                        <div className="mb-6">
                          <h4 className="text-lg font-medium text-white mb-2">Autores destacados:</h4>
                          <ul className="text-stone-300 space-y-1 list-disc list-inside">
                            {genero.featuredAuthors && genero.featuredAuthors.map(author => (
                              <li key={author}>{author}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      {/* Lado derecho: características del género y libros recomendados */}
                      <div className="lg:w-2/3">
                        <div className="mb-8">
                          <h3 className={`text-3xl font-serif font-semibold mb-6 text-${genero.color || 'amber'}-300`}>
                            Características de {genero.name}
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {/* Características comunes del género */}
                            <div className={`p-4 rounded-lg bg-stone-800/50 border border-${genero.color || 'amber'}-900/30`}>
                              <h4 className="font-medium text-white mb-2">Elementos comunes</h4>
                              <ul className="text-stone-300 space-y-1">
                                {commonElements[genero.slug]?.map((elemento, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <svg className={`w-5 h-5 mr-2 text-${genero.color || 'amber'}-500 mt-0.5 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>{elemento}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            {/* Subgéneros */}
                            <div className={`p-4 rounded-lg bg-stone-800/50 border border-${genero.color || 'amber'}-900/30`}>
                              <h4 className="font-medium text-white mb-2">Subgéneros populares</h4>
                              <ul className="text-stone-300 space-y-1">
                                {subgenres[genero.slug]?.map((subgenero, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <svg className={`w-5 h-5 mr-2 text-${genero.color || 'amber'}-500 mt-0.5 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                    <span>{subgenero}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-amber-900/20 border border-amber-700/30 mb-6">
                          <h4 className="font-medium text-white mb-2 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Próximamente con la API de Amazon
                          </h4>
                          <p className="text-stone-300 text-sm">
                            Cuando se integre la API de afiliados de Amazon, esta sección mostrará libros recomendados específicos
                            para el género {genero.name}, utilizando el ID de categoría {genero.amazonBrowseNodeId} para ofrecer
                            sugerencias actualizadas y enlaces de compra con tu código de afiliado.
                          </p>
                        </div>
                        
                        {/* Botones de acción */}
                        <div className="flex flex-wrap gap-4 mt-auto">
                          <Link 
                            href={`/biblioteca?genero=${genero.slug}`}
                            className={`px-6 py-3 bg-${genero.color || 'amber'}-700 hover:bg-${genero.color || 'amber'}-600 text-white font-semibold rounded-md shadow-md transition-colors flex items-center gap-2`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Ver libros de este género
                          </Link>
                          
                          <button 
                            onClick={() => setExpandedGenre(null)}
                            className="px-6 py-3 bg-stone-700 hover:bg-stone-600 text-white font-semibold rounded-md shadow-md transition-colors"
                          >
                            Volver a todos los géneros
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Sección inferior con cita literaria */}
      <div className="container mx-auto px-4 mt-20 text-center">
        <div className="max-w-3xl mx-auto">
          <blockquote className="text-xl md:text-2xl font-serif text-stone-300 italic">
            "La fantasía es un ingrediente necesario en la vida. Es una forma de mirar la vida a través de la lente equivocada del cristal, que revela la verdad que de otra manera permanecería oculta."
            <footer className="text-right mt-4 text-amber-400 font-medium text-lg">— Dr. Seuss</footer>
          </blockquote>
        </div>
      </div>
    </main>
  );
}