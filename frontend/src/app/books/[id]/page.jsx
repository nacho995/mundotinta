'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id; // El ID del libro desde la URL

  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const defaultPlaceholder = '/images/covers/default-book-cover.jpg';
  const [imgSrc, setImgSrc] = useState(defaultPlaceholder);

  useEffect(() => {
    if (id) {
      const fetchBook = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`${BACKEND_URL}/api/books/${id}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error ${response.status} al obtener el libro`);
          }
          const data = await response.json();
          setBook(data);
          setImgSrc(data.coverImage || defaultPlaceholder); 
        } catch (err) {
          console.error("Error en fetchBook:", err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchBook();
    }
  }, [id, defaultPlaceholder]);

  const handleImageError = () => {
    if (imgSrc !== defaultPlaceholder) {
      setImgSrc(defaultPlaceholder);
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-stone-950 text-white">
        <p className="text-2xl text-amber-300 font-serif animate-pulse">Cargando detalles del libro...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-stone-950 text-white">
        <div className="text-center">
          <p className="text-2xl text-red-400 font-serif mb-4">Error al cargar el libro: {error}</p>
          <Link href="/biblioteca" className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-md shadow-md transition-colors">
            Volver a la Biblioteca
          </Link>
        </div>
      </main>
    );
  }

  if (!book) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-stone-950 text-white">
        <p className="text-2xl text-stone-400 font-serif">Libro no encontrado.</p>
      </main>
    );
  }

  return (
    <main 
      className="min-h-screen bg-stone-950 text-white p-4 md:p-8 lg:p-12"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239a8478' fill-opacity='0.07'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundColor: '#1c1a17',
      }}
    >
      <div className="max-w-6xl mx-auto bg-stone-900/80 backdrop-blur-sm shadow-2xl rounded-xl overflow-hidden border border-amber-700/20 mt-12 md:mt-16">
        <div className="md:flex">
          {/* Columna Izquierda: Imagen */}
          <div className="md:w-1/3 p-4 md:p-8 flex justify-center items-start">
            <div className="relative w-full aspect-[3/4] max-w-sm shadow-xl rounded-lg overflow-hidden border-2 border-amber-600/50">
              <Image 
                src={imgSrc}
                alt={`Portada de ${book.title}`}
                fill
                style={{ objectFit: 'cover' }}
                onError={handleImageError}
                priority // Cargar esta imagen con prioridad ya que es LCP
              />
            </div>
          </div>

          {/* Columna Derecha: Detalles */}
          <div className="md:w-2/3 p-6 md:p-10">
            <button 
              onClick={() => router.back()} 
              className="mb-6 text-sm text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Volver
            </button>

            <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
              {book.title}
            </h1>
            <p className="text-xl text-stone-300 font-sans mb-1">Por: <span className="font-semibold text-stone-200">{book.author}</span></p>
            {book.genre && (
              <p className="text-md text-stone-400 font-sans italic mb-6">Género: {book.genre}</p>
            )}

            <div className="w-full h-px bg-gradient-to-r from-amber-700/0 via-amber-600 to-amber-700/0 my-6 md:my-8"></div>

            <h2 className="text-2xl font-serif text-amber-200 mb-3">Descripción</h2>
            <p className="text-stone-300 leading-relaxed font-sans mb-6 md:mb-8 whitespace-pre-line">
              {book.description}
            </p>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-stone-800/50 p-6 rounded-lg border border-amber-700/20 mb-8">
              <div className="mb-4 sm:mb-0">
                <p className="text-3xl font-bold text-white font-serif">
                  ${typeof book.price === 'number' ? book.price.toFixed(2) : 'N/A'}
                </p>
                 { (book.stock === undefined || book.stock === 0) && (!book.amazonPhysicalUrl && !book.amazonEbookUrl) &&
                    <p className="text-xs text-red-400 mt-1">No disponible actualmente</p>
                 }
              </div>
              <div className="space-y-3 sm:space-y-0 sm:space-x-3 flex flex-col sm:flex-row w-full sm:w-auto">
                {book.amazonPhysicalUrl && (
                  <a 
                    href={book.amazonPhysicalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex-grow text-center px-6 py-3 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-[0.98]"
                  >
                    Comprar Físico (Amazon)
                  </a>
                )}
                {book.amazonEbookUrl && (
                  <a 
                    href={book.amazonEbookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex-grow text-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-[0.98]"
                  >
                    Comprar Ebook (Amazon)
                  </a>
                )}
              </div>
            </div>

            {/* Aquí podrías añadir más secciones: detalles del producto, reseñas, etc. */}
          </div>
        </div>
      </div>
    </main>
  );
} 