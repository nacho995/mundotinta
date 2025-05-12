'use client';

import React, { useState, useEffect } from 'react';
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
  const [affLinks, setAffLinks] = useState(null); // Enlaces de afiliado para Amazon

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

  // Verificar si el libro está en favoritos y si fue comprado
  const checkBookStatus = async () => {
    try {
      // Verificar favoritos
      const isFav = await apiService.isBookInFavorites(id);
      setIsFavorite(isFav);
      
      // Verificar si fue comprado
      const purchases = apiService.getFromLocalStorage('userPurchases', []);
      setIsPurchased(purchases.some(purchase => purchase.bookId === Number(id)));
    } catch (err) {
      console.error('Error al verificar estado del libro:', err);
    }
  };

  // Cargar datos del libro y verificar si es favorito
  useEffect(() => {
    if (id) {
      const fetchBook = async () => {
        setLoading(true);
        setError(null);
        try {
          // Intentar obtener desde la API
          try {
            const response = await fetch(`${BACKEND_URL}/api/books/${id}`);
            if (response.ok) {
              const data = await response.json();
              setBook(data);
              setImgSrc(data.coverImage || defaultPlaceholder);
            } else {
              // Si falla la API, buscar en datos de muestra
              console.log('No se pudo obtener el libro de la API, buscando en datos locales');
              
              // Importar dinámicamente para evitar problemas de SSR
              const { placeholderBooks } = await import('@/data/placeholderBooks');
              
              // Convertir ID a string para comparación más segura
              const idToFind = String(id).trim();
              console.log('Buscando libro con ID:', idToFind);
              
              // Buscar el libro por ID, asegurando que ambos sean strings para la comparación
              const bookData = placeholderBooks.find(b => String(b.id) === idToFind);
              
              if (bookData) {
                console.log('Libro encontrado en datos locales:', bookData.title);
                setBook({
                  ...bookData,
                  _id: bookData.id,
                  coverImage: bookData.imageUrl
                });
                setImgSrc(bookData.imageUrl || defaultPlaceholder);
              } else {
                // Si no se encuentra por ID, mostrar el primer libro como fallback
                // Esto es temporal para evitar que el usuario vea un error
                console.warn('Libro no encontrado, mostrando libro por defecto');
                const defaultBook = placeholderBooks[0];
                setBook({
                  ...defaultBook,
                  _id: defaultBook.id,
                  coverImage: defaultBook.imageUrl
                });
                setImgSrc(defaultBook.imageUrl || defaultPlaceholder);
              }
            }
            
            // Obtener enlaces de afiliado
            try {
              const links = await apiService.getAffiliateLinks(id);
              setAffLinks(links);
            } catch (err) {
              console.error('Error al obtener enlaces de afiliado:', err);
              // No fallar por esto, solo loguear
            }
            
            // Verificar si el libro está en favoritos (solo para usuarios logueados)
            if (isLoggedIn) {
              await checkBookStatus();
            }
          } catch (innerErr) {
            throw innerErr;
          }
        } catch (err) {
          console.error("Error en fetchBook:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      
      fetchBook();
    }
  }, [id, isLoggedIn, defaultPlaceholder]);

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
      
      // Mejor manejo de errores JSON
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

  // Función para registrar redirección a Amazon
  const handleAmazonClick = async (type) => {
    try {
      await apiService.registerAmazonRedirect(id, type);
    } catch (err) {
      console.error('Error al registrar redirección:', err);
      // No mostrar error al usuario, es solo un tracking
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
    <main 
      className="min-h-screen bg-stone-950 text-white p-4 md:p-8 lg:p-12"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239a8478' fill-opacity='0.07'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundColor: '#1c1a17',
      }}
    >
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
            <h3 className="text-xl font-serif font-medium text-amber-400 mb-4">Marcar como comprado</h3>
            
            <p className="text-stone-300 mb-4">Indica el formato del libro que has comprado:</p>
            
            <div className="space-y-3 mb-6">
              <p className="text-amber-300 text-sm mb-2">Selecciona todos los formatos que hayas adquirido:</p>
              
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
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="text-stone-400">Publicado:</div>
                <div className="text-stone-300">{book.publishedDate || '12 de enero de 2023'}</div>
                
                <div className="text-stone-400">Editorial:</div>
                <div className="text-stone-300">{book.publisher || 'Editorial Ficticia'}</div>
                
                <div className="text-stone-400">Páginas:</div>
                <div className="text-stone-300">{book.pageCount || 324}</div>
                
                <div className="text-stone-400">ISBN:</div>
                <div className="text-stone-300">{book.isbn || '978-3-16-148410-0'}</div>
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
                { (book.stock === undefined || book.stock === 0) && (!affLinks?.physical && !affLinks?.ebook && !book.amazonPhysicalUrl && !book.amazonEbookUrl) &&
                    <p className="text-xs text-red-400 mt-1">No disponible actualmente</p>
                }
              </div>
              <div className="space-y-3 sm:space-y-0 sm:space-x-3 flex flex-col sm:flex-row w-full sm:w-auto">
                {/* Enlaces a Amazon con tracking */}
                {(affLinks?.physical || book.amazonPhysicalUrl) && (
                  <a 
                    href={affLinks?.physical || book.amazonPhysicalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleAmazonClick('physical')}
                    className="w-full sm:w-auto flex-grow text-center px-6 py-3 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-[0.98]"
                  >
                    Comprar Físico (Amazon)
                  </a>
                )}
                {(affLinks?.ebook || book.amazonEbookUrl) && (
                  <a 
                    href={affLinks?.ebook || book.amazonEbookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleAmazonClick('ebook')}
                    className="w-full sm:w-auto flex-grow text-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-[0.98]"
                  >
                    Comprar Ebook (Amazon)
                  </a>
                )}
                {affLinks?.audiobook && (
                  <a 
                    href={affLinks.audiobook}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleAmazonClick('audiobook')}
                    className="w-full sm:w-auto flex-grow text-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-[0.98]"
                  >
                    Audiolibro (Amazon)
                  </a>
                )}
              </div>
            </div>
            
            {/* Sección para usuarios que ya compraron el libro */}
            {isLoggedIn && (
              <div className="mb-8 p-5 bg-stone-800/30 rounded-lg border border-amber-700/10">
                <h3 className="text-lg font-serif text-amber-200 mb-3">¿Ya tienes este libro?</h3>
                <p className="text-sm text-stone-300 mb-3">
                  Si ya has comprado este libro, márcalo como adquirido para tenerlo en tu biblioteca personal.
                </p>
                <button 
                  onClick={async () => {
                    try {
                      await apiService.markBookAsPurchased(id, { format: 'physical' });
                      showNotification('Libro añadido a tu biblioteca');
                      // Opcionalmente redirigir a my-books
                      // setTimeout(() => router.push('/my-books'), 1500);
                    } catch (err) {
                      console.error('Error al marcar como comprado:', err);
                      showNotification('Error al añadir el libro a tu biblioteca', 'error');
                    }
                  }}
                  className="w-full sm:w-auto text-center px-4 py-2 bg-stone-700 hover:bg-stone-600 text-amber-300 font-medium rounded-md transition-colors"
                >
                  Lo tengo en mi biblioteca
                </button>
              </div>
            )}

            {/* Aquí podrías añadir más secciones: detalles del producto, reseñas, etc. */}
          </div>
        </div>
      </div>
    </main>
  );
} 