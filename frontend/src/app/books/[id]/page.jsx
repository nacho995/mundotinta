'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { apiService } from '@/services/api';
import StarRating from '@/components/StarRating';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id; // El ID del libro desde la URL

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  // Cambio a formatos múltiples usando un objeto con propiedades booleanas
  const [purchaseFormats, setPurchaseFormats] = useState({
    physical: false,
    ebook: false,
    audiobook: false
  });
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formatsAvailable, setFormatsAvailable] = useState({physical: true, ebook: true}); // Formatos disponibles

  const defaultPlaceholder = '/images/covers/default-book-cover.jpg';
  const [imgSrc, setImgSrc] = useState(defaultPlaceholder);

  // Verificar si el usuario está logueado
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('authToken');
      setIsLoggedIn(!!token);
    };
    
    checkLoginStatus();
    
    // Actualizar estado si cambia el localStorage
    window.addEventListener('storage', checkLoginStatus);
    window.addEventListener('auth-state-changed', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('auth-state-changed', checkLoginStatus);
    };
  }, []);

  // Verificar si el libro ya está en favoritos o comprado - Usando useCallback para evitar renders infinitos
  const checkBookStatus = useCallback(async () => {
    try {
      // Verificar si está en favoritos
      if (id) {
        const isFavorite = await apiService.isBookInFavorites(id);
        setIsFavorite(isFavorite);
        
        // Verificar si fue comprado
        const purchases = apiService.getFromLocalStorage('userPurchases', []);
        setIsPurchased(purchases.some(purchase => purchase.bookId === Number(id)));
      }
    } catch (err) {
      console.error('Error al verificar estado del libro:', err);
    }
  }, [id]);

  // Cargar datos del libro y verificar si es favorito
  useEffect(() => {
    if (!id) return; // No hacer nada si no hay ID
    
    // Función para obtener el libro
    const fetchBook = async () => {
      setLoading(true);
      setError(null);
      try {
        // Intentar recuperar desde la API local
        let response = await fetch(`${BACKEND_URL}/api/books/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          setBook(data);
          setImgSrc(data.coverImage || defaultPlaceholder);
        } else {
          console.log('No se pudo obtener el libro de la API, usando datos locales');
          
          // Si falla la API, usar datos de muestra como alternativa
          const { placeholderBooks } = await import('@/data/placeholderBooks');
          
          // Convertir ID a string para comparación más segura
          const idToFind = String(id).trim();
          console.log('Buscando libro con ID:', idToFind);
          
          // Buscar el libro por ID, asegurando que ambos sean strings para la comparación
          const bookData = placeholderBooks.find(b => 
            String(b.id) === idToFind || String(b._id) === idToFind
          );
          
          if (bookData) {
            console.log('Libro encontrado en datos locales:', bookData.title);
            setBook({
              ...bookData,
              _id: bookData.id || bookData._id,
              id: bookData.id || bookData._id,
              coverImage: bookData.coverImage || bookData.imageUrl
            });
            setImgSrc(bookData.coverImage || bookData.imageUrl || defaultPlaceholder);
          } else {
            // Si no se encuentra por ID, mostrar un error
            console.warn('Libro no encontrado, mostrando mensaje de error');
            setError('El libro solicitado no se ha encontrado. Por favor, intenta con otro libro.');
            setBook(null);
          }
        }
        
        // Determinar los formatos disponibles de manera segura (después de obtener el libro)
        setFormatsAvailable({
          physical: true, 
          ebook: true // Todos los libros tienen formato digital por defecto
        });
        
        // Verificar si el libro está en favoritos (solo para usuarios logueados)
        if (isLoggedIn) {
          await checkBookStatus();
        }
      } catch (err) {
        console.error("Error en fetchBook:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBook();
  }, [id, isLoggedIn, defaultPlaceholder, checkBookStatus]);

  // Función para mostrar notificaciones
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Función para marcar/desmarcar como favorito
  const handleToggleFavorite = async () => {
    if (!isLoggedIn) {
      router.push('/login?redirect=' + encodeURIComponent(`/books/${id}`));
      return;
    }
    
    if (isFavorite) {
      await apiService.removeBookFromFavorites(id);
      setIsFavorite(false);
      showNotification('Libro eliminado de tus favoritos');
    } else {
      await apiService.addBookToFavorites(id);
      setIsFavorite(true);
      showNotification('Libro añadido a tus favoritos');
    }
  };
  
  // Función para marcar como comprado con múltiples formatos
  const handleMarkAsPurchased = async () => {
    try {
      // Verificar si al menos un formato ha sido seleccionado
      const selectedFormats = Object.entries(purchaseFormats)
        .filter(([_, isSelected]) => isSelected)
        .map(([format]) => format);
      
      if (selectedFormats.length === 0) {
        showNotification('Por favor selecciona al menos un formato', 'error');
        return;
      }
      
      // Llamar a la API con los formatos seleccionados
      await apiService.markBookAsPurchased(id, { formats: selectedFormats });
      setIsPurchased(true);
      setPurchaseModalOpen(false);
      showNotification('Libro añadido a tu biblioteca');
    } catch (err) {
      console.error('Error al marcar como comprado:', err);
      
      if (err.message && err.message.includes('not valid JSON')) {
        showNotification('Error en la respuesta del servidor. Por favor intenta de nuevo más tarde.', 'error');
      } else {
        showNotification('Error al añadir el libro a tu biblioteca', 'error');
      }
    }
  };

  // Función para abrir modal de compra
  const handlePurchaseClick = () => {
    setPurchaseModalOpen(true);
  };

  // Función para agregar al carrito de Shopify
  const handleAddToCart = (format) => {
    try {
      // Si el usuario no está logueado, redirigir al login
      if (!isLoggedIn) {
        router.push('/login?redirect=' + encodeURIComponent(`/books/${id}`));
        return;
      }
      
      // Registrar el clic en analíticas (si está disponible)
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'add_to_cart', {
          'event_category': 'ecommerce',
          'event_label': `${book?.title} - ${format}`,
          'book_id': id
        });
      }
      
      // Abrir modal para confirmar formato
      setPurchaseFormats(prev => ({ ...prev, [format]: true }));
      setPurchaseModalOpen(true);
      
      showNotification(`Preparando ${format === 'physical' ? 'libro físico' : 'libro digital'}`, 'info');
    } catch (err) {
      console.error('Error al agregar al carrito:', err);
    }
  };

  const handleImageError = () => {
    if (imgSrc !== defaultPlaceholder) {
      setImgSrc(defaultPlaceholder);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-stone-950 text-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mb-4"></div>
          <p className="text-2xl text-amber-300 font-serif">Cargando detalles del libro...</p>
        </div>
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
    <main className="min-h-screen bg-gradient-to-b from-stone-950 to-stone-900 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Notificación */}
      {notification.show && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-md shadow-lg ${notification.type === 'error' ? 'bg-red-800 text-white' : notification.type === 'info' ? 'bg-blue-800 text-white' : 'bg-green-800 text-white'}`}>
          {notification.message}
        </div>
      )}
      
      {/* Modal para marcar como comprado */}
      {purchaseModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-stone-900 border border-stone-700 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-serif font-medium text-amber-400 mb-4">Seleccionar formato</h3>
            
            <p className="text-stone-300 mb-4">Selecciona el formato del libro que deseas agregar al carrito:</p>
            
            <div className="space-y-3 mb-6">
              <p className="text-amber-300 text-sm mb-2">Selecciona todos los formatos que deseas:</p>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="format-physical" 
                  checked={purchaseFormats.physical}
                  onChange={() => setPurchaseFormats(prev => ({
                    ...prev,
                    physical: !prev.physical
                  }))}
                  className="w-4 h-4 text-amber-600 bg-stone-700 border-stone-600 focus:ring-amber-500 rounded"
                />
                <span className="text-stone-200">Libro físico</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="format-ebook" 
                  checked={purchaseFormats.ebook}
                  onChange={() => setPurchaseFormats(prev => ({
                    ...prev,
                    ebook: !prev.ebook
                  }))}
                  className="w-4 h-4 text-amber-600 bg-stone-700 border-stone-600 focus:ring-amber-500 rounded"
                />
                <span className="text-stone-200">Ebook</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="format-audiobook" 
                  checked={purchaseFormats.audiobook}
                  onChange={() => setPurchaseFormats(prev => ({
                    ...prev,
                    audiobook: !prev.audiobook
                  }))}
                  className="w-4 h-4 text-amber-600 bg-stone-700 border-stone-600 focus:ring-amber-500 rounded"
                />
                <span className="text-stone-200">Audiolibro</span>
              </label>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setPurchaseModalOpen(false)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-md"
              >
                Cancelar
              </button>
              <button 
                onClick={handleMarkAsPurchased}
                className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-md"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto bg-stone-900/80 backdrop-blur-sm shadow-2xl rounded-xl overflow-hidden border border-amber-700/20 mt-12 md:mt-16">
        <div className="md:flex">
          {/* Columna Izquierda: Imagen */}
          <div className="md:w-1/3 p-4 md:p-8 flex justify-center items-start">
            <div className="relative w-full max-w-xs mx-auto shadow-xl rounded-lg overflow-hidden border-2 border-amber-600/50 bg-gradient-to-b from-stone-800 to-stone-900 p-4">
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,rgba(255,193,77,0.15),transparent_65%)]">
                {/* Efecto de resplandor detrás de la portada */}
              </div>
              
              <div className="aspect-[3/4] relative w-full overflow-hidden flex items-center justify-center">
                {/* Capa de fondo con gradiente */}
                <div className="absolute inset-0 bg-gradient-to-b from-stone-800/50 to-stone-900/50"></div>
                
                {/* Contenedor para centrar la imagen */}
                <div className="w-full h-full flex items-center justify-center">
                  <Image
                    src={imgSrc}
                    alt={`Portada de ${book.title}`}
                    width={250}
                    height={375}
                    className="object-contain max-h-full max-w-full hover:scale-105 transition-all duration-500"
                    onError={handleImageError}
                    unoptimized={true} // Evita la optimización de next/image para URLs externas
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha: Info del libro */}
          <div className="w-full md:w-2/3 md:pl-8">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {book.genres && book.genres.map((genre, index) => (
                <span key={index} className="px-2 py-1 text-xs rounded-full bg-amber-900/30 text-amber-300 border border-amber-800/30">
                  {genre}
                </span>
              ))}
            </div>
            
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-serif text-amber-100 mb-2">{book.title}</h1>
            
            <div className="text-amber-300/80 mb-4">
              <p>por <span className="text-amber-300">{book.author}</span></p>
            </div>
            
            <div className="mt-4 mb-6">
              <div className="flex items-center mb-3">
                <div className="text-amber-400 mr-2">
                  <StarRating rating={book.rating || 4.5} />
                </div>
                <span className="text-amber-300">{book.rating || 4.5}</span>
                <span className="text-stone-400 text-sm ml-2">({book.reviewCount || 128} reseñas)</span>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-amber-200 mb-2">Sinopsis</h3>
              <p className="text-stone-300 leading-relaxed">{book.description}</p>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium text-amber-200 mb-3">Detalles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  {book.publisher && (
                    <p className="text-stone-300 text-sm flex justify-between">
                      <span className="text-amber-400 font-medium inline-block w-28">Editorial:</span> 
                      <span className="flex-grow">{book.publisher}</span>
                    </p>
                  )}
                  {book.publishedDate && (
                    <p className="text-stone-300 text-sm flex justify-between">
                      <span className="text-amber-400 font-medium inline-block w-28">Publicación:</span> 
                      <span className="flex-grow">{book.publishedDate.substr(0, 4)}</span>
                    </p>
                  )}
                  {book.isbn && (
                    <p className="text-stone-300 text-sm flex justify-between">
                      <span className="text-amber-400 font-medium inline-block w-28">ISBN:</span> 
                      <span className="flex-grow">{book.isbn}</span>
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  {book.pageCount > 0 && (
                    <p className="text-stone-300 text-sm flex justify-between">
                      <span className="text-amber-400 font-medium inline-block w-28">Páginas:</span> 
                      <span className="flex-grow">{book.pageCount}</span>
                    </p>
                  )}
                  {book.language && (
                    <p className="text-stone-300 text-sm flex justify-between">
                      <span className="text-amber-400 font-medium inline-block w-28">Idioma:</span> 
                      <span className="flex-grow">{book.language === 'es' ? 'Español' : book.language}</span>
                    </p>
                  )}
                  {book.categories && book.categories.length > 0 && (
                    <p className="text-stone-300 text-sm flex justify-between">
                      <span className="text-amber-400 font-medium inline-block w-28">Categorías:</span> 
                      <span className="flex-grow">{book.categories.join(', ')}</span>
                    </p>
                  )}
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-amber-900/20 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <p className="text-stone-300 text-sm mb-2 sm:mb-0">
                    <span className="text-amber-400 font-medium">Formatos disponibles:</span> 
                    <span className="ml-2">
                      {formatsAvailable.physical && <span className="inline-block px-2 py-0.5 bg-amber-900/30 text-amber-300 rounded text-xs mr-2">Físico</span>}
                      {formatsAvailable.ebook && <span className="inline-block px-2 py-0.5 bg-stone-700/50 text-amber-300 rounded text-xs">Digital</span>}
                    </span>
                  </p>
                </div>
                
                <div className="text-right">
                  {book.price && (
                    <div className="text-xl md:text-2xl font-serif font-bold text-amber-400">
                      ${typeof book.price === 'number' ? book.price.toFixed(2) : book.price}
                    </div>
                  )}
                  {!book.price &&
                    <p className="text-xs text-amber-500/70 mt-1">Consultar precio en tienda</p>
                  }
                </div>
              </div>
            </div>
            
            {/* Botones de acción */}
            <div className="flex flex-col space-y-3 mb-6">
              {/* Botón de favoritos */}
              <button
                onClick={handleToggleFavorite}
                disabled={isFavorite}
                className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-all duration-300 ${isFavorite 
                  ? 'bg-amber-700/20 text-amber-400 hover:bg-amber-700/30' 
                  : 'bg-stone-700/20 text-stone-300 hover:bg-stone-700/30'
                }`}
                aria-label={isFavorite ? 'Eliminar de favoritos' : 'Añadir a favoritos'}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill={isFavorite ? 'currentColor' : 'none'} 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={isFavorite ? 0 : 1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{isFavorite ? 'En tus favoritos' : 'Añadir a favoritos'}</span>
              </button>
              
              {/* Botón de marcar como comprado */}
              {!isPurchased ? (
                <button
                  onClick={handlePurchaseClick}
                  className="flex items-center justify-center space-x-2 px-4 py-2 rounded-md bg-green-700/20 text-green-300 hover:bg-green-700/30 transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Marcar como comprado</span>
                </button>
              ) : (
                <div className="flex items-center justify-center space-x-2 px-4 py-2 rounded-md bg-green-900/40 text-green-300 border border-green-800/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Ya tienes este libro</span>
                </div>
              )}
            </div>

            {/* Sección de precio y compra */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-stone-800/50 p-6 rounded-lg border border-amber-700/20 mb-8">
              <div className="mb-4 sm:mb-0">
                <p className="text-3xl font-bold text-white font-serif">
                  ${typeof book.price === 'number' ? book.price.toFixed(2) : 'N/A'}
                </p>
                {(book.stock === undefined || book.stock === 0) && 
                  <p className="text-xs text-amber-400 mt-1">En stock - Envío en 24-48h</p>
                }
              </div>
              <div className="space-y-3 sm:space-y-0 sm:space-x-3 flex flex-col sm:flex-row w-full sm:w-auto">
                {/* Botones de formatos disponibles con estética premium */}
                <button 
                  className="w-full sm:w-auto flex-grow text-center px-6 py-3 bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-700 hover:to-amber-800 text-amber-100 font-serif font-semibold rounded-md shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                  onClick={() => handleAddToCart('physical')}
                >
                  <span className="absolute inset-0 bg-amber-500/10 w-full h-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  <span className="relative flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Libro Físico
                  </span>
                </button>
                <button 
                  className="w-full sm:w-auto flex-grow text-center px-6 py-3 border border-amber-700/50 bg-stone-900/80 text-amber-100 hover:bg-stone-800 hover:border-amber-600 font-serif font-semibold rounded-md shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                  onClick={() => handleAddToCart('ebook')}
                >
                  <span className="absolute inset-0 bg-amber-500/10 w-full h-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  <span className="relative flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Libro Digital
                  </span>
                </button>
              </div>
            </div>
            
            {/* Sección para usuarios que ya compraron el libro */}
            {isLoggedIn && (
              <div className="mb-8 p-5 bg-gradient-to-br from-stone-800/50 to-stone-900/50 rounded-lg border border-amber-700/20 shadow-md">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-serif text-amber-200 mb-1">¿Ya tienes este libro?</h3>
                    <p className="text-sm text-stone-300">
                      Si ya has comprado este libro, márcalo como adquirido para tenerlo en tu biblioteca personal.
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2 w-full sm:w-auto">
                    <button 
                      onClick={async () => {
                        try {
                          await apiService.markBookAsPurchased(id, { format: 'physical' });
                          showNotification('Libro físico añadido a tu biblioteca');
                          setPurchaseFormats(prev => ({...prev, physical: true}));
                        } catch (err) {
                          console.error('Error al marcar como comprado:', err);
                          showNotification('Error al añadir el libro a tu biblioteca', 'error');
                        }
                      }}
                      className="w-full sm:w-auto text-center px-4 py-2 flex items-center justify-center gap-2 bg-stone-700 hover:bg-stone-600 text-amber-300 font-medium rounded-md transition-colors border border-amber-800/30"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Tengo el físico
                    </button>
                    
                    <button 
                      onClick={async () => {
                        try {
                          await apiService.markBookAsPurchased(id, { format: 'ebook' });
                          showNotification('Libro digital añadido a tu biblioteca');
                          setPurchaseFormats(prev => ({...prev, ebook: true}));
                        } catch (err) {
                          console.error('Error al marcar como comprado:', err);
                          showNotification('Error al añadir el libro a tu biblioteca', 'error');
                        }
                      }}
                      className="w-full sm:w-auto text-center px-4 py-2 flex items-center justify-center gap-2 bg-stone-700 hover:bg-stone-600 text-amber-300 font-medium rounded-md transition-colors border border-amber-800/30"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Tengo el digital
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 