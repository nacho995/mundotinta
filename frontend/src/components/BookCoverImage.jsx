'use client';

import { useState } from 'react';

export default function BookCoverImage({ src, alt, className }) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className={`${className} flex items-center justify-center bg-stone-700`}>
        <span className="text-stone-400 text-sm p-2 text-center">Portada no disponible</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className}
      onError={() => setHasError(true)} 
    />
  );
} 