'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { apiService } from '@/services/api';
import BookCard from '@/components/BookCard';

export default function FavoritesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const router = useRouter();
  
  // Función para cargar los libros favoritos del usuario
  const loadFavoriteBooks = async () => {
    setIsLoading(true);
    try {
      const books = await apiService.getFavoriteBooks();
      setFavoriteBooks(books);
      setError(null);
    } catch (err) {
      console.error('Error al obtener los favoritos:', err);
      setError('No se pudieron cargar tus libros favoritos. Por favor, intenta nuevamente más tarde.');
      
      // Si el error es de autenticación, redirigir al login
      if (err.message.includes('autenticación')) {
        router.push('/login');
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cargar los favoritos al montar el componente
  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      // Si no hay token, redirigir al login
      router.push('/login');
      return;
    }
    
    // Cargar los libros favoritos del usuario
    loadFavoriteBooks();
  }, [router]);
  
  // Función para eliminar un libro de favoritos
  const handleRemoveFromFavorites = async (bookId) => {
    if (actionInProgress) return;
    
    setActionInProgress(true);
    try {
      const result = await apiService.removeBookFromFavorites(bookId);
      
      // Actualizar la lista de favoritos eliminando el que se acaba de quitar
      setFavoriteBooks(prevBooks => prevBooks.filter(book => book._id !== bookId));
      
      // Mostrar notificación de éxito
      setNotification({ 
        show: true, 
        message: result.message || 'Libro eliminado de favoritos correctamente', 
        type: 'success' 
      });
      
      // Ocultar la notificación después de unos segundos
      setTimeout(() => {
        setNotification({ show: false, message: '', type: 'success' });
      }, 3000);
      
    } catch (err) {
      console.error('Error al eliminar de favoritos:', err);
      
      // Mostrar notificación de error
      setNotification({ 
        show: true, 
        message: 'Error al eliminar el libro de favoritos. Inténtalo nuevamente.', 
        type: 'error' 
      });
      
      // Ocultar la notificación después de unos segundos
      setTimeout(() => {
        setNotification({ show: false, message: '', type: 'error' });
      }, 3000);
    } finally {
      setActionInProgress(false);
    }
  };
  
  // Mostrar pantalla de carga mientras se obtienen los favoritos
  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-950">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mb-4"></div>
          <div className="text-amber-500 text-xl">Cargando tus favoritos...</div>
        </div>
      </main>
    );
  }

  return (
    <main 
      className="flex min-h-screen flex-col items-center justify-center p-8 md:p-12 lg:p-24 bg-stone-950 text-white"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239a8478' fill-opacity='0.09'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundColor: '#1c1a17',
      }}
    >
      <div className="w-full max-w-6xl bg-stone-900/90 backdrop-blur-sm p-8 md:p-10 rounded-xl shadow-2xl border border-amber-700/30">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
            Mis Favoritos
          </h1>
          <div className="w-32 h-px bg-gradient-to-r from-amber-600/0 via-amber-500 to-amber-600/0 mx-auto mb-8"></div>
          <p className="text-lg text-stone-300 mb-4 font-serif">
            Aquí encontrarás todos los libros que has marcado como favoritos.
          </p>
        </div>
        
        {/* Notificación */}
        {notification.show && (
          <div className={`mb-6 p-4 rounded-md ${notification.type === 'success' ? 'bg-green-900/60 border border-green-700/50 text-green-200' : 'bg-red-900/60 border border-red-700/50 text-red-200'}`}>
            <p className="text-center">{notification.message}</p>
          </div>
        )}
        
        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 p-6 flex flex-col items-center justify-center space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="text-red-400 text-lg text-center">{error}</p>
            <button 
              onClick={loadFavoriteBooks}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-md transition-colors"
            >
              Intentar nuevamente
            </button>
          </div>
        )}
        
        {/* Lista de favoritos */}
        {!error && (
          <div>
            {favoriteBooks.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center space-y-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-500/50 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <p className="text-stone-400 text-lg text-center mb-4">Aún no tienes libros en favoritos</p>
                <Link 
                  href="/biblioteca" 
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Explorar libros
                </Link>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {favoriteBooks.map(book => (
                    <div key={book._id} className="relative group">
                      <BookCard book={book} />
                      
                      {/* Botón para eliminar de favoritos */}
                      <button
                        onClick={() => handleRemoveFromFavorites(book._id)}
                        disabled={actionInProgress}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-900/80 hover:bg-red-800 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md"
                        title="Eliminar de favoritos"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      
                      {/* Fecha de adición a favoritos */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-stone-950 p-2 text-xs text-stone-400 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Añadido: {new Date(book.addedToFavorites).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-10 text-center">
                  <Link 
                    href="/biblioteca" 
                    className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Descubrir más libros
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Navegación */}
        <div className="mt-10 pt-6 border-t border-stone-700/50 flex justify-center space-x-4">
          <Link 
            href="/" 
            className="font-medium text-amber-400 hover:text-amber-300 transition-colors"
          >
            Página principal
          </Link>
          <span className="text-stone-600">•</span>
          <Link 
            href="/my-books" 
            className="font-medium text-amber-400 hover:text-amber-300 transition-colors"
          >
            Mis Libros
          </Link>
          <span className="text-stone-600">•</span>
          <Link 
            href="/profile" 
            className="font-medium text-amber-400 hover:text-amber-300 transition-colors"
          >
            Perfil
          </Link>
        </div>
      </div>
    </main>
  );
}
