"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { createCheckout } from '@/config/shopify';

// Crear el contexto del carrito
const CartContext = createContext();

// Proveedor del contexto del carrito
export function CartProvider({ children }) {
  // Estado para almacenar los items del carrito
  const [cartItems, setCartItems] = useState([]);
  const [isClient, setIsClient] = useState(false);
  
  // Inicializar desde localStorage cuando se monta el componente
  useEffect(() => {
    setIsClient(true);
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error al cargar el carrito desde localStorage:', e);
      }
    }
  }, []);
  
  // Guardar en localStorage cuando cambie el carrito
  useEffect(() => {
    if (isClient && cartItems.length > 0) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, isClient]);
  
  // Añadir un libro al carrito
  const addToCart = (book) => {
    setCartItems(prevItems => {
      // Verificar si el libro ya está en el carrito con el mismo formato
      const existingItemIndex = prevItems.findIndex(
        item => item.id === book.id && item.format === book.format
      );

      // Si el libro ya existe, incrementar la cantidad
      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      }

      // Si no existe, añadir el nuevo libro con cantidad 1
      return [...prevItems, { ...book, quantity: 1 }];
    });
  };
  
  // Eliminar un libro del carrito
  const removeFromCart = (bookId) => {
    setCartItems(prevItems => 
      prevItems.filter(item => item.id !== bookId)
    );
  };
  
  // Aumentar cantidad
  const increaseQuantity = (bookId) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === bookId 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      )
    );
  };
  
  // Disminuir cantidad
  const decreaseQuantity = (bookId) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === bookId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      )
    );
  };
  
  // Vaciar carrito
  const clearCart = () => {
    setCartItems([]);
    if (isClient) {
      localStorage.removeItem('cartItems');
    }
  };
  
  // Obtener el número total de items en el carrito
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  };
  
  // Procesar compra
  const buyAllItems = async () => {
    try {
      // Preparar los items para Shopify
      const shopifyItems = cartItems.map(item => ({
        variantId: item.variantId || item.formats?.find(f => f.type === item.format)?.variantId,
        quantity: item.quantity
      })).filter(item => item.variantId); // Filtrar items sin variantId

      if (shopifyItems.length === 0) {
        throw new Error("No hay productos válidos en el carrito");
      }

      // Crear el checkout
      const checkoutUrl = await createCheckout(shopifyItems);
      
      // Redirigir al checkout de Shopify
      window.location.href = checkoutUrl;
      
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      alert("Ha ocurrido un error al procesar la compra. Por favor, inténtalo de nuevo.");
    }
  };
  
  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      buyAllItems,
      getTotalItems
    }}>
      {children}
    </CartContext.Provider>
  );
}

// Hook personalizado para usar el contexto del carrito
export function useCart() {
  return useContext(CartContext);
}
