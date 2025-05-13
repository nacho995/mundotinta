'use client';

import { useEffect, useRef } from 'react';
import { BookOpen, Download, X } from 'lucide-react';

export default function BookFormatModal({ book, isOpen, onClose, onSelectFormat }) {
  const modalRef = useRef(null);

  // Cerrar modal con la tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      // Ya no bloqueamos el scroll para permitir desplazarse por la página
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Cerrar al hacer clic fuera del modal
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all duration-300">
      <div 
        ref={modalRef}
        className="bg-gradient-to-b from-stone-800 to-stone-900 border border-amber-800/30 rounded-lg shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 animate-fadeIn"
      >
        {/* Cabecera */}
        <div className="relative p-4 border-b border-amber-900/30 bg-gradient-to-r from-stone-900 to-stone-800">
          <h3 className="text-xl font-serif text-amber-200 font-semibold pr-8">
            Selecciona el formato
          </h3>
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 text-amber-400/70 hover:text-amber-400 transition-colors rounded-full p-1"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Contenido */}
        <div className="p-5">
          <div className="flex items-center gap-4 mb-5">
            <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded shadow-md border border-amber-900/20">
              <img
                src={book.coverImage || '/images/covers/default-book-cover.jpg'}
                alt={book.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-amber-100 font-medium line-clamp-1">{book.title}</h4>
              <p className="text-amber-300/70 text-sm">por {book.author}</p>
              <p className="text-amber-200 font-semibold mt-1">${typeof book.price === 'number' ? book.price.toFixed(2) : 'N/A'}</p>
            </div>
          </div>
          
          <p className="text-stone-300 text-sm mb-6">
            Elige el formato en el que deseas añadir este libro a tu carrito de compras:
          </p>
          
          {/* Opciones de formato */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onSelectFormat('physical')}
              className="flex flex-col items-center bg-gradient-to-b from-amber-800/90 to-amber-900 hover:from-amber-700/90 hover:to-amber-800 text-amber-100 rounded-lg p-4 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl border border-amber-700/30"
            >
              <BookOpen size={32} className="mb-2 text-amber-200" />
              <span className="font-medium">Libro Físico</span>
              <span className="text-xs mt-1 text-amber-200/70">Edición impresa</span>
            </button>
            
            <button
              onClick={() => onSelectFormat('ebook')}
              className="flex flex-col items-center bg-gradient-to-b from-stone-700/90 to-stone-800 hover:from-stone-600/90 hover:to-stone-700 text-stone-100 rounded-lg p-4 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl border border-stone-600/30"
            >
              <Download size={32} className="mb-2 text-stone-200" />
              <span className="font-medium">Ebook</span>
              <span className="text-xs mt-1 text-stone-300/70">Formato digital</span>
            </button>
          </div>
        </div>
        
        {/* Pie de modal */}
        <div className="p-4 border-t border-amber-900/30 bg-stone-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-amber-200 hover:text-amber-100 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
