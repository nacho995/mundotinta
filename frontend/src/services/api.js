'use client';

import { placeholderBooks } from '../data/placeholderBooks';

// URL base para la API
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

// Variable para controlar si estamos usando datos de respaldo
let isUsingFallbackData = false;

// Función para manejar la expiración del token y cerrar sesión
const handleTokenExpired = () => {
  if (typeof window !== 'undefined') {
    // Limpiar localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    
    // Disparar evento para actualizar componentes que dependen del estado de autenticación
    const event = new CustomEvent('authStateChanged', { detail: { isAuthenticated: false } });
    window.dispatchEvent(event);
    
    // Redirigir a la página de login
    window.location.href = '/login';
  }
};

// Función para obtener el token de autenticación
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Función auxiliar para manejar el parseo seguro de JSON
const safeParseJSON = async (response) => {
  const text = await response.text();
  try {
    // Intentar parsear como JSON
    return text ? JSON.parse(text) : {};
  } catch (error) {
    // Si no es JSON válido, devolver un objeto con el mensaje de error y el texto
    console.warn('Respuesta recibida no es JSON válido');
    return {
      success: false,
      isJsonError: true,
      message: 'Respuesta del servidor no es JSON válido',
      originalText: text.substring(0, 150) + '...' // Solo guardamos un fragmento para depuración
    };
  }
};

// Función para guardar datos en localStorage
const saveToLocalStorage = (key, data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

// Función para obtener datos de localStorage
const getFromLocalStorage = (key, defaultValue = []) => {
  if (typeof window !== 'undefined') {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error(`Error recuperando ${key} de localStorage:`, error);
      return defaultValue;
    }
  }
  return defaultValue;
};

