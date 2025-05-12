'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Configuración de las imágenes
const IMAGE_SIZES = {
  small: { width: 150, height: 225 },
  medium: { width: 280, height: 420 },
  large: { width: 400, height: 600 }
};

// Función para determinar si la imagen es válida
const isValidImageUrl = (url) => {
  if (!url) return false;
  if (url.startsWith('/')) return true;
  
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

// Función para normalizar la URL de la imagen
const normalizeImageUrl = (src) => {
  // Si no hay URL, usar la de portada por defecto
  if (!src) return '/images/covers/default-book-cover.jpg';
  
  // Si la URL es relativa y no comienza con /, añadir /
  if (!src.startsWith('/') && !src.startsWith('http')) {
    return `/${src}`;
  }
  
  return src;
};

export default function BookCoverImage({ 
  src, 
  alt = 'Portada del libro', 
  className,
  size = 'medium' // pequeño, mediano o grande
}) {
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState(normalizeImageUrl(src));
  
  // Obtener dimensiones según el tamaño solicitado
  const dimensions = IMAGE_SIZES[size] || IMAGE_SIZES.medium;
  
  // Reiniciar el estado de error si cambia la URL de la imagen
  useEffect(() => {
    setHasError(false);
    setImgSrc(normalizeImageUrl(src));
  }, [src]);
  
  // Bloque div para cuando no hay imagen válida
  const fallbackBlock = (
    <div className={`${className || ''} flex items-center justify-center bg-stone-700`}
         style={{
           width: dimensions.width,
           height: dimensions.height,
           maxWidth: '100%',
         }}>
      <span className="text-stone-400 text-sm p-2 text-center">Portada no disponible</span>
    </div>
  );
  
  // Si la URL no es válida o hay un error al cargar la imagen
  if (hasError || !isValidImageUrl(imgSrc)) {
    return fallbackBlock;
  }
  
  // ¿Es una imagen interna del proyecto? (comienza con /)
  const isLocalImage = imgSrc.startsWith('/');
  
  // Para imágenes internas de la aplicación (/images/...)
  if (isLocalImage) {
    // Usamos imagen con optimización desactivada para evitar errores 400
    return (
      <Image
        src={imgSrc}
        alt={alt || 'Portada del libro'}
        className={className || ''}
        width={dimensions.width}
        height={dimensions.height}
        onError={() => setHasError(true)}
        priority={true}
        unoptimized={true} // Evita problemas de optimización de Next.js
      />
    );
  }
  
  // Para URLs externas usamos el tag estándar de HTML
  return (
    <img 
      src={imgSrc} 
      alt={alt || 'Portada del libro'} 
      className={className || ''}
      onError={() => setHasError(true)} 
      loading="eager"
      style={{
        width: dimensions.width,
        height: dimensions.height,
        maxWidth: '100%',
        objectFit: 'cover'
      }}
    />
  );
}