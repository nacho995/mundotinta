"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    buyAllItems
  } = useCart();
  
  const [isClient, setIsClient] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  // Manejar el renderizado del lado del cliente
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Calcular el monto total
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    setTotalAmount(total);
  }, [cartItems]);

  // Función para manejar la compra
  const handleCheckout = () => {
    buyAllItems();
    // Opcional: limpiar el carrito después de la compra
    // clearCart();
  };

  if (!isClient) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-amber-200">Cargando carrito...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-amber-200">Tu Carrito de Compra</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-6 text-stone-300 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-stone-300 mb-4">Tu carrito está vacío</h2>
          <p className="text-stone-400 mb-8 max-w-md mx-auto">
            Parece que aún no has añadido ningún libro a tu carrito. Explora nuestra biblioteca para encontrar tu próxima lectura.
          </p>
          <Link 
            href="/biblioteca" 
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg hover:shadow-amber-700/30"
          >
            Explorar Libros
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2">
            <div className="bg-stone-900/60 rounded-xl border border-stone-700/50 shadow-xl overflow-hidden">
              <div className="divide-y divide-stone-700/50">
                {cartItems.map((book) => (
                  <div key={book.id} className="p-4 md:p-6 flex flex-col md:flex-row gap-4">
                    {/* Imagen del libro */}
                    <div className="w-24 h-32 md:w-28 md:h-40 flex-shrink-0 mx-auto md:mx-0">
                      <div className="relative w-full h-full rounded-md overflow-hidden shadow-lg">
                        <Image 
                          src={book.coverImage || '/images/placeholder-book.png'} 
                          alt={book.title} 
                          width={112}
                          height={160}
                          className="object-cover transition-all duration-300 hover:scale-105" 
                        />
                      </div>
                    </div>
                    
                    {/* Información del libro */}
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-amber-100">{book.title}</h3>
                          <p className="text-stone-400">{book.author}</p>
                        </div>
                        <div className="text-right mt-2 md:mt-0">
                          <p className="text-lg font-semibold text-amber-200">
                            {book.price ? `€${book.price.toFixed(2)}` : 'Precio no disponible'}
                          </p>
                        </div>
                      </div>
                      
                      {/* Controles de cantidad */}
                      <div className="mt-4 flex justify-between items-end">
                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={() => decreaseQuantity(book.id)} 
                            className="p-1 rounded-md hover:bg-stone-800 text-stone-400 hover:text-amber-200 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          
                          <span className="w-8 text-center text-stone-300">{book.quantity}</span>
                          
                          <button 
                            onClick={() => increaseQuantity(book.id)} 
                            className="p-1 rounded-md hover:bg-stone-800 text-stone-400 hover:text-amber-200 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(book.id)} 
                          className="text-stone-500 hover:text-red-500 transition-colors flex items-center space-x-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span className="text-sm">Eliminar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-stone-900/60 rounded-xl border border-stone-700/50 shadow-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-amber-200 mb-4">Resumen de Compra</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-stone-300">
                  <span>Total Productos:</span>
                  <span>{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
                </div>
                
                {totalAmount > 0 && (
                  <div className="flex justify-between font-semibold text-amber-100">
                    <span>Precio Estimado:</span>
                    <span>€{totalAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>
              
              <div className="border-t border-stone-700/50 pt-4 mb-4">
                <p className="text-stone-400 text-sm mb-4">
                  Al comprar, serás redirigido a Shopify para completar tu compra a través de su plataforma segura.
                </p>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={handleCheckout} 
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  <span>Comprar en Shopify</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
                
                <button 
                  onClick={clearCart}
                  className="w-full py-2 px-4 border border-stone-600 text-stone-400 hover:text-stone-200 font-medium rounded-lg transition-colors duration-300"
                >
                  Vaciar Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