// Definición del servicio de API
export const apiService = {
  // Exportamos funciones de utilidad de localStorage dentro del objeto apiService
  saveToLocalStorage,
  getFromLocalStorage,
  // Función para obtener los libros del usuario
  getUserBooks: async () => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autorizado: Token no proporcionado');
    }
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/library/user-library`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Verificar si es un error de token expirado o no válido
        if (response.status === 401) {
          console.log('Token expirado o no válido. Cerrando sesión...');
          handleTokenExpired();
          throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
        }
        
        throw new Error(errorData.message || 'Error al obtener los libros del usuario');
      }
      
      const data = await response.json();
      
      // Mapear los datos del backend al formato que espera la aplicación
      return data.books.map(book => ({
        ...book,
        _id: book.id || book._id, // Usar id o _id según lo que devuelva el backend
        coverImage: book.imageUrl || book.coverImage, // Asegurar consistencia en los nombres de campos
        addedOn: book.addedOn || book.createdAt || new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error al obtener libros del usuario:', error);
      throw error;
    }
  },
  
  // Función para obtener los libros favoritos del usuario
  getFavoriteBooks: async () => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/library/user-favorites`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Verificar si es un error de token expirado o no válido
        if (response.status === 401) {
          console.log('Token expirado o no válido. Cerrando sesión...');
          handleTokenExpired();
          throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
        }
        
        throw new Error(errorData.message || 'Error al obtener los libros favoritos');
      }
      
      const data = await response.json();
      
      // Mapear los datos del backend al formato que espera la aplicación
      return data.favorites.map(book => ({
        ...book,
        _id: book.id || book._id, // Usar id o _id según lo que devuelva el backend
        coverImage: book.imageUrl || book.coverImage, // Asegurar consistencia en los nombres de campos
        addedToFavorites: book.addedToFavorites || book.favoriteDate || new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error al obtener libros favoritos:', error);
      throw error;
    }
  },
  
  // Función para añadir un libro a la biblioteca personal
  addBookToLibrary: async (bookId) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    // Simular una llamada a la API con un retraso
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Simular respuesta exitosa
    return { success: true, message: 'Libro añadido a tu biblioteca' };
  },
  
  // Función para eliminar un libro de la biblioteca personal
  removeBookFromLibrary: async (bookId) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    // Simular una llamada a la API con un retraso
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Simular respuesta exitosa
    return { success: true, message: 'Libro eliminado de tu biblioteca' };
  },
  
  // Función para verificar si un libro está en favoritos
  isBookInFavorites: async (bookId) => {
    const token = getAuthToken();
    if (!token) {
      return false; // Si no hay token, no puede estar en favoritos
    }
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/books/${bookId}/is-favorite`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Si tenemos respuesta 404 o 401/403, asumimos que no está en favoritos
      if (response.status === 404 || response.status === 401 || response.status === 403) {
        return false;
      }
      
      // Usar safeParseJSON para evitar errores con respuestas no válidas
      const data = await safeParseJSON(response);
      
      // Si hay error de parsing JSON, asumimos que no está en favoritos
      if (data.isJsonError) {
        console.warn('Error de JSON al verificar favorito, asumiendo que no está en favoritos');
        return false;
      }
      
      // Si todo va bien, devolver el valor
      return data.isFavorite || false;
    } catch (error) {
      console.error('Error al verificar favorito:', error);
      return { isFavorite: false };
    }
  },
  
  // Función para añadir un libro a favoritos
  addBookToFavorites: async (bookId) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/books/${bookId}/favorite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Verificar si es un error de token expirado o no válido
        if (response.status === 401) {
          console.log('Token expirado o no válido. Cerrando sesión...');
          handleTokenExpired();
          throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
        }
        
        throw new Error(errorData.message || 'Error al añadir a favoritos');
      }
      
      const data = await response.json();
      
      // Disparar evento para notificar cambios en favoritos
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('favorites-changed'));
      }
      
      return { success: true, message: data.message || 'Libro añadido a favoritos' };
    } catch (error) {
      console.error('Error al añadir a favoritos:', error);
      throw error;
    }
  },
  
  // Función para eliminar un libro de favoritos
  removeBookFromFavorites: async (bookId) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/books/${bookId}/favorite`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Verificar si es un error de token expirado o no válido
        if (response.status === 401) {
          console.log('Token expirado o no válido. Cerrando sesión...');
          handleTokenExpired();
          throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
        }
        
        throw new Error(errorData.message || 'Error al eliminar de favoritos');
      }
      
      const data = await response.json();
      
      // Disparar evento para notificar cambios en favoritos
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('favorites-changed'));
      }
      
      return { success: true, message: data.message || 'Libro eliminado de favoritos' };
    } catch (error) {
      console.error('Error al eliminar de favoritos:', error);
      throw error;
    }
  },
  
  // Función para marcar un libro como comprado manualmente
  markBookAsPurchased: async (bookId, purchaseInfo = {}) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    try {
      // Preparar datos para enviar, soportando múltiples formatos
      let requestBody = {
        purchaseDate: purchaseInfo.date || new Date().toISOString(),
        source: purchaseInfo.source || 'manual'
      };
      
      // Si tenemos formato único o múltiples formatos
      if (purchaseInfo.format) {
        requestBody.format = purchaseInfo.format;
      } else if (purchaseInfo.formats && Array.isArray(purchaseInfo.formats)) {
        requestBody.formats = purchaseInfo.formats;
      }
      
      // Añadir cualquier otro campo que esté en purchaseInfo
      requestBody = { ...requestBody, ...purchaseInfo };

      try {
        // Intentar realizar la petición con manejo de errores mejorado
        const response = await fetch(`${BACKEND_URL}/api/books/${bookId}/purchase`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });
        
        // Procesar respuesta con safeParseJSON (evita errores con respuestas no-JSON)
        const data = await safeParseJSON(response);
        
        // Si la respuesta es OK y no hay errores de JSON, usar la respuesta del servidor
        if (response.ok && !data.isJsonError) {
          // Guardar localmente la información del libro comprado
          const userPurchases = getFromLocalStorage('user_purchases', []);
          
          // Añadir la compra local solo si no existe ya
          const alreadyPurchased = userPurchases.some(p => p.bookId === bookId);
          if (!alreadyPurchased) {
            userPurchases.push({
              bookId,
              formats: requestBody.formats || [requestBody.format || 'physical'],
              purchaseDate: requestBody.purchaseDate,
              source: requestBody.source
            });
            saveToLocalStorage('user_purchases', userPurchases);
          }
          
          // Disparar evento para notificar cambios en las compras
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('purchases-changed'));
          }
          
          return { success: true, message: data.message || 'Libro marcado como comprado' };
        }
      } catch (serverError) {
        console.warn('Error al comunicar con el servidor, usando fallback local:', serverError);
        // No hacer nada aquí, continuamos con el manejo offline
      }
      
      // === Modo de respaldo offline - si el servidor no responde o da error ===
      console.info('Usando modo offline para marcar el libro como comprado');
      
      // Guardar localmente la información del libro comprado
      const userPurchases = getFromLocalStorage('user_purchases', []);
      
      // Añadir la compra local solo si no existe ya
      const alreadyPurchased = userPurchases.some(p => p.bookId === bookId);
      if (!alreadyPurchased) {
        userPurchases.push({
          bookId,
          formats: requestBody.formats || [requestBody.format || 'physical'],
          purchaseDate: requestBody.purchaseDate,
          source: requestBody.source
        });
        saveToLocalStorage('user_purchases', userPurchases);
      }
      
      // Disparar evento para notificar cambios en las compras
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('purchases-changed'));
      }
      
      // Simular respuesta exitosa para mantener la experiencia de usuario
      return { 
        success: true, 
        message: 'Libro marcado como comprado localmente', 
        offline: true 
      };
    } catch (error) {
      console.error('Error al marcar como comprado:', error);
      throw error;
    }
  },
  
  // Función para obtener los libros comprados por el usuario
  getPurchasedBooks: async () => {
    const token = getAuthToken();
    let remoteBooks = [];
    let hasServerError = false;

    // Intentar obtener compras del servidor si hay token
    if (token) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/library/purchases`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        // Si es un error de autenticación o no encontrado, continuamos con los datos locales
        if (response.status === 401 || response.status === 403 || response.status === 404) {
          console.warn('No se pudieron obtener las compras del servidor: ' + response.status);
          hasServerError = true;
        } else {
          // Usar safeParseJSON para evitar errores con respuestas HTML
          const data = await safeParseJSON(response);
          
          // Si hubo error de parsing JSON, seguimos con los datos locales
          if (data.isJsonError) {
            console.warn('Error al parsear JSON de compras del servidor');
            hasServerError = true;
          } else if (!response.ok) {
            // Si la respuesta no es ok pero tenemos un JSON válido
            console.warn('Error al obtener compras del servidor:', data.message || 'Error desconocido');
            hasServerError = true;
          } else if (!data.purchases || !Array.isArray(data.purchases)) {
            // Si no hay compras o la estructura no es la esperada
            console.warn('El formato de respuesta para compras no es el esperado');
            hasServerError = true;
          } else {
            // Procesamos los datos del servidor
            remoteBooks = data.purchases.map(purchase => ({
              ...purchase.book,
              _id: purchase.book?.id || purchase.book?._id || purchase.bookId,
              coverImage: purchase.book?.imageUrl || purchase.book?.coverImage || '/images/covers/default-book-cover.jpg',
              purchaseDate: purchase.purchaseDate || purchase.createdAt || new Date().toISOString(),
              format: purchase.format || 'physical'
            }));
          }
        }
      } catch (error) {
        console.error('Error al obtener libros comprados del servidor:', error);
        hasServerError = true;
      }
    }

    // Si no hay token o hubo error con el servidor, obtenemos solo los datos locales
    if (!token || hasServerError) {
      try {
        // Obtener compras guardadas localmente
        const localPurchases = getFromLocalStorage('user_purchases', []);
        
        if (localPurchases.length > 0) {
          console.info('Usando datos locales de compras');
          
          // Intentar obtener detalles de los libros del catálogo general
          const localBooksWithDetails = [];
          
          // Para cada compra local, intentamos obtener los detalles del libro
          for (const purchase of localPurchases) {
            try {
              // Intentar obtener detalles del libro desde el catálogo
              const bookResponse = await fetch(`${BACKEND_URL}/api/books/${purchase.bookId}`);
              
              if (bookResponse.ok) {
                const bookData = await safeParseJSON(bookResponse);
                if (!bookData.isJsonError) {
                  // Añadir el libro con detalles
                  localBooksWithDetails.push({
                    ...bookData,
                    _id: bookData.id || bookData._id,
                    coverImage: bookData.imageUrl || bookData.coverImage || '/images/covers/default-book-cover.jpg',
                    purchaseDate: purchase.purchaseDate,
                    formats: purchase.formats
                  });
                  continue; // Pasar al siguiente libro
                }
              }
              
              // Si no pudimos obtener detalles, añadir una versión minimal del libro
              localBooksWithDetails.push({
                _id: purchase.bookId,
                title: `Libro #${purchase.bookId}`,
                coverImage: '/images/covers/default-book-cover.jpg',
                purchaseDate: purchase.purchaseDate,
                formats: purchase.formats,
                offlineData: true
              });
              
            } catch (err) {
              console.warn(`Error al obtener detalles del libro ${purchase.bookId}:`, err);
              // Añadir versión minimal en caso de error
              localBooksWithDetails.push({
                _id: purchase.bookId,
                title: `Libro #${purchase.bookId}`,
                coverImage: '/images/covers/default-book-cover.jpg',
                purchaseDate: purchase.purchaseDate,
                formats: purchase.formats,
                offlineData: true
              });
            }
          }
          
          // Si tenemos libros locales, los combinamos con los remotos (si existen)
          if (localBooksWithDetails.length > 0) {
            // Combinar libros remotos y locales, evitando duplicados por ID
            const combinedBooks = [...remoteBooks];
            
            // Añadir solo libros locales que no estén ya en los remotos
            for (const localBook of localBooksWithDetails) {
              const alreadyExists = combinedBooks.some(book => 
                book._id.toString() === localBook._id.toString());
              
              if (!alreadyExists) {
                combinedBooks.push(localBook);
              }
            }
            
            return combinedBooks;
          }
        }
      } catch (localError) {
        console.error('Error al procesar compras locales:', localError);
      }
    }
    
    // Si llegamos aquí, devolvemos los libros remotos (podría ser un array vacío)
    return remoteBooks;
  },
  
  // Función para obtener información del usuario
  getUserProfile: async () => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/user/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Verificar si es un error de token expirado o no válido
        if (response.status === 401) {
          console.log('Token expirado o no válido. Cerrando sesión...');
          handleTokenExpired();
          throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
        }
        
        throw new Error(errorData.message || 'Error al obtener el perfil del usuario');
      }
      
      const data = await response.json();
      
      // Mapear los datos del backend al formato que espera la aplicación
      return {
        name: data.name || 'Usuario',
        email: data.email || 'Sin correo electrónico',
        booksCount: data.booksCount || 0,
        favoritesCount: data.favoritesCount || 0,
        memberSince: data.registeredOn || data.createdAt || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error al obtener perfil de usuario:', error);
      throw error;
    }
  },
  
  // Función simplificada para procesar consultas del chatbot
  processChatQuery: async (query) => {
    try {
      // Verificar si hay conexión al backend
      const isBackendAvailable = await apiService.isBackendAvailable();
      
      if (!isBackendAvailable) {
        // Si no hay conexión, usar el fallback directamente (más rápido)
        console.log('Backend no disponible, usando fallback directo');
        return await apiService.processChatQueryFallback(query);
      }
      
      // Si hay conexión, intentar usar la API
      const token = getAuthToken();
      const headers = { 'Content-Type': 'application/json' };
      
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      // Simplificamos el payload para reducir tamaño
      const payload = { query };
      
      const response = await fetch(`${BACKEND_URL}/api/chat/query`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        return await apiService.processChatQueryFallback(query);
      }
      
      // Procesar respuesta exitosa
      const data = await response.json();
      
      // Añadir sugerencias de libros si la pregunta parece estar relacionada
      if (data.answer && !data.suggestedBooks && query.toLowerCase().includes('libro')) {
        try {
          // Búsqueda simplificada y directa
          const books = await apiService.searchBooks(query);
          if (books && books.length > 0) {
            data.suggestedBooks = books.slice(0, 3);
          }
        } catch (err) {
          console.error('Error al buscar libros sugeridos:', err);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error procesando consulta de chat:', error);
      return await apiService.processChatQueryFallback(query);
    }
  },
  
  // Comprobar si el backend está disponible
  isBackendAvailable: async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300); // Timeout de 300ms
      
      const response = await fetch(`${BACKEND_URL}/api/health`, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.log('Backend no alcanzable:', error.name);
      return false;
    }
  },
  
  // Implementación de fallback para el chatbot cuando el backend no está disponible
  processChatQueryFallback: async (query) => {
    // Respuestas predefinidas para preguntas comunes
    const commonResponses = {
      'hola': '¡Hola! Soy el asistente de Mundo-tinta. ¿En qué puedo ayudarte hoy?',
      'que eres': 'Soy el asistente virtual de Mundo-tinta, diseñado para ayudarte a encontrar libros y responder tus preguntas sobre nuestra librería.',
      'horario': 'Somos una librería online disponible 24/7. ¡Puedes explorar nuestro catálogo en cualquier momento!',
      'contacto': 'Puedes contactarnos a través de nuestro formulario en la sección de contacto o enviando un correo a info@mundotinta.com',
      'envío': 'Los envíos suelen realizarse en un plazo de 2-5 días hábiles. Consulta nuestra política de envíos para más detalles.',
      'devoluciones': 'Aceptamos devoluciones en un plazo de 30 días desde la recepción del producto.',
      'novedades': 'Puedes consultar nuestras últimas novedades en la página principal o en la sección de "Novedades".',
      'géneros': 'Tenemos una amplia selección de géneros, incluyendo fantasía, ciencia ficción, misterio, romance, y muchos más. ¿Hay algún género específico que te interese?',
      'ebook': 'Sí, muchos de nuestros libros están disponibles en formato ebook. Puedes ver las opciones específicas en la página de cada libro.',
      'audiolibro': 'Algunos títulos están disponibles como audiolibros. Esta información aparece en la página de cada libro cuando está disponible.',
      'ayuda': 'Puedo ayudarte a encontrar libros, información sobre envíos, políticas de la tienda o resolver cualquier duda sobre Mundo-tinta. ¿Qué necesitas saber?'
    };
    
    // Verificar si la consulta coincide con alguna pregunta común
    const queryLower = query.toLowerCase();
    for (const [keyword, response] of Object.entries(commonResponses)) {
      if (queryLower.includes(keyword)) {
        return { answer: response };
      }
    }
    
    // Respuesta para preguntas sobre libros o recomendaciones
    if (queryLower.includes('recomienda') || queryLower.includes('sugieres') || queryLower.includes('mejor libro')) {
      return {
        answer: 'Tenemos muchos libros excelentes en nuestro catálogo. Si buscas recomendaciones, te sugiero explorar nuestra sección de "Destacados" en la página principal o decirme qué género te interesa para recomendaciones más específicas.'
      };
    }
    
    // Respuesta genérica para otras preguntas
    return {
      answer: 'Gracias por tu pregunta. En Mundo-tinta nos especializamos en libros de diversos géneros, con un enfoque especial en fantasía y ciencia ficción. Si necesitas ayuda para encontrar un libro específico o información sobre nuestra tienda, no dudes en preguntar.'
    };
  },
  
  // Función para buscar libros por palabras clave
  searchBooks: async (searchTerms) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/books/search?query=${encodeURIComponent(searchTerms)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.warn('Error en búsqueda de libros, usando fallback');
        // Fallback: devolver algunos libros aleatorios del catálogo
        const allBooks = await apiService.getRecommendedBooks();
        return allBooks.slice(0, 3);
      }
      
      const data = await response.json();
      return data.books || [];
    } catch (error) {
      console.error('Error en búsqueda de libros:', error);
      return [];
    }
  },
  
  // Función para obtener géneros literarios
  getGenres: async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/genres`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        // Fallback: devolver géneros predefinidos
        return [
          { id: 'fantasia', name: 'Fantasía' },
          { id: 'ciencia-ficcion', name: 'Ciencia Ficción' },
          { id: 'misterio', name: 'Misterio' },
          { id: 'romance', name: 'Romance' },
          { id: 'aventura', name: 'Aventura' }
        ];
      }
      
      const data = await response.json();
      return data.genres || [];
    } catch (error) {
      console.error('Error al obtener géneros:', error);
      // Fallback
      return [
        { id: 'fantasia', name: 'Fantasía' },
        { id: 'ciencia-ficcion', name: 'Ciencia Ficción' }
      ];
    }
  },
  
  // Función para obtener libros por género
  getBooksByGenre: async (genreId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/books/genre/${genreId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        // Fallback: devolver algunos libros aleatorios
        return await apiService.getRecommendedBooks();
      }
      
      const data = await response.json();
      return data.books || [];
    } catch (error) {
      console.error('Error al obtener libros por género:', error);
      return [];
    }
  },
  
  // Función para obtener libros recomendados
  getRecommendedBooks: async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/books/recommended`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        // Si no hay recomendaciones, intentar obtener libros destacados
        const featuredResponse = await fetch(`${BACKEND_URL}/api/books/featured`);
        
        if (featuredResponse.ok) {
          const featuredData = await featuredResponse.json();
          return featuredData.books || [];
        }
        
        // Si ambos fallan, devolver una lista vacía
        console.warn('No se pudieron obtener libros recomendados');
        return [];
      }
      
      const data = await response.json();
      return data.books || [];
    } catch (error) {
      console.error('Error al obtener libros recomendados:', error);
      return [];
    }
  }
};

export default apiService;
