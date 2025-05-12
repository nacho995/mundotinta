import { useState, useEffect, useRef } from 'react';

export default function IntroVideo({ onVideoEnd }) {
  const [showVideo, setShowVideo] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef(null);

  // Verifica si el usuario ya ha visto el video al cargar el componente
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('hasSeenIntro');
    
    // Si ya vio el video, pasar directamente al contenido principal
    if (hasSeenIntro) {
      setShowVideo(false);
      onVideoEnd();
    } else {
      // Asegurarse de que el video comience a reproducirse inmediatamente
      try {
        if (videoRef.current) {
          const playPromise = videoRef.current.play();
          
          // Manejar la Promise que devuelve play()
          if (playPromise !== undefined) {
            playPromise
              .then(() => console.log('Video reproducción iniciada'))
              .catch(error => console.error('Error al reproducir video:', error));
          }
        }
      } catch (error) {
        console.error('Error al intentar reproducir el video:', error);
      }
    }

    // Limpieza al desmontar
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, [onVideoEnd]);

  // Función para manejar cuando el video termina
  const handleVideoEnd = () => {
    console.log('Video finalizado');
    
    // Guardar en localStorage que el usuario ya vio el video
    localStorage.setItem('hasSeenIntro', 'true');
    
    // Iniciar transición de salida
    setIsTransitioning(true);
    
    // Esperar a que termine la transición antes de quitar el video
    setTimeout(() => {
      setShowVideo(false);
      onVideoEnd();
    }, 1000);
  };

  // No renderizar nada si no se debe mostrar el video
  if (!showVideo) {
    return null;
  }

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black flex justify-center items-center transition-opacity duration-1000 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src="/videos/inicio.mp4"
        autoPlay
        playsInline
        controls={false}
        loop={false}
        muted={false}
        onEnded={handleVideoEnd}
        disablePictureInPicture
      />
    </div>
  );
}
