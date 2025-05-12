"use client";

import { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto del carrito
const CartContext = createContext();

// Proveedor del contexto del carrito
export function CartProvider({ children }) {
  // Estado para almacenar los items del carrito
  const [cartItems, setCartItems] = useState([]);
  
  // Cargar el carrito del localStorage al iniciar
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);
  
  // Guardar el carrito en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);
  
  // Añadir un libro al carrito
  const addToCart = (book) => {
    setCartItems((prevItems) => {
      // Verificar si el libro ya está en el carrito
      const existingItem = prevItems.find(item => item.id === book.id);
      
      if (existingItem) {
        // Si ya existe, incrementar cantidad
        return prevItems.map(item => 
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Si no existe, añadir nuevo libro con cantidad 1
        return [...prevItems, { ...book, quantity: 1 }];
      }
    });
    
    // Disparar evento personalizado para notificar cambios en el carrito
    window.dispatchEvent(new Event('cart-updated'));
  };
  
  // Remover libro del carrito
  const removeFromCart = (bookId) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.filter(item => item.id !== bookId);
      return updatedCart;
    });
    
    // Disparar evento personalizado
    window.dispatchEvent(new Event('cart-updated'));
  };
  
  // Incrementar cantidad de un libro
  const increaseQuantity = (bookId) => {
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item.id === bookId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
    window.dispatchEvent(new Event('cart-updated'));
  };
  
  // Disminuir cantidad de un libro
  const decreaseQuantity = (bookId) => {
    setCartItems((prevItems) => {
      // Encontrar el item y verificar su cantidad
      const targetItem = prevItems.find(item => item.id === bookId);
      
      if (targetItem.quantity === 1) {
        // Si la cantidad es 1, remover el libro
        return prevItems.filter(item => item.id !== bookId);
      } else {
        // Sino, disminuir la cantidad
        return prevItems.map(item =>
          item.id === bookId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
    });
    window.dispatchEvent(new Event('cart-updated'));
  };
  
  // Limpiar el carrito
  const clearCart = () => {
    setCartItems([]);
    window.dispatchEvent(new Event('cart-updated'));
  };
  
  // Obtener la cantidad total de items
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };
  
  // Redirección a Amazon como afiliado
  const redirectToAmazon = (bookTitle, isbn) => {
    // Crear URL de afiliado de Amazon
    // Amazon Associate ID: reemplazar "your-affiliate-id" con tu ID de afiliado real
    const affiliateId = "your-affiliate-id";
    const searchQuery = encodeURIComponent(bookTitle || isbn);
    const amazonUrl = `https://www.amazon.es/s?k=${searchQuery}&tag=${affiliateId}`;
    
    // Abrir en una nueva pestaña
    window.open(amazonUrl, '_blank');
    
    return true;
  };
  
  // Redirección para comprar todo el carrito
  const buyAllItems = () => {
    // Crear URL con todos los ISBNs o títulos
    const searchQuery = cartItems
      .map(item => encodeURIComponent(item.isbn || item.title))
      .join('+');
    
    // Amazon Associate ID: reemplazar "your-affiliate-id" con tu ID de afiliado real
    const affiliateId = "your-affiliate-id";
    const amazonUrl = `https://www.amazon.es/s?k=${searchQuery}&tag=${affiliateId}`;
    
    // Abrir en una nueva pestaña
    window.open(amazonUrl, '_blank');
    
    // Opcionalmente, limpiar el carrito después de la compra
    // clearCart();
    
    return true;
  };
  
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        getTotalItems,
        redirectToAmazon,
        buyAllItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook personalizado para usar el contexto del carrito
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}
