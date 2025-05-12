'use client';

import { useEffect, useState } from 'react';

export default function FloatingIcons() {
  const [iconStyles, setIconStyles] = useState([]);
  const [init, setInit] = useState(false);
  
  // Fondo base: gradiente sutil en tonos piedra oscuros y vino tinto, con textura de papel.
  const backgroundStyle = {
    position: "fixed",
    inset: 0,
    zIndex: -5, // Ajustado para permitir que los iconos sean más visibles
    overflow: "hidden",
  };

  // Contenedor de iconos con técnica para detectar sección de footer y aplicar efectos especiales
  const iconContainerStyle = {
    position: "fixed",
    inset: 0,
    zIndex: 2, // Ajustado para estar por debajo del footer (que tiene zIndex mayor)
    pointerEvents: "none",
    overflow: "hidden"
  };

  const textureStyle = {
    position: "fixed",
    inset: 0,
    zIndex: -9,
    opacity: 0.08, // Sutil
    mixBlendMode: "overlay",
    pointerEvents: "none"
  };
  
  // Iconos estáticos: colores cálidos, blancos, y algunos toques de verde/marrón para variedad.
  // Opacidad y tamaño ajustados para garantizar máxima visibilidad en todas las secciones
  // Redistribución estratégica de iconos alrededor del contenido, especialmente el footer
  const fixedIcons = [
    // Iconos para la sección Hero (parte superior) - Mejor distribuidos
    { src: "/icons/dragon.svg", top: "10%", left: "5%", size: 200, color: "#D4AF37", opacity: 0.95, shadow: "rgba(212,175,55,0.8)" }, // Dorado - Movido más arriba y a la izquierda
    
    // Iconos para la sección de libros (parte media) - MÁS SEPARADOS
    { src: "/icons/feather.svg", top: "50%", left: "4%", size: 180, color: "#D4AF37", opacity: 0.95, shadow: "rgba(212,175,55,0.8)" }, // Dorado - Centrado verticalmente
    
    // Nave espacial REPOSICIONADA MUCHO más arriba para mayor separación vertical
    { src: "/icons/spaceship.svg", top: "28%", right: "6%", size: 210, color: "#A0522D", opacity: 0.95, shadow: "rgba(184,115,51,0.8)" }, // Movida significativamente más arriba para dar más espacio
    
    // Book MUCHO más arriba para dar más espacio vertical
    { src: "/icons/book.svg", top: "4%", right: "3%", size: 230, color: "#A0522D", opacity: 0.95, shadow: "rgba(184,115,51,0.8)" }, // En la esquina superior derecharada
    
    // Iconos para las esquinas del footer - COMPLETAMENTE REPOSICIONADOS para evitar superposición
    { src: "/icons/compass.svg", bottom: "12%", left: "12%", size: 170, color: "#D4AF37", opacity: 0.80, shadow: "rgba(212,175,55,0.8)" }, // Movido más arriba y a la derecha
    // Crystal ball REPOSICIONADO para no interferir con el menú "Acerca de"
    { src: "/icons/crystalball.svg", bottom: "42%", right: "25%", size: 190, color: "#B87333", opacity: 0.60, shadow: "rgba(184,115,51,0.6)" }, // Opacidad reducida y movido más a la derecha y arriba para evitar colisión con el menú
  ];
  
  useEffect(() => {
    const newStyles = fixedIcons.map(() => ({
      transform: `rotate(${Math.random() * 6 - 3}deg)`,
      animation: `float ${Math.random() * 5 + 25}s ease-in-out infinite`,
    }));
    setIconStyles(newStyles);
    setInit(true);
  }, []); // Se ejecuta solo al montar
  
  if (!init) {
    return null;
  }
  
  return (
    <>
      {/* Iconos estáticos como elementos decorativos - visibles en toda la página */}
      <div style={iconContainerStyle}>
        {fixedIcons.map((icon, index) => (
          <div 
            key={index}
            style={{
              position: "fixed",
              top: icon.top,
              left: icon.left,
              right: icon.right,
              bottom: icon.bottom,
              width: `${icon.size}px`,
              height: `${icon.size}px`,
              opacity: icon.opacity,
              filter: `drop-shadow(0px 0px 40px ${icon.shadow})`,
              transform: iconStyles[index]?.transform, // Aplicar estilo desde el estado
              animation: iconStyles[index]?.animation, // Aplicar estilo desde el estado
              mixBlendMode: 'soft-light',  // Modo de mezcla suave para no interferir con textos
              zIndex: 6
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
    </>
  );
}
