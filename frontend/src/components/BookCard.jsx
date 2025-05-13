'use client'; // Convertir a Client Component para usar onError

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Rocket, BookOpen, ShoppingCart, Sparkles, Stars, Clover, Trees } from 'lucide-react';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { useCart } from '../context/CartContext';
import BookFormatModal from './BookFormatModal';

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
  const [addedToCart, setAddedToCart] = useState(false);
  const [isFormatModalOpen, setIsFormatModalOpen] = useState(false);
  const { addToCart, cartItems } = useCart();

  // Observar cambios en book.coverImage por si el componente se reutiliza con diferentes props
  useEffect(() => {
    setImgSrc(book.coverImage || defaultPlaceholder);
  }, [book.coverImage, defaultPlaceholder]);
  
  // Verificar si el libro ya está en el carrito
  useEffect(() => {
    const isInCart = cartItems.some(item => item.id === book._id);
    setAddedToCart(isInCart);
  }, [cartItems, book._id]);

  const handleImageError = () => {
    // Solo intentar cargar el placeholder si no es ya la imagen que está fallando
    if (imgSrc !== defaultPlaceholder) {
      setImgSrc(defaultPlaceholder);
    }
    // Si el defaultPlaceholder también falla, ya no hacemos nada para evitar bucles.
  };

  let genreTagElement = null;

  if (book.genre === "Ciencia Ficción") {
    genreTagElement = (
      <div className="mb-3 relative group" title="Ciencia Ficción">
        {/* Aura exterior */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-600 rounded-lg blur-xl opacity-60 group-hover:opacity-100 animate-tilt transition duration-1000 group-hover:duration-200"></div>
        
        {/* Contenedor principal con aspecto de panel tecnológico futurista */}
        <div className="relative flex items-center px-4 py-1.5 bg-gradient-to-br from-blue-900/80 to-indigo-900/80 border border-blue-500/50 rounded-full shadow-lg shadow-blue-500/20 overflow-hidden">
          {/* Efecto de líneas de circuito electrónico */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-[10%] w-[1px] h-full bg-cyan-400"></div>
            <div className="absolute top-0 left-[20%] w-[1px] h-[40%] bg-cyan-400"></div>
            <div className="absolute top-[60%] left-[20%] w-[1px] h-[40%] bg-cyan-400"></div>
            <div className="absolute top-[30%] left-[10%] w-[10%] h-[1px] bg-cyan-400"></div>
            <div className="absolute top-[70%] left-[15%] w-[5%] h-[1px] bg-cyan-400"></div>
          </div>
          
          {/* Escanner horizontal animado */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-70 animate-scan"></div>
          </div>
          
          {/* Destello de escaneo */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 blur-sm -translate-x-full group-hover:translate-x-0 transition-all duration-1000 ease-in-out"></div>
          
          {/* Contenido con iconos futuristas superpuestos */}
          <div className="relative flex items-center gap-3 z-10">
            <div className="relative flex items-center justify-center w-6 h-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 animate-pulse"></div>
              <Rocket className="text-cyan-200 w-3.5 h-3.5 absolute z-20 animate-float-slow" />
              <Stars className="text-cyan-100 w-4 h-4 absolute z-10 animate-spin-slow" />
            </div>
            <span className="text-cyan-100 font-medium tracking-wide text-xs relative z-10 shadow-glow-cyan">
              Ciencia Ficción
            </span>
          </div>
          
          {/* Código digital que aparece al hacer hover */}
          <div className="absolute -right-10 top-0 bottom-0 w-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-[8px] font-mono text-cyan-300 opacity-70">
              101<br/>010<br/>101
            </div>
          </div>
        </div>
      </div>
    );
  } else if (book.genre === "Fantasía") {
    genreTagElement = (
      <div className="mb-3 relative group" title="Fantasía">
        {/* Aura mágica exterior - sin animación en hover */}
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-purple-600 to-emerald-500 rounded-lg blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-1000"></div>
        
        {/* Pergamino mágico */}
        <div className="relative flex items-center px-4 py-1.5 bg-gradient-to-br from-amber-900/90 to-emerald-900/90 border border-amber-200/30 rounded-full shadow-lg shadow-amber-500/30 overflow-hidden">
          {/* Destellos mágicos estáticos */}
          <div className="absolute inset-0">
            <div className="absolute top-[20%] left-[10%] w-[2px] h-[2px] rounded-full bg-amber-300"></div>
            <div className="absolute top-[60%] left-[20%] w-[2px] h-[2px] rounded-full bg-amber-300"></div>
            <div className="absolute top-[40%] left-[80%] w-[2px] h-[2px] rounded-full bg-emerald-300"></div>
            <div className="absolute top-[70%] left-[50%] w-[2px] h-[2px] rounded-full bg-purple-300"></div>
          </div>
          
          {/* Sutiles reflejos de luz sin animación */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-200/10 via-transparent to-transparent"></div>
          
          {/* Contenido con iconos mágicos - sin animaciones */}
          <div className="relative flex items-center gap-3 z-10">
            <div className="relative flex items-center justify-center w-6 h-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/70 via-amber-500/70 to-emerald-500/70"></div>
              <Clover className="text-amber-200 w-4 h-4 absolute z-10" />
              <Sparkles className="text-amber-100 w-4 h-4 absolute z-20 opacity-60" />
            </div>
            <span className="text-amber-100 font-medium tracking-wide text-xs relative z-10 shadow-glow-amber">
              Fantasía
            </span>
          </div>
          
          {/* Símbolos mágicos que aparecen al hacer hover */}
          <div className="absolute -right-10 top-0 bottom-0 w-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-[12px] font-serif text-amber-300 opacity-70 animate-float-slow">
              ⚛ ❈ ✨
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group h-full flex flex-col relative bg-gradient-to-b from-stone-800 to-stone-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Sección de imagen cuadrada */}
      <Link href={`/books/${book._id || book.id}`} className="block relative">
        <div className="relative w-full overflow-hidden bg-stone-800 aspect-square">
          <img
            src={imgSrc}
            alt={book.title}
            width={500}
            height={500}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            className="group-hover:opacity-90 transition-opacity duration-300"
            onError={handleImageError}
          />
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg md:text-xl font-serif font-semibold text-amber-300 mb-1.5 group-hover:text-amber-200 transition-colors duration-300 line-clamp-2">
          <Link href={`/books/${book._id}`} className="hover:underline">
            {book.title}
          </Link>
        </h3>
        <p className="text-sm text-stone-300 mb-1 font-sans line-clamp-1">Por: {book.author}</p>
        {/* Renderizar el tag de género si existe */}
        {genreTagElement}
        
        <Link 
          href={`/books/${book._id}`}
          className="my-2 block text-center px-3 py-1.5 bg-gradient-to-r from-[#A0522D] to-[#8B4513] hover:from-[#8B4513] hover:to-[#A0522D] text-amber-100 font-semibold rounded-md shadow-sm hover:shadow-md transition-all duration-300 text-sm flex items-center justify-center gap-1.5"
        >
          <BookOpen className="w-4 h-4" />
          Ver Detalles
        </Link>

        <div className="mt-auto space-y-2 pt-2 border-t border-stone-700/50">
          <p className="text-xl font-bold text-white text-center font-serif mb-1">
            ${typeof book.price === 'number' ? book.price.toFixed(2) : 'N/A'}
          </p>
          
          {/* Botón de Agregar al Carrito - Ahora abre el modal de selección */}
          <button
            onClick={(e) => {
              e.preventDefault(); // Evitar navegación si está en un Link
              setIsFormatModalOpen(true); // Abrir el modal de selección de formato
            }}
            className={`w-full flex items-center justify-center gap-2 px-3 py-1.5 ${addedToCart ? 'bg-green-600' : 'bg-stone-700 hover:bg-amber-700'} text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-[0.98] text-xs sm:text-sm mb-2`}
          >
            <ShoppingCart className="w-4 h-4" />
            {addedToCart ? 'Añadido ✓' : 'Añadir al Carrito'}
          </button>
          
          {/* Botones de compra de Amazon */}
          <div className="flex flex-col gap-2">
            {book.amazonPhysicalUrl && (
              <a 
                href={book.amazonPhysicalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-stone-900 font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-[0.98] text-xs sm:text-sm"
              >
                Comprar Físico
              </a>
            )}

            {book.amazonEbookUrl && (
              <a 
                href={book.amazonEbookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center px-3 py-1.5 border border-amber-500 hover:bg-amber-500 hover:text-stone-900 text-amber-300 font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-[0.98] text-xs sm:text-sm"
              >
                Comprar Ebook
              </a>
            )}
          </div>

          {/* Quitamos el mensaje de "No disponible" completamente de la interfaz */}
        </div>
      </div>
      
      {/* Modal de selección de formato */}
      <BookFormatModal
        book={book}
        isOpen={isFormatModalOpen}
        onClose={() => setIsFormatModalOpen(false)}
        onSelectFormat={(format) => {
          // Crear el objeto del item con el formato seleccionado
          const cartItem = {
            id: book._id || book.id, // Compatible con libros de muestra y reales
            title: book.title,
            author: book.author,
            price: book.price,
            coverImage: book.coverImage || imgSrc,
            isbn: book.isbn,
            format: format // 'physical' o 'ebook'
          };
          
          // Añadir al carrito
          addToCart(cartItem);
          
          // Cerrar el modal
          setIsFormatModalOpen(false);
          
          // Mostrar mensaje de confirmación
          setAddedToCart(true);
          
          // Ocultar mensaje después de 2 segundos
          setTimeout(() => {
            setAddedToCart(false);
          }, 2000);
        }}
      />
    </div>
  );
};

export default BookCard; 