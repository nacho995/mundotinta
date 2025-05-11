"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

// Componente de partículas mágicas
const MagicParticles = () => {
  const [particles, setParticles] = useState([]);
  const particlesCount = 30;

  // Generamos las partículas solo en el cliente para evitar errores de hidratación
  useEffect(() => {
    const generatedParticles = Array.from({ length: particlesCount }).map((_, index) => {
      const size = Math.random() * 0.4 + 0.2; // Tamaño entre 0.2 y 0.6
      const left = `${Math.random() * 100}%`;
      const top = `${Math.random() * 100}%`;
      const animationDelay = `${Math.random() * 5}s`;
      const animationDuration = `${Math.random() * 10 + 15}s`;
      const opacity = Math.random() * 0.6 + 0.1;
      
      // Colores más elegantes tipo cuero
      const colors = [
        'rgba(167, 87, 34, VAR)',  // Marrón cuero claro
        'rgba(89, 55, 24, VAR)',   // Marrón cuero medio
        'rgba(101, 67, 33, VAR)'   // Marrón cuero oscuro
      ];
      const color = colors[Math.floor(Math.random() * colors.length)].replace('VAR', opacity.toString());
      
      return {
        id: index,
        size,
        left,
        top,
        color,
        animationDelay,
        animationDuration
      };
    });

    setParticles(generatedParticles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div 
          key={particle.id}
          className="absolute rounded-full animate-float-slow"
          style={{
            width: `${particle.size}rem`,
            height: `${particle.size}rem`,
            left: particle.left,
            top: particle.top,
            background: particle.color,
            boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
            filter: 'blur(1px)',
            opacity: 0,
            animation: `float ${particle.animationDuration} ease-in-out infinite, fade-in-out ${particle.animationDuration} ease infinite`,
            animationDelay: particle.animationDelay
          }}
        />
      ))}
    </div>
  );
};

// Componente ornamental para el estilo de la biblioteca
const OrnamentElement = ({ position, rotate = 0, size = 'md', color = 'amber' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };
  
  const colorClasses = {
    amber: 'text-amber-800',
    green: 'text-emerald-800',
    red: 'text-[#8B4513]' // Marrón cuero saddle
  };
  
  return (
    <div className={`absolute ${position} ${sizeClasses[size]} ${colorClasses[color]} opacity-40`}>
      <svg 
        viewBox="0 0 24 24" 
        style={{ transform: `rotate(${rotate}deg)` }}
        fill="none" 
        stroke="currentColor"
        strokeWidth="0.5"
      >
        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z" />
        <path d="M12 5.5L13.5 10.5H18.5L14.5 13.5L16 18.5L12 15.5L8 18.5L9.5 13.5L5.5 10.5H10.5L12 5.5Z" />
      </svg>
    </div>
  );
};

