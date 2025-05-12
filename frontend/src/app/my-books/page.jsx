'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { apiService } from '@/services/api';
import BookCard from '@/components/BookCard';

export default function MyBooksPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [userBooks, setUserBooks] = useState([]);
  const [purchasedBooks, setPurchasedBooks] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'purchased', 'personal'
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const router = useRouter();
  
  // Función para cargar los libros del usuario (incluye biblioteca y compras)
  const loadUserBooks = async () => {
    setIsLoading(true);
    try {
      // Cargar libros de la biblioteca personal
      const libraryBooks = await apiService.getUserBooks();
      setUserBooks(libraryBooks);
      
      // Cargar libros comprados
      const purchased = await apiService.getPurchasedBooks();
      setPurchasedBooks(purchased);
      
      setError(null);
    } catch (err) {
      console.error('Error al obtener los libros:', err);
      setError('No se pudieron cargar tus libros. Por favor, intenta nuevamente más tarde.');
      
      // Si el error es de autenticación, redirigir al login
      if (err.message.includes('autenticación')) {
        router.push('/login');
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cargar los libros al montar el componente
  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      // Si no hay token, redirigir al login
      router.push('/login');
      return;
    }
    
    // Cargar los libros del usuario
    loadUserBooks();
    
    // Escuchar cambios en compras para actualizar la lista
    const handlePurchasesChanged = () => {
      // Recargar solo los libros comprados para evitar refrescar todo
      const updatePurchasedBooks = async () => {
        try {
          const purchased = await apiService.getPurchasedBooks();
          setPurchasedBooks(purchased);
        } catch (err) {
          console.error('Error al actualizar libros comprados:', err);
        }
      };
      
      updatePurchasedBooks();
    };
    
    window.addEventListener('purchases-changed', handlePurchasesChanged);
    
    return () => {
      window.removeEventListener('purchases-changed', handlePurchasesChanged);
    };
  }, [router]);
  
  // Función para eliminar un libro de la biblioteca
  const handleRemoveBook = async (bookId) => {
    if (actionInProgress) return;
    
    setActionInProgress(true);
    try {
      const result = await apiService.removeBookFromLibrary(bookId);
      
      // Actualizar la lista de libros eliminando el que se acaba de quitar
      setUserBooks(prevBooks => prevBooks.filter(book => book._id !== bookId));
      
      // Mostrar notificación de éxito
      setNotification({ 
        show: true, 
        message: result.message || 'Libro eliminado correctamente', 
        type: 'success' 
      });
      
      // Ocultar la notificación después de unos segundos
      setTimeout(() => {
        setNotification({ show: false, message: '', type: 'success' });
      }, 3000);
      
    } catch (err) {
      console.error('Error al eliminar el libro:', err);
      
      // Mostrar notificación de error
      setNotification({ 
        show: true, 
        message: 'Error al eliminar el libro. Inténtalo nuevamente.', 
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
  
  // Mostrar pantalla de carga mientras se obtienen los libros
  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-950">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mb-4"></div>
          <div className="text-amber-500 text-xl">Cargando tu biblioteca...</div>
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
            Mis Libros
          </h1>
          <div className="w-32 h-px bg-gradient-to-r from-amber-600/0 via-amber-500 to-amber-600/0 mx-auto mb-8"></div>
          <p className="text-lg text-stone-300 mb-4 font-serif">
            ¡Bienvenido a tu biblioteca personal! Aquí podrás ver y gestionar tus libros.
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
              onClick={loadUserBooks}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-md transition-colors"
            >
              Intentar nuevamente
            </button>
          </div>
        )}
        
        {/* Pestañas de navegación */}
        {!error && (
          <div className="mb-8">
            <div className="flex border-b border-stone-700/50">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 font-medium transition-colors ${activeTab === 'all' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-stone-300 hover:text-amber-300'}`}
              >
                Colección Completa
              </button>
              <button
                onClick={() => setActiveTab('purchased')}
                className={`px-4 py-2 font-medium transition-colors ${activeTab === 'purchased' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-stone-300 hover:text-amber-300'}`}
              >
                Adquisiciones
                {purchasedBooks.length > 0 && <span className="ml-2 bg-amber-700/50 text-amber-300 text-xs rounded-full px-2 py-0.5">{purchasedBooks.length}</span>}
              </button>
              <button
                onClick={() => setActiveTab('personal')}
                className={`px-4 py-2 font-medium transition-colors ${activeTab === 'personal' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-stone-300 hover:text-amber-300'}`}
              >
                Catálogo Personal
                {userBooks.length > 0 && <span className="ml-2 bg-amber-700/50 text-amber-300 text-xs rounded-full px-2 py-0.5">{userBooks.length}</span>}
              </button>
            </div>
          </div>
        )}
        
        {/* Lista de libros */}
        {!error && (
          <div>
            {/* Vista para "Todos los libros" */}
            {activeTab === 'all' && (
              <div>
                {userBooks.length === 0 && purchasedBooks.length === 0 ? (
                  <div className="py-16 flex flex-col items-center justify-center space-y-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-500/50 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p className="text-stone-400 text-lg text-center mb-4">Aún no tienes libros en tu biblioteca</p>
                    <Link 
                      href="/biblioteca" 
                      className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Explorar libros
                    </Link>
                  </div>
                ) : (
                  <div>
                    {/* Sección de libros comprados si hay alguno */}
                    {purchasedBooks.length > 0 && (
                      <div className="mb-10">
                        <h3 className="text-xl font-serif text-amber-300 mb-4">Adquisiciones Literarias</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {purchasedBooks.map(book => (
                            <div key={`purchased-${book._id}`} className="relative group">
                              <BookCard book={book} />
                              
                              {/* Insignia de comprado */}
                              <div className="absolute top-2 left-2 bg-gradient-to-r from-green-800/90 to-green-900/90 text-green-200 text-xs py-1 px-3 rounded-full border border-green-700/50 shadow-md">
                                Comprado
                              </div>
                              
                              {/* Fecha de compra */}
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-stone-950 p-2 text-xs text-stone-400 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                Comprado: {new Date(book.purchaseDate).toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Sección de libros agregados manualmente si hay alguno */}
                    {userBooks.length > 0 && (
                      <div>
                        <h3 className="text-xl font-serif text-amber-300 mb-4">Catálogo Personal</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {userBooks.map(book => (
                            <div key={`personal-${book._id}`} className="relative group">
                              <BookCard book={book} />
                              
                              {/* Botón para eliminar el libro */}
                              <button
                                onClick={() => handleRemoveBook(book._id)}
                                disabled={actionInProgress}
                                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-900/80 hover:bg-red-800 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md"
                                title="Eliminar de mi biblioteca"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                              
                              {/* Fecha de adición */}
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-stone-950 p-2 text-xs text-stone-400 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                Añadido: {new Date(book.addedOn).toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-10 text-center">
                      <Link 
                        href="/biblioteca" 
                        className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        Explorar más libros
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Vista para "Libros Comprados" */}
            {activeTab === 'purchased' && (
              <div>
                {purchasedBooks.length === 0 ? (
                  <div className="py-16 flex flex-col items-center justify-center space-y-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-500/50 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-stone-400 text-lg text-center mb-4">No hay títulos en tu registro de adquisiciones</p>
                    <Link 
                      href="/biblioteca" 
                      className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Explorar y comprar libros
                    </Link>
                  </div>
                ) : (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {purchasedBooks.map(book => (
                        <div key={`pview-${book._id}`} className="relative group">
                          <BookCard book={book} />
                          
                          {/* Insignia de formato (físico, ebook, etc) */}
                          <div className="absolute top-2 left-2 bg-gradient-to-r from-green-800/90 to-green-900/90 text-green-200 text-xs py-1 px-3 rounded-full border border-green-700/50 shadow-md">
                            {book.format === 'ebook' ? 'Ebook' : book.format === 'audiobook' ? 'Audiolibro' : 'Libro Físico'}
                          </div>
                          
                          {/* Fecha de compra */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-stone-950 p-2 text-xs text-stone-400 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            Comprado: {new Date(book.purchaseDate).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-10 text-center">
                      <Link 
                        href="/biblioteca" 
                        className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        Explorar más libros
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Vista para "Biblioteca Personal" */}
            {activeTab === 'personal' && (
              <div>
                {userBooks.length === 0 ? (
                  <div className="py-16 flex flex-col items-center justify-center space-y-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-500/50 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p className="text-stone-400 text-lg text-center mb-4">Tu catálogo personal está vacío</p>
                    <Link 
                      href="/biblioteca" 
                      className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Explorar libros
                    </Link>
                  </div>
                ) : (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userBooks.map(book => (
                        <div key={`bview-${book._id}`} className="relative group">
                          <BookCard book={book} />
                          
                          {/* Botón para eliminar el libro */}
                          <button
                            onClick={() => handleRemoveBook(book._id)}
                            disabled={actionInProgress}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-900/80 hover:bg-red-800 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md"
                            title="Eliminar de mi biblioteca"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          
                          {/* Fecha de adición */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-stone-950 p-2 text-xs text-stone-400 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            Añadido: {new Date(book.addedOn).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-10 text-center">
                      <Link 
                        href="/biblioteca" 
                        className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        Explorar más libros
                      </Link>
                    </div>
                  </div>
                )}
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
            href="/favorites" 
            className="font-medium text-amber-400 hover:text-amber-300 transition-colors"
          >
            Favoritos
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