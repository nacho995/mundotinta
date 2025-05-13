"use client";

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  // Secciones del footer
  const footerSections = [
    {
      title: 'Explorar',
      links: [
        { name: 'Biblioteca', href: '/biblioteca' },
        { name: 'Novedades', href: '/novedades' },
        { name: 'Mi Carrito', href: '/cart' }
      ],
      color: 'amber'
    },
    {
      title: 'Géneros',
      links: [
        { name: 'Géneros Literarios', href: '/generos' },
        { name: 'Mis Favoritos', href: '/favorites' }
      ],
      color: 'green'
    },
    {
      title: 'Acerca de',
      links: [
        { name: 'Nosotros', href: '/nosotros' },
        { name: 'Mis Libros', href: '/my-books' },
        { name: 'Contacto', href: '/contacto' },
        { name: 'Perfil', href: '/profile' }
      ],
      color: 'red'
    }
  ];
  
  // Redes sociales
  const socialLinks = [
    { name: 'Twitter', icon: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z', href: '#' },
    { name: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z', href: '#' },
    { name: 'Facebook', icon: 'M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z', href: '#' },
  ];

  return (
    <footer className="relative py-16 overflow-hidden z-10">
      {/* Fondo simplificado y elegante sin efectos semitransparentes */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0807] to-black z-0"></div>
      
      {/* Línea decorativa superior */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent z-10"></div>
      
      {/* Destellos sutiles */}
      <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-amber-900/5 filter blur-[100px]"></div>
      <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-green-900/5 filter blur-[100px]"></div>
      <div className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full bg-red-900/5 filter blur-[100px]"></div>
      
      {/* Línea decorativa dorada superior */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-600/60 to-transparent"></div>
      
      {/* Contenido */}
      <div className="container relative mx-auto px-4 z-[15]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Sección del logo y descripción */}
          <div className="lg:col-span-2 pr-4">
            <Link href="/" className="group relative inline-block mb-4 hover:opacity-90 transition-opacity duration-300 py-2">
              {/* Resplandor circular blanco difuminado SIGNIFICATIVAMENTE MÁS GRANDE */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full opacity-20 blur-2xl pointer-events-none"
              ></div>
              <Image
                src="/images/logomundotinta.png"
                alt="Mundo Tinta Logo Footer"
                width={220}
                height={55}
                className="relative z-10 h-auto object-contain"
              />
            </Link>
            
            {/* Descripción de la librería */}
            <p className="text-stone-300 mb-8 relative inline-block p-2">
              <span className="absolute inset-0 bg-stone-900/70 backdrop-blur-[1px] -z-10 rounded"></span>
              Un portal a mundos de fantasía y ciencia ficción, donde cada libro es una puerta a la imaginación sin límites.
            </p>
            
            {/* Redes sociales */}
            <div className="flex space-x-4 mb-8 relative p-2">
              <span className="absolute inset-0 bg-stone-900/80 -z-10 rounded shadow-md"></span>
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.href}
                  className="w-8 h-8 rounded-full bg-[#5e4534]/90 hover:bg-[#8B4513] flex items-center justify-center transition-colors duration-300 shadow-md"
                  aria-label={social.name}
                >
                  <svg className="w-4 h-4 text-amber-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
            
            {/* Suscripción al boletín */}
            <div className="mt-4 relative inline-block p-3 w-full">
              <span className="absolute inset-0 bg-stone-900/80 backdrop-blur-[2px] -z-10 rounded border border-[#A0522D]/20 shadow-inner"></span>
              <h4 className="text-[#c19a6b] font-serif mb-3 text-sm uppercase tracking-wider relative inline-block">
                <span className="absolute inset-0 bg-stone-900/80 -z-10 rounded px-2"></span>
                Inscríbete en nuestro boletín
              </h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Tu email" 
                  className="w-full py-2 px-3 bg-[#1c1a17]/80 border border-[#8B4513]/40 rounded-l focus:outline-none focus:ring-1 focus:ring-[#b87333] text-stone-200 shadow-inner"
                />
                <button className="bg-gradient-to-r from-[#8B4513] to-[#5e4534] hover:from-[#A0522D] hover:to-[#8B4513] text-[#e6c9ab] font-medium py-2 px-4 rounded-r transition-colors duration-300 shadow-md">
                  Enviar
                </button>
              </div>
            </div>
          </div>
          
          {/* Secciones de navegación */}
          {footerSections.map((section, index) => (
            <div key={index} className="">
              <h3 className={`text-${section.color}-400 font-serif font-medium mb-5 text-lg relative inline-block`}>
                {/* Eliminado el fondo semitransparente y reemplazado por un subrayado elegante */}
                {section.title}
                <span className="absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-${section.color}-400/70 to-transparent"></span>
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                      <Link 
                      href={link.href}
                      className="relative text-[#e6c9ab] hover:text-[#f5e6cf] transition-all duration-300 flex items-center group py-1 px-2 rounded"
                    >
                      {/* Fondo sutil para legibilidad pero elegante */}
                      <span className="absolute inset-0 bg-black/70 backdrop-blur-sm -z-10 opacity-0 group-hover:opacity-80 transition-opacity duration-300 rounded"></span>
                      
                      <span className={`text-[#b87333] mr-1.5 text-xs transition-all duration-300 group-hover:text-[#d4af37]`}>•</span>
                      <span className="relative inline-block">
                        {link.name}
                        <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-[#d4af37]/40 group-hover:w-full transition-all duration-300"></span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Separador decorativo elegante */}
        <div className="my-10 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="px-4 text-[#d4af37] py-1 relative">
              <span>✧✧✧</span>
            </div>
          </div>
        </div>
        
        {/* Pie de página y copyright - Diseño limpio sin fondos semitransparentes */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm pt-2">
          <p className="text-stone-300 mb-4 md:mb-0 relative inline-block px-3 py-1">
            &copy; {currentYear} <span className="text-[#d4af37]">Mundo Tinta</span>. Todos los derechos reservados.
          </p>
          
          <div className="flex flex-wrap justify-center md:justify-end space-x-4 md:space-x-6 relative px-4 py-1">
            <Link href="/politica-privacidad" className="text-stone-300 hover:text-[#d4af37] transition-all duration-300 relative group whitespace-nowrap">
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#d4af37]/40 group-hover:w-full transition-all duration-300"></span>
              Política de Privacidad
            </Link>
            <Link href="/terminos-condiciones" className="text-stone-300 hover:text-[#d4af37] transition-all duration-300 relative group whitespace-nowrap">
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#d4af37]/40 group-hover:w-full transition-all duration-300"></span>
              Términos y Condiciones
            </Link>
            <Link href="/aviso-legal" className="text-stone-300 hover:text-[#d4af37] transition-all duration-300 relative group whitespace-nowrap">
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#d4af37]/40 group-hover:w-full transition-all duration-300"></span>
              Aviso Legal
            </Link>
            {/* Puedes mantener este o quitarlo si las páginas legales son suficientes */}
            {/* <Link href="/books" className="text-stone-300 hover:text-[#d4af37] transition-all duration-300 relative group whitespace-nowrap">
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#d4af37]/40 group-hover:w-full transition-all duration-300"></span>
              Catálogo Completo
            </Link> */}
          </div>
        </div>
        
        {/* Firma discreta de diseño - Sin fondo semitransparente */}
        <div className="mt-8 text-center">
          <p className="text-xs text-stone-400 relative inline-block px-3 py-1">
            Diseñado con <span className="text-red-500">❤️</span> para los amantes de la literatura fantástica.
          </p>
        </div>
      </div>
      
      {/* Decoración inferior elegante */}
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent"></div>
    </footer>
  );
} 