export default function AboutSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [textReveal1, setTextReveal1] = useState('');
  const [textReveal2, setTextReveal2] = useState('');
  
  const text1 = "Mundo Tinta nació de la pasión por los reinos olvidados, las galaxias lejanas y las historias que desafían la imaginación. Somos más que una librería; somos un portal a universos donde la fantasía y la ciencia ficción cobran vida.";
  const text2 = "Nuestra misión es seleccionar cuidadosamente las joyas del género, desde clásicos atemporales hasta las últimas novedades, y ponerlas al alcance de lectores ávidos como tú. ¡Explora, descubre y piérdete en nuestras páginas!";
  
  // Efecto para detectar cuando la sección es visible
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
      }
    }, { threshold: 0.3 });
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  // Efecto para revelar el texto gradualmente
  useEffect(() => {
    if (isVisible) {
      let index1 = 0;
      let index2 = 0;
      
      const interval1 = setInterval(() => {
        if (index1 < text1.length) {
          setTextReveal1(text1.substring(0, index1 + 1));
          index1++;
        } else {
          clearInterval(interval1);
          
          // Comenzar a revelar el segundo texto después
          const interval2 = setInterval(() => {
            if (index2 < text2.length) {
              setTextReveal2(text2.substring(0, index2 + 1));
              index2++;
            } else {
              clearInterval(interval2);
            }
          }, 15);
        }
      }, 15);
      
      return () => {
        clearInterval(interval1);
      };
    }
  }, [isVisible]);
  
  return (
    <section 
      id="nosotros" 
      ref={sectionRef}
      className="w-full py-24 md:py-32 relative overflow-hidden"
    >
      {/* Fondo principal con gradiente elegante */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-950 via-[#3b2a1f] to-[#5e4534]/90 z-0"></div>
      
      {/* Capas de fondo para profundidad */}
      <div className="absolute inset-0 bg-[url('/images/leather-texture.jpg')] bg-cover opacity-10 mix-blend-overlay z-0"></div>
      
      {/* Patrón decorativo de estantería de libros */}
      <div className="absolute inset-0 z-0 opacity-5" 
           style={{
             backgroundImage: `linear-gradient(0deg, rgba(139, 69, 19, 0.1) 1px, transparent 1px), 
                              linear-gradient(90deg, rgba(139, 69, 19, 0.1) 1px, transparent 1px)`,
             backgroundSize: '20px 20px',
             backgroundPosition: 'center center'
           }}></div>
      
      {/* Efectos de luz */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#8B4513]/10 filter blur-[100px] animate-pulse-slow z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#5e4534]/10 filter blur-[100px] animate-pulse-slower z-0"></div>
      <div className="absolute top-3/4 right-1/3 w-64 h-64 rounded-full bg-[#6b4423]/5 filter blur-[100px] animate-pulse-slow z-0"></div>
      
      {/* Partículas mágicas flotantes */}
      <MagicParticles />
      
      {/* Línea decorativa superior */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#8B4513]/50 to-transparent z-10"></div>
      
      {/* Línea decorativa inferior */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#8B4513]/50 to-transparent z-10"></div>
      
      {/* Contenido principal */}
      <div className="container relative mx-auto px-4 z-20">
        <div className="max-w-6xl mx-auto">
          {/* Elementos decorativos en las esquinas */}
          <OrnamentElement position="top-0 left-0" rotate={45} color="amber" />
          <OrnamentElement position="top-0 right-0" rotate={135} color="green" />
          <OrnamentElement position="bottom-0 left-0" rotate={-45} color="red" />
          <OrnamentElement position="bottom-0 right-0" rotate={-135} color="amber" />
          
          {/* Encabezado con estilo de manuscrito antiguo */}
          <div className="text-center mb-16 relative">
            <div className="relative inline-block">
              <h2 className="text-5xl md:text-6xl font-serif font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#d3a87d] via-[#e6c9ab] to-[#d3a87d]">
                SOBRE MUNDO TINTA
              </h2>
              <div className="absolute -inset-1 blur-lg bg-[#8B4513]/5 -z-10 rounded-lg"></div>
            </div>
            
            {/* Separador decorativo estilo libro antiguo */}
            <div className="flex justify-center items-center gap-4 my-8">
              <div className="w-16 h-0.5 bg-gradient-to-r from-[#8B4513]/0 via-[#A0522D]/40 to-[#8B4513]/0"></div>
              <div className="text-[#A0522D] text-2xl font-serif">✦</div>
              <div className="w-16 h-0.5 bg-gradient-to-r from-[#8B4513]/0 via-[#A0522D]/40 to-[#8B4513]/0"></div>
            </div>
          </div>
          
          {/* Contenido principal en formato de libro abierto */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Columna de imagen - visible solo en MD o mayor */}
            <div className="relative hidden md:block">
              <div className="relative w-full h-[500px] rounded-lg overflow-hidden transform perspective-1000 group">
                {/* Resplandor interno */}
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/20 via-red-900/10 to-green-900/20 mix-blend-overlay opacity-60 z-10"></div>
                
                {/* Imagen principal con efecto 3D */}
                <div className="absolute inset-0 transition-transform duration-1000 ease-in-out transform group-hover:scale-105">
                  <div className="relative w-full h-full">
                    <Image 
                      src="/images/magical-library.jpg" 
                      alt="Biblioteca mágica de Mundo Tinta" 
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-lg opacity-80"
                    />
                  </div>
                  
                  {/* Capa de ajuste de color para la imagen */}
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-950/60 to-stone-950/70 mix-blend-color rounded-lg"></div>
                </div>
                
                {/* Marco dorado */}
                <div className="absolute inset-0 border-2 border-amber-800/30 rounded-lg z-20"></div>
                
                {/* Esquinas ornamentales */}
                <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-amber-600/60 rounded-tl-lg z-20"></div>
                <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-amber-600/60 rounded-tr-lg z-20"></div>
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-amber-600/60 rounded-bl-lg z-20"></div>
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-amber-600/60 rounded-br-lg z-20"></div>
                
                {/* Placa descriptiva en la parte inferior */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-6 px-6 py-2 bg-stone-900/80 backdrop-blur-sm 
                               border border-amber-800/40 rounded-sm z-30 transform group-hover:scale-105 transition-transform duration-500">
                  <p className="text-amber-100/90 font-serif text-sm text-center">
                    <span className="text-amber-400">«</span> Donde la magia de la literatura cobra vida <span className="text-amber-400">»</span>
                  </p>
                </div>
                
                {/* Sello de antigüedad */}
                <div className="absolute top-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-amber-900/70 to-red-900/70 
                               flex items-center justify-center transform -rotate-12 border border-amber-600/50 z-30 shadow-lg">
                  <div className="text-center">
                    <div className="text-amber-200 text-[10px] font-serif">DESDE</div>
                    <div className="text-amber-100 text-sm font-serif font-bold">1842</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Columna de texto - efecto pergamino antiguo */}
            <div className="relative">
              <div className="relative rounded-lg overflow-hidden backdrop-blur-sm">
                {/* Fondo estilo pergamino */}
                <div className="absolute inset-0 bg-gradient-to-b from-amber-950/50 to-stone-900/50 z-0"></div>
                <div className="absolute inset-0 bg-[url('/images/parchment-texture.jpg')] bg-cover opacity-10 mix-blend-overlay z-0"></div>
                
                {/* Borde interior con estilo de manuscrito */}
                <div className="relative border border-amber-800/30 p-8 md:p-10 rounded-sm z-10 shadow-inner shadow-amber-950/50">
                  {/* Marca de agua central */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none z-0">
                    <div className="text-amber-600 text-[200px] font-serif">"M"</div>
                  </div>
                  
                  {/* Texto con efecto de aparición gradual */}
                  <div className="relative z-10 space-y-8 font-serif">
                    <p className="text-lg text-amber-200/90 leading-relaxed">
                      {textReveal1 || (isVisible ? '' : text1)}
                      <span className="animate-blink text-amber-200/90">|</span>
                    </p>
                    
                    <p className="text-lg text-amber-200/90 leading-relaxed">
                      {textReveal2 || (isVisible ? '' : text2)}
                      {textReveal1.length === text1.length && 
                       <span className={`animate-blink text-amber-200/90 ${textReveal2.length === text2.length ? 'opacity-0' : 'opacity-100'}`}>|</span>}
                    </p>
                    
                    {/* Cita inspiracional */}
                    <blockquote className="relative pl-6 border-l-2 border-green-800/40 my-8 italic text-green-200/80">
                      <p>"Los buenos libros no solo trasladan a quien los lee a otros mundos, sino que transforman el mundo de quien los lee."</p>
                      <footer className="mt-2 text-right text-sm text-amber-400/80 not-italic">— Los bibliotecarios</footer>
                    </blockquote>
                  </div>
                  
                  {/* Ornamentos de las esquinas */}
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-amber-700/30 rounded-tr-sm"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-amber-700/30 rounded-bl-sm"></div>
                </div>
              </div>
              
              {/* Firma y sello */}
              <div className="flex justify-end mt-6 mr-4">
                <div className="flex items-center">
                  <div className="mr-3">
                    <p className="font-serif italic text-amber-500/70 text-right text-sm">Mundo Tinta</p>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-amber-700/40 flex items-center justify-center bg-stone-900/80">
                    <div className="font-serif text-[10px] text-amber-600 transform -rotate-12">M-T</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
