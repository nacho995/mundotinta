'use client'; // Convertir a Client Component para usar onError

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Definimos un tipo para las props del libro para mayor claridad (opcional, pero buena práctica)
// interface Book {
//   _id: string;
//   title: string;
//   author: string;
//   price: number;
//   coverImage: string;
//   genre?: string;
//   stock?: number;
// }

// interface BookCardProps {
//   book: Book;
// }

const BookCard = ({ book }) => {
  const defaultPlaceholder = '/images/covers/default-book-cover.jpg';
  const [imgSrc, setImgSrc] = useState(book.coverImage || defaultPlaceholder);

  // Observar cambios en book.coverImage por si el componente se reutiliza con diferentes props
  useEffect(() => {
    setImgSrc(book.coverImage || defaultPlaceholder);
  }, [book.coverImage, defaultPlaceholder]);

  const handleImageError = () => {
    // Solo intentar cargar el placeholder si no es ya la imagen que está fallando
    if (imgSrc !== defaultPlaceholder) {
      setImgSrc(defaultPlaceholder);
    }
    // Si el defaultPlaceholder también falla, ya no hacemos nada para evitar bucles.
  };

  return (
    <div className="bg-stone-800/70 border border-amber-700/30 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-amber-500/40 hover:scale-[1.02] flex flex-col h-full">
      <Link href={`/books/${book._id}`} className="block group">
        <div className="relative w-full h-72 md:h-80 lg:h-96"> 
          <Image 
            src={imgSrc}
            alt={`Portada de ${book.title}`}
            fill
            style={{ objectFit: 'cover' }}
            className="group-hover:opacity-90 transition-opacity duration-300"
            onError={handleImageError}
          />
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-serif font-semibold text-amber-300 mb-2 group-hover:text-amber-200 transition-colors duration-300">
          <Link href={`/books/${book._id}`} className="hover:underline">
            {book.title}
          </Link>
        </h3>
        <p className="text-sm text-stone-400 mb-1 font-sans">Por: {book.author}</p>
        {book.genre && <p className="text-xs text-stone-500 mb-3 font-sans italic">Género: {book.genre}</p>}
        
        {/* Botón Ver Detalles */}
        <Link 
          href={`/books/${book._id}`}
          className="my-3 block text-center px-4 py-2 bg-stone-700 hover:bg-stone-600 text-amber-300 font-semibold rounded-md shadow-sm hover:shadow-md transition-all duration-300 text-sm"
        >
          Ver Detalles
        </Link>

        <div className="mt-auto space-y-3 pt-3 border-t border-stone-700/50">
          <p className="text-2xl font-bold text-white text-center font-serif">
            ${typeof book.price === 'number' ? book.price.toFixed(2) : 'N/A'}
          </p>
          
          {/* Botones de compra de Amazon */}
          {book.amazonPhysicalUrl && (
            <a 
              href={book.amazonPhysicalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block text-center px-4 py-2 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-[0.98] text-sm"
            >
              Comprar Físico en Amazon
            </a>
          )}

          {book.amazonEbookUrl && (
            <a 
              href={book.amazonEbookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block text-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-[0.98] text-sm"
            >
              Comprar Ebook en Amazon
            </a>
          )}

          {/* Mensaje si no hay stock o enlaces de Amazon */}
          {(!book.amazonPhysicalUrl && !book.amazonEbookUrl && (book.stock === undefined || book.stock === 0)) && (
            <p className="text-sm text-center text-red-400 font-semibold">No disponible</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard; 