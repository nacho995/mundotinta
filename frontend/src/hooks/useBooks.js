'use client';

import { useState, useEffect, useCallback } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

function useBooks() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/books`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status} al obtener los libros`);
      }
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      console.error("Error en fetchBooks:", err);
      setError(err.message);
      setBooks([]); // Asegurarse de que books sea un array vacío en caso de error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return { books, isLoading, error, refetchBooks: fetchBooks };
}

export default useBooks; 