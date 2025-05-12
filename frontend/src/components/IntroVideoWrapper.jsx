'use client';

import { useState, useEffect, useRef } from 'react';

export default function IntroVideoWrapper() {
  // Utilizar estado neutro por defecto para evitar hidratación inconsistente
  const [mounted, setMounted] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);
  
  // Este efecto solo se ejecuta una vez después de la hidratación
  useEffect(() => {
    setMounted(true);
    
    // Comprobar si es la primera visita al sitio
    const hasVisitedBefore = localStorage.getItem('mundoTintaVisitado');
    
    if (!hasVisitedBefore) {
      // Ocultar contenido principal (solo en la primera visita)
      document.querySelector('main')?.classList.add('opacity-0');
      
      // Activar el video
      setShowVideo(true);
    } else {
      // Ya ha visitado antes, mostrar contenido directamente
      document.querySelector('main')?.classList.add('opacity-100');
    }
    
    // Siempre añadir las clases de transición al main
    document.querySelector('main')?.classList.add('transition-opacity', 'duration-1000');
  }, []);
  
  // Maneja el fin del video
  const handleVideoEnded = () => {
    // Marcar que ya ha visitado el sitio
    localStorage.setItem('mundoTintaVisitado', 'true');
    
    // Ocultar el video con transición
    const videoContainer = document.getElementById('video-container');
    if (videoContainer) {
      videoContainer.style.opacity = '0';
    }
    
    // Esperar a que termine la transición antes de mostrar el contenido
    setTimeout(() => {
      setShowVideo(false);
      document.querySelector('main')?.classList.remove('opacity-0');
      document.querySelector('main')?.classList.add('opacity-100');
    }, 1000);
  };
  
  // Si no se ha montado el componente o no es la primera visita, no renderizar nada
  if (!mounted || !showVideo) {
    return null;
  }
  
  return (
    <div 
      id="video-container"
      className="fixed inset-0 z-50 bg-black flex justify-center items-center transition-opacity duration-1000"
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src="/videos/inicio.mp4"
        autoPlay
        playsInline
        muted // Necesario para autoplay en la mayoría de navegadores
        controls={false}
        onPlay={() => console.log('Video comenzó a reproducirse')}
        onEnded={handleVideoEnded}
        onError={() => {
          console.error('Error al reproducir el video');
          localStorage.setItem('mundoTintaVisitado', 'true');
          setShowVideo(false);
          document.querySelector('main')?.classList.remove('opacity-0');
          document.querySelector('main')?.classList.add('opacity-100');
        }}
      />
    </div>
  );
}
