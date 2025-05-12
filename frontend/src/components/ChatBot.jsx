'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RocketIcon, WandSparklesIcon, BookOpenIcon, XCircleIcon, SendIcon, MinusIcon, DownloadIcon } from 'lucide-react';
import { apiService } from '../services/api';
import ChatBotTypingIndicator from './ChatBotTypingIndicator';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Scroll al último mensaje cuando hay nuevos mensajes
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Efecto para enfocar el input cuando el chat está abierto
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      // Añadir mensaje de bienvenida al abrir por primera vez
      setMessages([
        {
          text: '¡Hola! Soy el asistente de Mundo-tinta. Puedes preguntarme sobre nuestro catálogo de libros o cualquier duda que tengas.',
          sender: 'bot'
        }
      ]);
    }
  };

  // Estado para manejar el estado de inicialización del chatbot
  const [isInitialized, setIsInitialized] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);

  // Efecto para verificar el estado de la API de IA al cargar
  useEffect(() => {
    async function checkApiStatus() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
        const response = await fetch(`${backendUrl}/api/chat/status`);

        if (response.ok) {
          const data = await response.json();
          setApiStatus(data);
          setIsInitialized(true);
        } else {
          console.warn('El backend de IA no está disponible');
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error al verificar el estado de la API:', error);
        setIsInitialized(true);
      }
    }

    checkApiStatus();
  }, []);

  // Función para enviar mensaje con estilo ChatGPT
  const sendMessage = async () => {
    if (!input.trim()) return;

    // Mostrar el mensaje del usuario inmediatamente
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setIsLoading(true);
    const userQuestion = input;
    setInput('');

    try {
      // Conectar con el backend de IA real
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

      const response = await fetch(`${backendUrl}/api/chat/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: userQuestion })
      });

      if (!response.ok) {
        throw new Error('Error en la API: ' + response.status);
      }

      const data = await response.json();

      if (data.error) {
        console.warn('Error desde el servidor de IA:', data.message || 'Error desconocido');
      }

      // Simular respuesta de escritura gradual al estilo ChatGPT
      // Primero mostrar un indicador de que el bot está escribiendo
      setMessages(prev => [...prev, { text: '', sender: 'bot', typing: true }]);

      // Dividir la respuesta en "chunks" para mostrarla gradualmente
      const fullAnswer = data.answer || 'No pude obtener una respuesta. Por favor, intenta de nuevo.';

      // Simulamos la escritura gradual dividiendo el texto en segmentos
      const words = fullAnswer.split(' ');
      let displayedWords = [];

      // Función para añadir palabras gradualmente
      const updateAnswer = (index) => {
        if (index < words.length) {
          displayedWords.push(words[index]);

          // Actualizar el último mensaje con el texto parcial
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage.sender === 'bot') {
              lastMessage.text = displayedWords.join(' ');
              lastMessage.typing = index < words.length - 1;
            }
            return newMessages;
          });

          // Continuar con la siguiente palabra con un tiempo aleatorio para que parezca más natural
          const delay = Math.random() * 20 + 10; // entre 10-30ms por palabra
          setTimeout(() => updateAnswer(index + 1), delay);
        } else {
          // Solo buscar libros relacionados cuando sea apropiado
          if (fullAnswer.startsWith('No tenemos') || 
              (userQuestion.toLowerCase().includes('recomienda') || 
               userQuestion.toLowerCase().includes('sugerencia') || 
               userQuestion.toLowerCase().includes('qué libro') || 
               userQuestion.toLowerCase().includes('que libro'))) {
            checkForRelatedBooks(userQuestion, fullAnswer);
          } else {
            setIsLoading(false);
          }
        }
      };

      // Iniciar la simulación de escritura después de un breve retraso
      setTimeout(() => updateAnswer(0), 300);

    } catch (error) {
      console.error('Error al procesar la consulta:', error);
      setMessages(prev => [...prev, {
        text: 'Lo siento, tuve problemas para conectar con mi cerebro. ¿Puedes intentarlo de nuevo?',
        sender: 'bot'
      }]);
      setIsLoading(false);
    }
  };

  // Función para buscar libros relacionados con la consulta - solo cuando es relevante
  const checkForRelatedBooks = async (query, answer) => {
    // No mostrar recomendaciones si tenemos una respuesta específica
    if (answer.includes('Sí, tenemos') && answer.includes('"')) {
      // Si la respuesta ya menciona libros específicos, no hacer recomendaciones
      setIsLoading(false);
      return;
    }
    
    try {
      // Detectar exclusiones del usuario
      const queryLower = query.toLowerCase();
      const excludesRothfuss = queryLower.includes('no rothfuss') || 
                               (queryLower.includes('rothfuss') && 
                                (queryLower.includes('no sea') || 
                                 queryLower.includes('que no') || 
                                 queryLower.includes('excepto') || 
                                 queryLower.includes('sin')));
      
      const excludesSanderson = queryLower.includes('no sanderson') || 
                               (queryLower.includes('sanderson') && 
                                (queryLower.includes('no sea') || 
                                 queryLower.includes('que no') || 
                                 queryLower.includes('excepto') || 
                                 queryLower.includes('sin')));
      
      const excludesAsimov = queryLower.includes('no asimov') || 
                            (queryLower.includes('asimov') && 
                             (queryLower.includes('no sea') || 
                              queryLower.includes('que no') || 
                              queryLower.includes('excepto') || 
                              queryLower.includes('sin')));
      
      const excludesDune = queryLower.includes('no dune') || 
                          (queryLower.includes('dune') && 
                           (queryLower.includes('no sea') || 
                            queryLower.includes('que no') || 
                            queryLower.includes('excepto') || 
                            queryLower.includes('sin')));
                            
      // Palabras clave que indiquen una búsqueda activa
      const specificSearchTerms = [
        'recomienda', 'recomendac', 'sugerencia', 'sugerir', 'qué libro', 'que libro',
        'cuál me', 'cual me', 'similar a', 'parecido a', 'del estilo', 'como los de'
      ];
      
      // Solo mostrar recomendaciones si hay términos de búsqueda específicos
      const isSpecificBookSearch = specificSearchTerms.some(term => queryLower.includes(term));
      
      if (isSpecificBookSearch) {
        // Primero intentar obtener recomendaciones del backend
        try {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
          // Construir query con exclusiones para backend
          let searchQuery = query;
          const booksResponse = await fetch(`${backendUrl}/api/books/search?query=${encodeURIComponent(searchQuery)}`);

          if (booksResponse.ok) {
            const booksData = await booksResponse.json();
            if (booksData.books && booksData.books.length > 0) {
              setMessages(prev => [...prev, {
                text: "Te muestro algunos títulos relacionados:",
                sender: 'bot',
                books: booksData.books.slice(0, 3)
              }]);
              setIsLoading(false);
              return;
            }
          }
        } catch (error) {
          console.warn('Error buscando libros relacionados:', error);
        }

        // Si falla la búsqueda en el backend, construir recomendaciones inteligentes
        // que respeten las exclusiones del usuario
        const recommendedBooks = [];
        
        // Catálogo de respaldo con varias opciones para cada género
        const fantasyBooks = [
          {
            _id: 'f1',
            title: 'El Camino de los Reyes',
            author: 'Brandon Sanderson',
            genre: 'Fantasía Épica',
            coverImage: 'https://m.media-amazon.com/images/I/71+WuA9YlFL._AC_UF1000,1000_QL80_.jpg'
          },
          {
            _id: 'f2',
            title: 'El Nombre del Viento',
            author: 'Patrick Rothfuss',
            genre: 'Fantasía',
            coverImage: 'https://m.media-amazon.com/images/I/81XJBmQZ9mL._AC_UF1000,1000_QL80_.jpg'
          },
          {
            _id: 'f3',
            title: 'Juego de Tronos',
            author: 'George R.R. Martin',
            genre: 'Fantasía Épica',
            coverImage: 'https://m.media-amazon.com/images/I/91+NBrXG-PL._AC_UF1000,1000_QL80_.jpg'
          },
          {
            _id: 'f4',
            title: 'El Ojo del Mundo',
            author: 'Robert Jordan',
            genre: 'Fantasía Épica',
            coverImage: 'https://m.media-amazon.com/images/I/71MxdQ1allL._AC_UF1000,1000_QL80_.jpg'
          }
        ];
        
        const scifiBooks = [
          {
            _id: 's1',
            title: 'Fundación',
            author: 'Isaac Asimov',
            genre: 'Ciencia Ficción',
            coverImage: 'https://m.media-amazon.com/images/I/61sZhswNzPL._AC_UF1000,1000_QL80_.jpg'
          },
          {
            _id: 's2',
            title: 'Dune',
            author: 'Frank Herbert',
            genre: 'Ciencia Ficción',
            coverImage: 'https://m.media-amazon.com/images/I/91DcW0Y5Y9L._AC_UF1000,1000_QL80_.jpg'
          },
          {
            _id: 's3',
            title: 'El Problema de los Tres Cuerpos',
            author: 'Liu Cixin',
            genre: 'Ciencia Ficción',
            coverImage: 'https://m.media-amazon.com/images/I/91yiQzp+eQL._AC_UF1000,1000_QL80_.jpg'
          },
          {
            _id: 's4',
            title: 'Hyperion',
            author: 'Dan Simmons',
            genre: 'Ciencia Ficción',
            coverImage: 'https://m.media-amazon.com/images/I/71pvktXuRQL._AC_UF1000,1000_QL80_.jpg'
          },
          {
            _id: 's5',
            title: 'La Mano Izquierda de la Oscuridad',
            author: 'Ursula K. Le Guin',
            genre: 'Ciencia Ficción',
            coverImage: 'https://m.media-amazon.com/images/I/915ur3-5b8L._AC_UF1000,1000_QL80_.jpg'
          }
        ];
        
        // Filtrar según las exclusiones
        const filteredFantasy = fantasyBooks.filter(book => {
          if (excludesSanderson && book.author.includes('Sanderson')) return false;
          if (excludesRothfuss && book.author.includes('Rothfuss')) return false;
          return true;
        });
        
        const filteredScifi = scifiBooks.filter(book => {
          if (excludesAsimov && book.author.includes('Asimov')) return false;
          if (excludesDune && book.title.includes('Dune')) return false;
          return true;
        });
        
        // Determinar qué género le interesa al usuario
        const wantsFantasy = queryLower.includes('fantasía') || queryLower.includes('fantasia');
        const wantsScifi = queryLower.includes('ciencia ficción') || queryLower.includes('ciencia ficcion') || 
                          queryLower.includes('sci-fi') || queryLower.includes('scifi');
        
        // Seleccionar recomendaciones
        let selectedBooks = [];
        
        if (wantsFantasy && !wantsScifi) {
          // Solo fantasía
          selectedBooks = filteredFantasy;
        } else if (wantsScifi && !wantsFantasy) {
          // Solo ciencia ficción
          selectedBooks = filteredScifi;
        } else {
          // Ambos géneros o ninguno específico
          selectedBooks = [...filteredFantasy, ...filteredScifi];
        }
        
        // Seleccionar hasta 3 libros aleatorios
        const shuffledBooks = selectedBooks.sort(() => 0.5 - Math.random());
        const booksToShow = shuffledBooks.slice(0, Math.min(3, shuffledBooks.length));
        
        // Solo mostrar recomendaciones si tenemos al menos un libro para mostrar
        if (booksToShow.length > 0) {
          setTimeout(() => {
            setMessages(prev => [...prev, {
              text: "Quizá te interesen estos títulos:",
              sender: 'bot',
              books: booksToShow
            }]);
          }, 1000);
        } else {
          // Si no tenemos libros para mostrar después de filtrar
          setTimeout(() => {
            setMessages(prev => [...prev, {
              text: "Lo siento, no tengo recomendaciones que coincidan con tus criterios en este momento. Prueba con otros autores o géneros.",
              sender: 'bot'
            }]);
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error al buscar libros relacionados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderGenreIcon = (genre) => {
    if (!genre) return <BookOpenIcon className="h-4 w-4" />;
    
    const genreLower = genre.toLowerCase();
    if (genreLower.includes('ciencia ficción') || genreLower.includes('sci-fi')) {
      return <RocketIcon className="h-4 w-4" />;
    } else if (genreLower.includes('fantasía') || genreLower.includes('fantasia')) {
      return <WandSparklesIcon className="h-4 w-4" />;
    } else {
      return <BookOpenIcon className="h-4 w-4" />;
    }
  };

  // Renderizar estado de inicialización si el chatbot aún no está listo
  const renderSetupState = () => {
    if (!apiStatus) return null;
    
    if (apiStatus.needsSetup) {
      return (
        <div className="fixed bottom-6 right-6 w-64 bg-stone-900 border border-amber-700/30 rounded-lg shadow-lg overflow-hidden z-50 p-4">
          <h3 className="text-amber-500 font-bold mb-2">Configuración necesaria</h3>
          <p className="text-stone-200 text-sm mb-3">El modelo de IA necesita ser instalado para que el chatbot funcione.</p>
          <button
            onClick={handleModelInstall}
            className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-3 rounded-md flex items-center justify-center w-full"
          >
            <DownloadIcon className="h-4 w-4 mr-2" /> Instalar modelo de IA
          </button>
        </div>
      );
    }
    return null;
  };
  
  // Función para instalar el modelo de IA
  const handleModelInstall = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
      const response = await fetch(`${backendUrl}/api/chat/download-model`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`Modelo ${data.model} instalado correctamente. El chatbot está listo para usarse.`);
        // Recargar estado
        window.location.reload();
      } else {
        alert('Error al instalar el modelo. Por favor, intenta de nuevo más tarde.');
      }
    } catch (error) {
      console.error('Error al instalar modelo:', error);
      alert('Error al instalar el modelo. Por favor, contacta con el administrador.');
    }
  };

  // Si hay un estado de configuración que mostrar, mostrarlo
  if (!isInitialized) {
    return (
      <div className="fixed bottom-6 right-6 bg-amber-600 hover:bg-amber-700 text-white rounded-full p-4 shadow-lg animate-pulse z-50">
        <span className="h-6 w-6 block" />
      </div>
    );
  }
  
  // Renderizar el estado de configuración si es necesario
  const setupElement = renderSetupState();
  
  // Si el chat no está abierto, mostrar solo el botón de activación
  if (!isOpen) {
    return (
      <>
        {setupElement}
        <button 
          onClick={toggleChat}
          className="fixed bottom-6 right-6 bg-amber-600 hover:bg-amber-700 text-white rounded-full p-4 shadow-lg transition-all z-50"
          aria-label="Abrir chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      </>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-stone-900 border border-amber-700/30 rounded-lg shadow-lg overflow-hidden z-50">
      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-700 to-amber-800 text-white">
        <h3 className="font-serif font-bold text-sm">Asistente Mundo-tinta</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setIsOpen(false)} 
            className="text-white/80 hover:text-white"
            aria-label="Minimizar"
          >
            <MinusIcon className="h-5 w-5" />
          </button>
          <button 
            onClick={() => {
              setIsOpen(false);
              setMessages([]);
            }} 
            className="text-white/80 hover:text-white"
            aria-label="Cerrar chat"
          >
            <XCircleIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="h-72 md:h-80 overflow-y-auto p-3 bg-stone-800/50 text-sm">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-3 ${msg.sender === 'user' ? 'text-right' : ''}`}>
            <div className={`inline-block max-w-[85%] p-2 rounded-lg ${
              msg.sender === 'user' 
                ? 'bg-amber-700/80 text-white' 
                : 'bg-stone-700/80 text-stone-100'
            }`}>
              {msg.typing ? (
                <ChatBotTypingIndicator />
              ) : (
                msg.text
              )}
              
              {/* Si hay libros sugeridos */}
              {msg.books && msg.books.length > 0 && (
                <div className="mt-2 flex flex-col gap-2">
                  {msg.books.map(book => (
                    <a 
                      key={book._id || book.id} 
                      href={`/books/${book._id || book.id}`}
                      className="flex items-center bg-stone-800/50 p-2 rounded hover:bg-stone-700/70 transition-all"
                    >
                      {/* Miniatura del libro si está disponible */}
                      {book.coverImage && (
                        <div className="w-10 h-14 flex-shrink-0 mr-2">
                          <img 
                            src={book.coverImage || book.imageUrl} 
                            alt={book.title} 
                            className="w-full h-full object-cover rounded-sm"
                          />
                        </div>
                      )}
                      <div className="text-left">
                        <div className="text-amber-300 text-xs font-medium">{book.title}</div>
                        <div className="text-stone-300 text-xs">{book.author}</div>
                        <div className="flex items-center text-stone-400 text-xs mt-1">
                          {renderGenreIcon(book.genre)}
                          <span className="ml-1">{book.genre || 'Literatura'}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="text-left mb-3">
            <div className="inline-block bg-stone-700/80 text-stone-100 p-2 rounded-lg">
              <ChatBotTypingIndicator />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 border-t border-stone-700 flex">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Haz tu pregunta..."
          className="flex-1 bg-stone-700 text-white px-3 py-2 rounded-l-md focus:outline-none text-sm"
        />
        <button
          onClick={sendMessage}
          disabled={isLoading}
          className="bg-amber-600 hover:bg-amber-700 text-white px-3 rounded-r-md disabled:opacity-50"
        >
          <SendIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
