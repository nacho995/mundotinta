'use client';

import { useState, useEffect, useRef } from 'react';

export default function IntroVideoWrapper() {
  const [mounted, setMounted] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  
  // Este efecto solo se ejecuta una vez después de la hidratación
  useEffect(() => {
    setMounted(true);
    
    // Al inicio, ocultar completamente todo incluyendo el header y cualquier otro elemento
    if (typeof document !== 'undefined') {
      // Agregar un estilo para ocultar el contenido del body pero mantener visible nuestro componente de video
      const style = document.createElement('style');
      style.id = 'intro-video-style';
      style.textContent = `
        body > *:not(:has(#intro-video-container)) {
          opacity: 0 !important;
          visibility: hidden !important;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Comprobar si es la primera visita al sitio
    const hasVisitedBefore = localStorage.getItem('mundoTintaVisitado') || 
                            localStorage.getItem('hasSeenIntro');
    
    console.log('¿Ha visitado antes?', !!hasVisitedBefore);
    
    if (!hasVisitedBefore) {
      console.log('Primera visita detectada - mostrando video de introducción');
      
      // Marcar inmediatamente que ha visitado (asegura que no vea el video dos veces)
      localStorage.setItem('mundoTintaVisitado', 'true');
      localStorage.setItem('hasSeenIntro', 'true');
      
      // Activar el video
      setShowVideo(true);
      
      // Intentar reproducir el video un poco después para asegurar que DOM esté listo
      setTimeout(() => {
        tryPlayVideo();
      }, 800);
    } else {
      console.log('Visita recurrente detectada - omitiendo video de introducción');
      // Ya ha visitado antes, mostrar contenido directamente
      showMainContent();
    }
    
    // Limpieza al desmontar el componente
    return () => {
      showMainContent();
    };
  }, []);
  
  // Función para mostrar el contenido principal
  const showMainContent = () => {
    // Eliminar el estilo que ocultaba todo
    if (typeof document !== 'undefined') {
      const style = document.getElementById('intro-video-style');
      if (style) {
        style.remove();
      }
    }
  };
  
  // Función para intentar reproducir el video
  const tryPlayVideo = () => {
    if (videoRef.current) {
      console.log('Intentando reproducir video...');
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Video reproducción iniciada con éxito');
            setIsVideoLoaded(true);
          })
          .catch(error => {
            console.error('Error reproduciendo video:', error);
            skipIntro();
          });
      }
    } else {
      console.error('Referencia al video no disponible');
      skipIntro();
    }
  };
  
  // Función para saltar la intro
  const skipIntro = () => {
    console.log('Saltando introducción...');
    // Ocultar el video con transición
    const videoContainer = document.getElementById('intro-video-container');
    if (videoContainer) {
      videoContainer.style.opacity = '0';
    }
    
    // Mostrar el contenido principal
    showMainContent();
    
    // Esperar a que termine la transición antes de quitar el componente de video
    setTimeout(() => {
      setShowVideo(false);
    }, 1000);
  };
  
  // Maneja el fin del video
  const handleVideoEnded = () => {
    console.log('Video finalizado, mostrando contenido principal');
    skipIntro();
  };
  
  // Si no se ha montado el componente o no se debe mostrar el video, no renderizar nada
  if (!mounted || !showVideo) {
    return null;
  }
  
  return (
    <div 
      id="intro-video-container"
      className="fixed inset-0 z-50 bg-black flex justify-center items-center transition-opacity duration-1000"
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src="/videos/inicio.mp4"
        autoPlay
        playsInline
        muted={true} // Obligatorio para autoplay en todos los navegadores
        controls={false}
        onCanPlay={() => setIsVideoLoaded(true)}
        onPlay={() => console.log('Video comenzó a reproducirse')}
        onEnded={handleVideoEnded}
        onError={(e) => {
          console.error('Error al reproducir el video:', e);
          skipIntro();
        }}
      />
      
      {/* Botón para saltar intro */}
      {isVideoLoaded && (
        <button 
          onClick={skipIntro}
          className="absolute bottom-8 right-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-full 
                   transition-all duration-300 text-sm font-medium z-10"
        >
          Saltar intro
        </button>
      )}
      
      {/* Mensaje de carga en caso de que el video tarde en cargar */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
          <div className="text-white text-center">
            <div className="mb-4 animate-spin h-12 w-12 border-4 border-t-amber-500 border-amber-200/30 rounded-full mx-auto"></div>
            <p>Cargando experiencia inmersiva...</p>
          </div>
        </div>
      )}
    </div>
  );
}
