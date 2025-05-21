'use client';

import { useState, useEffect, useCallback } from 'react';
import { getBooksByGenre } from '@/config/shopify';

// API keys for Google Books
const API_KEY = 'AIzaSyB408qXkUhODOtyNUBQC13KDjvuzFmP3EA';

// Configuración para las solicitudes
const MAX_RESULTS_PER_PAGE = 40;  // Máximo que permite la API
const TOTAL_PAGES_TO_FETCH = 3;   // Número de páginas a obtener (total: MAX_RESULTS_PER_PAGE * TOTAL_PAGES_TO_FETCH)

// Definición de varias consultas para obtener más libros
const QUERIES = {
  sciFi: [
    // Búsquedas combinando género con editoriales de prestigio
    'ciencia+ficcion+inpublisher:planeta',
    'ciencia+ficcion+inpublisher:ediciones+b',
    'ciencia+ficcion+inpublisher:minotauro',
    'ciencia+ficcion+inpublisher:gigamesh',
    'ciencia+ficcion+inpublisher:nova',
    'subject:science+fiction+inpublisher:ediciones+destino',
    // Búsquedas por autores reconocidos
    'author:asimov+ciencia+ficcion',
    'author:philip+k+dick+ciencia+ficcion',
    'author:arthur+c+clarke+ciencia+ficcion',
    'author:ursula+k+leguin+ciencia+ficcion',
    'author:orson+scott+card+ciencia+ficcion',
    'author:ray+bradbury+ciencia+ficcion',
    // Autores en español
    'author:cesar+mallorqui+ciencia+ficcion',
    'author:eduardo+vaquerizo+ciencia+ficcion',
    'author:rosa+montero+ciencia+ficcion',
    'author:javier+negrete+ciencia+ficcion',
    'author:elia+barceló+ciencia+ficcion',
    // Colecciones reconocidas
    'ciencia+ficcion+coleccion+nova',
    'ciencia+ficcion+premio+hugo',
    'ciencia+ficcion+premio+nebula'
  ],
  fantasy: [
    // Búsquedas combinando género con editoriales de prestigio
    'fantasia+inpublisher:planeta',
    'fantasia+inpublisher:minotauro',
    'fantasia+inpublisher:timun+mas',
    'fantasia+inpublisher:ediciones+b',
    'fantasia+inpublisher:alfaguara',
    'subject:fantasy+inpublisher:gigamesh',
    // Búsquedas por autores reconocidos
    'author:j+r+r+tolkien+fantasia',
    'author:george+r+r+martin+fantasia',
    'author:patrick+rothfuss+fantasia',
    'author:brandon+sanderson+fantasia',
    'author:terry+pratchett+fantasia',
    'author:andrzej+sapkowski+fantasia',
    'author:neil+gaiman+fantasia',
    // Autores en español
    'author:laura+gallego+fantasia',
    'author:javier+ruesc+fantasia',
    'author:cristina+lopez+barrio+fantasia',
    'author:matilde+asensi+fantasia',
    // Colecciones y premios reconocidos
    'fantasia+premio+internacional',
    'fantasia+coleccion+alamut',
    'fantasia+novela+ganadora'
  ]
};

// Editoriales reconocidas para filtrado
const PRESTIGIOSAS_EDITORIALES = [
  'Planeta', 'Minotauro', 'Ediciones B', 'Alfaguara', 'Anagrama', 'Timun Mas', 'Gigamesh',
  'Nova', 'Destino', 'Edhasa', 'Tusquets', 'Suma', 'Plaza & Janés', 'Espasa', 'Alianza Editorial',
  'Penguin Random House', 'Debolsillo', 'Siruela', 'RBA', 'Alamut', 'Bibliopolis', 'Valdemar',
  'Booket', 'Ediciones Martínez Roca', 'Austral', 'Gollancz', 'Tor Books', 'Del Rey', 'Ace Books'
];

// Autores reconocidos para filtrado
const AUTORES_RECONOCIDOS = [
  // Internacionales
  'Asimov', 'Clarke', 'Bradbury', 'Heinlein', 'Herbert', 'Dick', 'Le Guin', 'Card', 'Gibson',
  'Tolkien', 'Martin', 'Rothfuss', 'Sanderson', 'Pratchett', 'Jordan', 'Gaiman', 'Erikson',
  'Sapkowski', 'Goodkind', 'Rowling', 'Brooks', 'King', 'Abercrombie', 'Hobb', 'Weeks',
  // Españoles
  'Gallego', 'Vaquerizo', 'Negrete', 'Barceló', 'Montero', 'Zafón', 'Asensi', 'Mallorqui',
  'Ruescas', 'López Barrio', 'Llobera', 'Siscar', 'Cotrina', 'Romero', 'Lozano', 'Roca'
];

function useGoogleBooks() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setBooks([]);
    
    try {
      // Obtener libros desde Shopify usando shopify-buy
      const allBooks = await getBooksByGenre();
      
      console.log(`Libros obtenidos de Shopify: ${allBooks.length}`);
      
      // Establecer los libros en el estado
      setBooks(allBooks);
    } catch (err) {
      console.error("Error al cargar libros:", err);
      setError(err.message || 'Nuestra biblioteca está en mantenimiento. Vuelve pronto para descubrir nuevos mundos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return { books, isLoading, error, refetchBooks: fetchBooks };
}

export default useGoogleBooks;
