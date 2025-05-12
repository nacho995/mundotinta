"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();
  const { getTotalItems } = useCart();
  
  // Verificar si el usuario está logueado al cargar la página y cada vez que el componente reciba foco
  useEffect(() => {
    // Función para verificar el estado de login
    const checkLoginStatus = () => {
      const token = localStorage.getItem('authToken');
      setIsLoggedIn(!!token);
      
      // Obtener el nombre del usuario desde localStorage
      const storedUserName = localStorage.getItem('userName');
      if (storedUserName) {
        setUserName(storedUserName);
      } else if (!token) {
        // Si no hay token, asegurarse de limpiar el nombre de usuario
        setUserName('');
      }
    };
    
    // Actualizar contador del carrito
    const updateCartCount = () => {
      setCartCount(getTotalItems());
    };
    
    // Verificar inmediatamente
    checkLoginStatus();
    
    // Verificar en cada cambio de ruta (cuando el usuario navega)
    const handleRouteChange = () => {
      checkLoginStatus();
    };
    
    // Verificar cuando la ventana obtiene el foco
    const handleFocus = () => {
      checkLoginStatus();
    };
    
    // Suscribir a eventos globales personalizados para login/logout
    const handleAuthEvent = () => {
      checkLoginStatus();
    };
    
    // Suscribir a eventos para actualizar el carrito
    const handleCartUpdate = () => {
      updateCartCount();
    };
    
    // Registrar event listeners
    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', checkLoginStatus); // Para cambios entre pestañas
    window.addEventListener('auth-state-changed', handleAuthEvent);
    window.addEventListener('cart-updated', handleCartUpdate);
    
    // Actualizar contador del carrito al cargar
    updateCartCount();
    
    // Limpiar listeners al desmontar
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('auth-state-changed', handleAuthEvent);
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, []);
  
  // Cambiar el estilo del encabezado al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Enlaces de navegación
  const navLinks = [
    { name: 'Biblioteca', href: '/biblioteca', color: 'amber' },
    { name: 'Géneros', href: '/generos', color: 'green' },
    { name: 'Novedades', href: '/novedades', color: 'red-600' },
    { name: 'Nosotros', href: '/nosotros', color: 'stone-200' },
    { name: 'Contacto', href: '/contacto', color: 'amber-300' }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}>
      {/* Fondo con textura de cuero y efecto de profundidad */}
      <div className={`absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-900 to-black backdrop-blur-md ${scrolled ? 'shadow-xl' : 'shadow-lg'} border-b border-amber-800/30 transition-all duration-500`}></div>
      
      {/* Textura sutil */}
      <div className="absolute inset-0 opacity-10" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.4' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E")`,
             mixBlendMode: 'overlay'
           }}></div>
      
      {/* Gradiente dorado en la parte inferior */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-600/50 to-transparent"></div>
      
      {/* Destellos sutiles para dar vida */}
      <div className="absolute top-0 left-1/4 w-40 h-full bg-gradient-to-b from-amber-700/5 via-amber-500/0 to-amber-700/5 opacity-70 transform -skew-x-12"></div>
      <div className="absolute top-0 right-1/3 w-24 h-full bg-gradient-to-b from-green-900/5 via-green-700/0 to-green-900/5 opacity-70 transform skew-x-12"></div>
      
      <nav className="container relative mx-auto px-4 flex flex-wrap justify-between items-center">
        {/* Logo con diseño de sello de biblioteca antigua */}
        <Link 
          href="/" 
          className="group relative flex items-center hover:scale-105 transition-all duration-300">
          <div className="absolute -left-1 w-10 h-10 rounded-full bg-gradient-to-br from-amber-900 to-amber-950 border border-amber-700/30 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-md">
            <span className="text-amber-400 font-serif text-xs">MT</span>
          </div>
          <div className="ml-10 font-serif text-2xl tracking-wider">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-400">Mundo</span>
            <span className="ml-1 text-white font-light">Tinta</span>
          </div>
          <div className="absolute -bottom-1 left-10 right-0 h-px bg-gradient-to-r from-amber-500/60 to-transparent transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        </Link>
        
        {/* Botón de menú móvil */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden rounded-md p-2 text-amber-300 hover:bg-stone-800 focus:outline-none transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
        
        {/* Navegación principal - estilo pergamino antiguo */}
        <div className={`w-full lg:w-auto ${menuOpen ? 'block' : 'hidden'} lg:block mt-4 lg:mt-0 transition-all duration-300`}>
          <ul className="flex flex-col lg:flex-row items-center space-y-3 lg:space-y-0 lg:space-x-1 xl:space-x-2">
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link 
                  href={link.href} 
                  className="relative group px-4 py-2 inline-block font-serif"
                  onClick={() => setMenuOpen(false)}
                >
                  {/* Fondo hover que simula esquinas de página */}
                  <div className="absolute inset-0 border-y border-amber-700/0 group-hover:border-amber-700/30 bg-gradient-to-r from-stone-900/0 via-stone-800/0 to-stone-900/0 group-hover:via-stone-800/80 transition-all duration-300"></div>
                  
                  {/* Texto con color personalizado */}
                  <span className={`relative text-stone-300 group-hover:text-${link.color} transition-colors duration-300`}>{link.name}</span>
                  
                  {/* Símbolo decorativo que aparece en hover */}
                  <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 -right-0 top-1/2 -translate-y-1/2 text-amber-600/60 text-xs">•</span>
                </Link>
              </li>
            ))}
            
            {/* Carrito de compra */}
            <li className="mr-4">
              <Link 
                href="/cart" 
                className="relative group flex items-center text-amber-200 hover:text-amber-100 transition-colors duration-300"
              >
                <span className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </span>
                <span className="ml-2 text-sm hidden sm:inline">Carrito</span>
              </Link>
            </li>
            
            {/* Opciones según el estado de autenticación */}
            <li className="relative group">
              {isLoggedIn ? (
                <div className="relative group">
                  <button 
                    className="relative inline-flex items-center px-4 py-1.5 overflow-hidden rounded border border-amber-700/50 bg-gradient-to-r from-amber-900/80 to-stone-900 text-amber-200 shadow-inner shadow-amber-900/10 hover:text-amber-100 hover:shadow-amber-700/10 transition-all duration-300 group"
                  >
                    <span className="relative z-10 flex items-center text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {userName || 'Mi cuenta'}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-amber-600/0 via-amber-600/20 to-amber-600/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                  </button>
                  
                  {/* Menú desplegable */}
                  <div className="absolute right-0 mt-2 w-48 bg-stone-900 border border-amber-700/30 rounded-md shadow-lg overflow-hidden z-50 opacity-0 group-hover:opacity-100 invisible group-hover:visible transform scale-95 group-hover:scale-100 transition-all duration-200">
                    <Link href="/my-books" className="block px-4 py-2 text-sm text-stone-200 hover:bg-stone-700 hover:text-amber-500">
                      Mis libros
                    </Link>
                    <Link href="/favorites" className="block px-4 py-2 text-sm text-stone-200 hover:bg-stone-700 hover:text-amber-500">
                      Favoritos
                    </Link>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-stone-200 hover:bg-stone-700 hover:text-amber-500">
                      Perfil
                    </Link>
                    <div className="border-t border-stone-600 my-1"></div>
                    <button
                      onClick={() => {
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('userName');
                        setIsLoggedIn(false);
                        setUserName('');
                        setMenuOpen(false);
                        // Disparar evento personalizado para notificar cambio de autenticación
                        window.dispatchEvent(new Event('auth-state-changed'));
                        router.push('/');
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-stone-200 hover:bg-stone-700 hover:text-amber-500"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="relative inline-flex items-center px-4 py-1.5 overflow-hidden rounded border border-amber-700/50 bg-gradient-to-r from-amber-900/80 to-stone-900 text-amber-200 shadow-inner shadow-amber-900/10 hover:text-amber-100 hover:shadow-amber-700/10 transition-all duration-300 group"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="relative z-10 flex items-center text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Ingresar
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-amber-600/0 via-amber-600/20 to-amber-600/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                </Link>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
} 