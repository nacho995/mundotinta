'use client'; // Necesario para useEffect y useCallback

import { useEffect, useMemo, useState, useCallback } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const AnimatedParticlesBackground = () => {
  const [init, setInit] = useState(false);
  const [iconStyles, setIconStyles] = useState([]);

  // Inicializar el motor de tsParticles
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    console.log("Partículas cargadas", container); 
  }, []);

  // Fondo base: gradiente sutil en tonos piedra oscuros y vino tinto, con textura de papel.
  const backgroundStyle = {
    position: "fixed",
    inset: 0,
    zIndex: -5, // Ajustado para permitir que los iconos sean más visibles
    background: "linear-gradient(135deg, #1c1a17 0%, #5e4534 50%, #3b291e 100%)", // Tonos piedra y vino oscuro
    overflow: "hidden",
  };

  // Contenedor de iconos con técnica para detectar sección de footer y aplicar efectos especiales
  const iconContainerStyle = {
    position: "fixed",
    inset: 0,
    zIndex: 5, // Ajustado para estar por debajo del texto del footer
    pointerEvents: "none",
    overflow: "hidden"
  };

  const textureStyle = {
    position: "fixed",
    inset: 0,
    zIndex: -9,
    backgroundImage: "url('/images/leather-texture.jpg')",
    backgroundSize: "cover",
    opacity: 0.08, // Sutil
    mixBlendMode: "overlay",
    pointerEvents: "none"
  };

  // Líneas decorativas doradas, sutiles y fijas
  const particlesContainerStyle = {
    position: "fixed",
    inset: 0,
    zIndex: -2, // Encima de texturas pero detrás de los iconos
    pointerEvents: "none"
  };

  // Efectos de resplandor generalizados y sutiles, con toques blancos y ámbar
  const globalGlowEffect = {
    position: "fixed",
    inset: 0,
    zIndex: -2,
    backgroundImage: `
      radial-gradient(ellipse at 20% 30%, rgba(255, 255, 255, 0.03) 0%, transparent 40%),
      radial-gradient(ellipse at 80% 70%, rgba(212, 175, 55, 0.04) 0%, transparent 50%)
    `,
    pointerEvents: "none"
  };
  
  // Iconos estáticos: colores cálidos, blancos, y algunos toques de verde/marrón para variedad.
  // Opacidad y tamaño ajustados para garantizar máxima visibilidad en todas las secciones
  // Redistribución estratégica de iconos alrededor del contenido, especialmente el footer
  const fixedIcons = [
    // Iconos para la sección Hero (parte superior)
    { src: "/icons/dragon.svg", top: "15%", left: "15%", size: 200, color: "#D4AF37", opacity: 0.95, shadow: "rgba(212,175,55,0.8)" }, // Dorado
    { src: "/icons/book.svg", top: "30%", right: "20%", size: 230, color: "#A0522D", opacity: 0.95, shadow: "rgba(184,115,51,0.8)" }, // Cobre/cuero - Reposicionado más a la derecha
    
    // Iconos para la sección de libros (parte media) - SEPARADOS MÁS
    { src: "/icons/feather.svg", top: "45%", left: "5%", size: 180, color: "#D4AF37", opacity: 0.95, shadow: "rgba(212,175,55,0.8)" }, // Dorado - Movido más a la izquierda
    { src: "/icons/spaceship.svg", top: "65%", right: "5%", size: 210, color: "#A0522D", opacity: 0.95, shadow: "rgba(184,115,51,0.8)" }, // Nave espacial movida más abajo y a la derecha
    
    // Iconos para la esquinas del footer - estratégicamente posicionados para evitar textos
    { src: "/icons/compass.svg", bottom: "5%", left: "8%", size: 170, color: "#D4AF37", opacity: 0.80, shadow: "rgba(212,175,55,0.8)" }, // Dorado en esquina inferior izquierda
    { src: "/icons/crystalball.svg", bottom: "10%", right: "8%", size: 190, color: "#B87333", opacity: 0.80, shadow: "rgba(184,115,51,0.8)" }, // Cobre en esquina inferior derecha
  ];
  
  useEffect(() => {
    if (init) {
      const newStyles = fixedIcons.map(() => ({
        transform: `rotate(${Math.random() * 6 - 3}deg)`,
        animation: `float ${Math.random() * 5 + 25}s ease-in-out infinite`,
      }));
      setIconStyles(newStyles);
    }
  }, [init]); // Se ejecuta cuando init cambia
  
  if (init) {
    return (
      <>
        <div style={backgroundStyle}></div>
        <div style={textureStyle}></div>
        <div style={globalGlowEffect}></div>

        {/* Líneas decorativas doradas fijas */}
        <div style={particlesContainerStyle}>
          <div style={{
            position: "fixed",
            top: "1rem", // Más separadas del borde
            left: "1rem",
            right: "1rem",
            height: "1px",
            background: "linear-gradient(to right, transparent, rgba(212, 175, 55, 0.2), transparent)", // Más sutiles
            opacity: 0.7
          }}></div>
          <div style={{
            position: "fixed",
            bottom: "1rem", // Más separadas del borde
            left: "1rem",
            right: "1rem",
            height: "1px",
            background: "linear-gradient(to right, transparent, rgba(212, 175, 55, 0.2), transparent)", // Más sutiles
            opacity: 0.7
          }}></div>
        </div>
        
        {/* Iconos estáticos como elementos decorativos - ahora visibles en toda la página */}
        <div style={iconContainerStyle}>
          {fixedIcons.map((icon, index) => (
            <div 
              key={index}
              style={{
                position: "fixed",
                top: icon.top,
                left: icon.left,
                right: icon.right,
                width: `${icon.size}px`,
                height: `${icon.size}px`,
                opacity: icon.opacity,
                filter: `drop-shadow(0px 0px 40px ${icon.shadow})`,
                transform: iconStyles[index]?.transform, // Aplicar estilo desde el estado
                animation: iconStyles[index]?.animation, // Aplicar estilo desde el estado
                mixBlendMode: 'soft-light',  // Modo de mezcla suave para no interferir con textos
              }}
            >
              <img 
                src={icon.src} 
                alt="" 
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "contain",
                  filter: 'drop-shadow(0 0 25px rgba(255, 236, 179, 0.8)) brightness(1.2)',
                  opacity: icon.bottom ? 0.7 : 1, // Reduce la opacidad para los iconos en la parte inferior
                }} 
              />
            </div>
          ))}
        </div>
        {/* Nota: Las partículas de tsparticles se renderizarán si se añaden aquí o en un componente separado */}
      </>
    );
  }

  return <div className="fixed inset-0 z-[-5] bg-stone-950"></div>; // Fallback
};

export default AnimatedParticlesBackground; 