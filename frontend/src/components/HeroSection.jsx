'use client';

import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';

// Componente para el polvo mágico flotante
const MagicDust = () => (
  <div 
    className="absolute inset-0 pointer-events-none opacity-70"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='2' intercept='-0.2'/%3E%3CfeFuncG type='linear' slope='1.8' intercept='-0.15'/%3E%3CfeFuncB type='linear' slope='1.5' intercept='-0.1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'repeat',
    }}
  />
);

// Componente para el patrón de estanterías de libros
const BookshelfPattern = () => (
  <div 
    className="absolute inset-0 pointer-events-none opacity-10"
    style={{
      backgroundImage: 'linear-gradient(to bottom, rgba(120, 75, 40, 0.2) 1px, transparent 1px), linear-gradient(to right, rgba(120, 75, 40, 0.1) 1px, transparent 30px, rgba(120, 75, 40, 0.1) 31px, transparent 60px)',
      backgroundSize: '60px 20px',
      backgroundPosition: 'center center',
    }}
  />
);

// Componente para el pergamino flotante con texto
const FloatingScroll = ({ text, top, left, rotate }) => (
  <div className={`absolute ${top} ${left} transform ${rotate} opacity-0 group-hover:opacity-100 transition-opacity duration-1000 delay-300 z-30 pointer-events-none`}>
    <div className="bg-gradient-to-b from-amber-50 to-amber-100/90 px-3 py-1 rounded-lg shadow-md border border-amber-200/50 max-w-[120px]">
      <p className="text-amber-950/80 text-[10px] font-serif italic text-center">{text}</p>
    </div>
  </div>
);

export default function HeroSection() {
  // Estado para controlar el efecto de cambio de página
  const [isFlipped, setIsFlipped] = useState(false);
  // Estado para el efecto de typing en el título
  const [titleText1, setTitleText1] = useState("");
  const [titleText2, setTitleText2] = useState("");
  const fullText1 = "TU PORTAL A MUNDOS";
  const fullText2 = "DE FANTASÍA Y FICCIÓN";
  
  // Efecto de escritura mágica
  useEffect(() => {
    let index1 = 0;
    let index2 = 0;
    
    const type1Interval = setInterval(() => {
      if (index1 < fullText1.length) {
        setTitleText1(fullText1.substring(0, index1 + 1));
        index1++;
      } else {
        clearInterval(type1Interval);
        
        // Empezar a escribir el segundo título después de terminar el primero
        const type2Interval = setInterval(() => {
          if (index2 < fullText2.length) {
            setTitleText2(fullText2.substring(0, index2 + 1));
            index2++;
          } else {
            clearInterval(type2Interval);
          }
        }, 100);
      }
    }, 100);
    
    return () => {
      clearInterval(type1Interval);
    };
  }, []);

  return (
    <section 
      id="hero" 
      className="group relative min-h-screen overflow-hidden
                 bg-gradient-to-br from-stone-950 via-[#5e4534]/90 to-stone-900 text-white"
      style={{ backdropFilter: 'none' }}
    >
      {/* Efecto de biblioteca antigua muy sutil - solo en la columna izquierda */}
      <div className="absolute inset-y-0 left-0 right-1/2 opacity-20 mix-blend-overlay pointer-events-none"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)' opacity='0.03'/%3E%3C/svg%3E")`,
             backgroundSize: '500px 500px',
           }}>
      </div>
      
      {/* Bordes decorativos de la página */}
      <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-[#8B4513]/50 to-transparent shadow-[0_5px_15px_rgba(139,69,19,0.3)]"></div>
      <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-[#8B4513]/50 to-transparent shadow-[0_-5px_15px_rgba(139,69,19,0.3)]"></div>
      
      {/* Estanterías sutiles y elementos de biblioteca */}
      <div className="absolute top-10 right-20 w-60 h-[2px] bg-gradient-to-r from-[#A0522D]/20 to-transparent pointer-events-none"></div>
      <div className="absolute top-10 right-20 w-[2px] h-40 bg-gradient-to-b from-[#A0522D]/20 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-10 left-20 w-40 h-[2px] bg-gradient-to-l from-[#A0522D]/20 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-10 left-20 w-[2px] h-40 bg-gradient-to-t from-[#A0522D]/20 to-transparent pointer-events-none"></div>
      
      {/* Elementos mágicos flotantes */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Polvo mágico que aparece en hover */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full bg-[#b87333]/0 group-hover:bg-[#b87333]/80 shadow-[0_0_8px_rgba(184,115,51,0)] group-hover:shadow-[0_0_12px_rgba(184,115,51,0.8)] transition-all duration-1000 delay-100 group-hover:translate-y-[-20px]"></div>
        <div className="absolute top-1/2 left-1/5 w-1 h-1 rounded-full bg-[#A0522D]/0 group-hover:bg-[#A0522D]/70 shadow-[0_0_8px_rgba(160,82,45,0)] group-hover:shadow-[0_0_10px_rgba(160,82,45,0.7)] transition-all duration-1000 delay-300 group-hover:translate-x-[15px]"></div>
        <div className="absolute top-2/3 right-1/3 w-1 h-1 rounded-full bg-[#d2b48c]/0 group-hover:bg-[#d2b48c]/60 shadow-[0_0_8px_rgba(210,180,140,0)] group-hover:shadow-[0_0_8px_rgba(210,180,140,0.6)] transition-all duration-1000 delay-500 group-hover:translate-y-[10px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 rounded-full bg-[#b87333]/0 group-hover:bg-[#b87333]/80 shadow-[0_0_8px_rgba(184,115,51,0)] group-hover:shadow-[0_0_15px_rgba(184,115,51,0.8)] transition-all duration-1000 delay-700 group-hover:translate-x-[-25px]"></div>
      </div>
      
      {/* Luces mágicas alrededor que se activan con hover */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(184,115,51,0)_0%,transparent_50%)] group-hover:bg-[radial-gradient(circle_at_30%_30%,rgba(184,115,51,0.07)_0%,transparent_50%)] transition-all duration-1000 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(139,69,19,0)_0%,transparent_50%)] group-hover:bg-[radial-gradient(circle_at_70%_70%,rgba(139,69,19,0.05)_0%,transparent_50%)] transition-all duration-1000 pointer-events-none"></div>
      
      {/* Pergaminos con textos que aparecen en hover */}
      <FloatingScroll text="Los mundos perdidos te esperan..." top="top-1/5" left="left-1/4" rotate="rotate-3" />
      <FloatingScroll text="Historias que trascienden el tiempo" top="bottom-1/4" left="right-1/4" rotate="-rotate-2" />
      <FloatingScroll text="Al otro lado del umbral..." top="top-2/3" left="right-1/3" rotate="rotate-1" />
      
      {/* Cuadrícula principal con hover effect en todo el componente */}
      <div className="w-full min-h-screen grid lg:grid-cols-2 relative z-10">

        {/* Columna de Texto (izquierda) - ESTILO BIBLIOTECA MÁGICA */}
        <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left p-8 sm:p-12 md:p-16 lg:p-20 relative group/texto">
          
          {/* Elementos decorativos de página antigua */}
          <div className="absolute -top-10 -bottom-10 -left-5 w-[2px] bg-gradient-to-b from-[#8B4513]/0 via-[#8B4513]/40 to-[#8B4513]/0 hidden lg:block"></div>
          <div className="absolute top-0 left-0 w-16 h-[1px] bg-gradient-to-r from-[#8B4513]/40 to-transparent hidden lg:block"></div>
          <div className="absolute bottom-0 left-0 w-16 h-[1px] bg-gradient-to-r from-[#8B4513]/40 to-transparent hidden lg:block"></div>
          
          {/* Sello de biblioteca mágica */}
          <div className="relative mb-8 group/badge">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwIDIwYzUuNTIzIDAgMTAtNC40NzcgMTAtMTBTMTUuNTIzIDAgMTAgMCAwIDQuNDc3IDAgMTBzNC40NzcgMTAgMTAgMTB6IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjE3LDExOSw2LDAuNCkiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] bg-center bg-no-repeat scale-[3.5] opacity-0 group-hover/badge:opacity-20 transition-opacity duration-1000 pointer-events-none"></div>
            <div className="px-5 py-2 border-y border-[#8B4513]/30 bg-gradient-to-r from-[#8B4513]/80 to-stone-900/90 group-hover/badge:border-[#A0522D]/50 transition-all duration-500 overflow-hidden relative">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGZpbHRlciBpZD0ncGFwZXInPjxmZVR1cmJ1bGVuY2UgdHlwZT0nZnJhY3RhbE5vaXNlJyBiYXNlRnJlcXVlbmN5PScwLjk0JyBudW1PY3RhdmVzPSc0JyAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbHRlcj0ndXJsKCNwYXBlciknIG9wYWNpdHk9JzAuMDYnLz48L3N2Zz4=')] opacity-30"></div>
              </div>
              <span className="text-xs font-serif tracking-widest text-[#d2b48c]/90 uppercase relative">Descubre Universos Literarios</span>
              
              {/* Decoración de sello antiguo que aparece en hover */}
              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-[#A0522D]/20 to-transparent scale-0 group-hover/badge:scale-100 transition-transform duration-500 origin-left"></div>
              <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-transparent via-[#A0522D]/20 to-transparent scale-0 group-hover/badge:scale-100 transition-transform duration-500 origin-right"></div>
              <div className="absolute inset-x-1 -bottom-[1px] h-[1px] bg-[#A0522D]/80 scale-x-0 group-hover/badge:scale-x-100 transition-transform duration-700 origin-left"></div>
            </div>
          </div>
          
          {/* Título con estilo de libro antiguo */}
          <div className="relative">
            {/* Decoración de título de libro antiguo */}
            <div className="absolute -top-4 left-0 h-1 w-20 bg-[#8B4513]/20 rounded-full hidden lg:block group-hover/texto:bg-[#8B4513]/40 transition-colors duration-500"></div>
            <div className="absolute -bottom-4 right-0 h-1 w-20 bg-[#8B4513]/20 rounded-full hidden lg:block group-hover/texto:bg-[#8B4513]/40 transition-colors duration-500"></div>
            
            <h1 className="relative text-5xl md:text-6xl font-bold mb-10 leading-tight font-serif">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#d2b48c] via-[#e6c9ab] to-[#d3a87d] py-2 group-hover/texto:from-[#e6c9ab] group-hover/texto:via-[#f0e0ca] group-hover/texto:to-[#d3a87d] transition-all duration-700">
                {titleText1}
                <span className="animate-blink ml-0.5 text-[#d3a87d]">|</span>
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#d3a87d] via-[#e6c9ab]/90 to-[#c19a6b] py-2 group-hover/texto:from-[#e6c9ab] group-hover/texto:via-[#f0e0ca] group-hover/texto:to-[#c19a6b] transition-all duration-700">
                {titleText2}
                {!titleText2.includes(fullText2) && <span className="animate-blink ml-0.5 text-[#d3a87d]">|</span>}
              </span>
              
              {/* Línea decorativa estilo pergamino */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#A0522D]/50 to-transparent mt-2"></div>
              
              {/* Máscara que da aspecto de texto envejecido */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGZpbHRlciBpZD0ncGFwZXInPjxmZVR1cmJ1bGVuY2UgdHlwZT0nZnJhY3RhbE5vaXNlJyBiYXNlRnJlcXVlbmN5PScwLjA1JyBudW1PY3RhdmVzPSczJyAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbHRlcj0ndXJsKCNwYXBlciknIG9wYWNpdHk9JzAuMDUnLz48L3N2Zz4=')] mix-blend-multiply opacity-80 pointer-events-none"></div>
            </h1>
          </div>
          
          {/* Descripción con el estilo de texto antiguo a pluma */}
          <div className="relative mb-12 max-w-xl group/desc">
            {/* Marca de párrafo antiguo al estilo manuscrito */}
            <div className="absolute -left-6 top-0 opacity-0 group-hover/desc:opacity-100 transition-opacity duration-700 hidden lg:block">
              <div className="text-amber-800/40 font-serif text-2xl italic">&#x00B6;</div>
            </div>
            
            <p className="text-lg md:text-xl text-[#e6c9ab]/90 mb-4 font-light pl-0 lg:pl-0 leading-relaxed font-serif italic">
              Explora <span className="text-[#d3a87d] font-normal relative inline-block group/word">
                galaxias lejanas
                <span className="absolute left-0 -bottom-px h-px w-0 group-hover/word:w-full bg-[#b87333]/40 transition-all duration-500"></span>
              </span>, <span className="text-[#d3a87d] font-normal relative inline-block group/word">
                magia antigua
                <span className="absolute left-0 -bottom-px h-px w-0 group-hover/word:w-full bg-[#b87333]/40 transition-all duration-500"></span>
              </span> y <span className="text-[#d3a87d] font-normal relative inline-block group/word">
                aventuras épicas
                <span className="absolute left-0 -bottom-px h-px w-0 group-hover/word:w-full bg-[#b87333]/40 transition-all duration-500"></span>
              </span> que 
              transformarán tu percepción de la realidad.
            </p>
            <p className="text-lg md:text-xl text-[#e6c9ab]/90 font-light pl-0 lg:pl-0 leading-relaxed font-serif italic">
              Encuentra historias que <span className="text-[#d3a87d]/90 font-normal relative inline-block group/word">
                perdurarán en tu memoria
                <span className="absolute left-0 -bottom-px h-px w-0 group-hover/word:w-full bg-[#b87333]/40 transition-all duration-500"></span>
              </span> para siempre.
            </p>
            
            {/* Textura de papel viejo sobre el texto */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGZpbHRlciBpZD0ncGFwZXInPjxmZVR1cmJ1bGVuY2UgdHlwZT0nZnJhY3RhbE5vaXNlJyBiYXNlRnJlcXVlbmN5PScwLjA0JyBudW1PY3RhdmVzPSc1JyAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbHRlcj0ndXJsKCNwYXBlciknIG9wYWNpdHk9JzAuMDMnLz48L3N2Zz4=')] mix-blend-multiply opacity-70 pointer-events-none"></div>
          </div>
          
          {/* Botón con estilo de marcador de libro mágico */}
          <div className="relative group/btn">
            {/* Resplandor mágico del marcador - Más amplio e intenso */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#8B4513]/0 via-[#b87333]/60 to-[#A0522D]/0 rounded opacity-0 group-hover/btn:opacity-100 blur-md transition-all duration-700 animate-pulse-slow"></div>
            
            <a 
              href="#libros"
              className="relative flex items-center justify-center px-8 py-4 
                       bg-gradient-to-b from-[#8B4513] to-stone-900 group-hover/btn:from-[#A0522D] group-hover/btn:to-[#3b291e]
                       text-[#e6c9ab] font-serif tracking-wide
                       rounded border border-[#A0522D]/40 overflow-hidden
                       transition-all duration-500 ease-out transform
                       hover:text-[#f0e0ca] hover:border-[#c19a6b]/90
                       hover:shadow-[0_0_30px_rgba(184,115,51,0.4)]
                       group-hover/btn:shadow-[0_0_35px_rgba(184,115,51,0.45)] group-hover/btn:scale-[1.02]"
            >
              {/* Textura de cuero del marcador */}
              <div className="absolute inset-0 opacity-20 group-hover/btn:opacity-30 transition-opacity duration-700" 
                   style={{
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E")`,
                   }}></div>
              
              {/* Efecto de luz que aparece en hover - Más pronunciado */}
              <div className="absolute -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-0 group-hover/btn:opacity-20 group-hover/btn:animate-shine"></div>
              
              {/* Partículas brillantes en hover */}
              <div className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full bg-[#c19a6b]/0 group-hover/btn:bg-[#c19a6b]/90 blur-[1px] transition-all duration-700 delay-300 group-hover/btn:animate-float-slow"></div>
              <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-[#e6c9ab]/0 group-hover/btn:bg-[#e6c9ab]/80 blur-[1px] transition-all duration-700 delay-150 group-hover/btn:animate-float-slow"></div>
              
              {/* Borde interno que brilla */}
              <div className="absolute inset-0.5 rounded-sm border border-[#A0522D]/0 group-hover/btn:border-[#b87333]/50 transition-all duration-700 opacity-0 group-hover/btn:opacity-100" style={{ boxShadow: "inset 0 0 10px rgba(184,115,51,0.3)" }}></div>
              
              <div className="relative flex items-center space-x-3 z-10">
                {/* Ícono personalizado de floritura con animación */}
                <span className="font-serif text-[#c19a6b]/80 text-xl group-hover/btn:text-[#e6c9ab] transition-colors duration-500 group-hover/btn:animate-pulse-slow">&sect;</span>
                <span className="relative">
                  Explorar Mundos
                  {/* Subrayado animado */}
                  <span className="absolute left-0 -bottom-1 h-px w-0 group-hover/btn:w-full bg-[#e6c9ab]/30 transition-all duration-700 delay-200"></span>
                </span>
                <span className="font-serif text-[#c19a6b]/80 text-xl group-hover/btn:text-[#e6c9ab] transition-colors duration-500 group-hover/btn:animate-pulse-slow">&sect;</span>
              </div>
            </a>
          </div>
        </div>
        
        {/* Columna de Imagen - EFECTO LIBRO MÁGICO CON HOVER ESPECTACULAR */}
        <div className="relative w-full h-full hidden lg:block">
          {/* Resplandores de fondo */}
          <div className="absolute right-1/3 top-1/3 w-60 h-60 rounded-full bg-gradient-radial from-[#b87333]/5 to-transparent blur-3xl pointer-events-none animate-pulse-slow"></div>
          <div className="absolute right-1/4 bottom-1/4 w-80 h-80 rounded-full bg-gradient-radial from-[#8B4513]/5 to-transparent blur-3xl pointer-events-none animate-pulse-slower"></div>
          
          {/* Elementos decorativos de fondo - Orbitas */}
          <div className="absolute right-1/4 top-[15%] w-32 h-32 rounded-full border border-[#A0522D]/30 shadow-[inset_0_0_15px_rgba(139,69,19,0.2),0_0_20px_rgba(139,69,19,0.1)] animate-spin-slow pointer-events-none z-10"></div>
          <div className="absolute right-1/3 bottom-[10%] w-56 h-56 rounded-full border border-[#b87333]/20 shadow-[inset_0_0_20px_rgba(139,69,19,0.1),0_0_15px_rgba(139,69,19,0.05)] animate-reverse-spin-slow pointer-events-none z-10"></div>
          
          {/* Estanterías sutiles a los lados */}
          <div className="absolute left-10 top-20 bottom-20 w-4 bg-gradient-to-b from-[#5e4534]/50 via-[#8B4513]/60 to-[#5e4534]/50 pointer-events-none"></div>
          <div className="absolute left-14 top-20 bottom-20 w-px bg-[#A0522D]/20 pointer-events-none"></div>
          
          {/* Libros en estantería (tenues) */}
          <div className="absolute left-10 top-[15%] w-4 h-16 bg-[#A0522D]/30 pointer-events-none"></div>
          <div className="absolute left-10 top-[25%] w-4 h-10 bg-stone-800/40 pointer-events-none"></div>
          <div className="absolute left-10 top-[35%] w-4 h-14 bg-[#8B4513]/40 pointer-events-none"></div>
          <div className="absolute left-10 top-[48%] w-4 h-12 bg-[#5e4534]/40 pointer-events-none"></div>
          <div className="absolute left-10 top-[60%] w-4 h-20 bg-stone-800/30 pointer-events-none"></div>
          <div className="absolute left-10 top-[80%] w-4 h-14 bg-[#A0522D]/20 pointer-events-none"></div>
          
          {/* LIBRO PRINCIPAL INTERACTIVO CON HOVER ESPECTACULAR */}
          <div className="absolute top-1/2 -translate-y-1/2 left-[15%] w-[80%] aspect-[5/6] group/book">
            {/* Sombra que se ilumina con hover */}
            <div className="absolute -bottom-10 -right-5 -left-5 h-20 opacity-40 blur-xl bg-gradient-to-t from-[#8B4513]/30 via-[#A0522D]/10 to-transparent group-hover/book:from-[#A0522D]/50 group-hover/book:via-[#b87333]/30 transition-all duration-1000"></div>
            
            {/* Libro cerrado con lomo de cuero - SIN MOVIMIENTO LATERAL */}
            <div className="absolute inset-0 origin-left transition-all duration-1000 ease-in-out preserve-3d shadow-[5px_5px_20px_rgba(0,0,0,0.7)]">
              {/* Cubierta exterior de libro de cuero */}
              <div className="absolute inset-0 rounded-r-md rounded-l-sm overflow-hidden preserve-3d">
                {/* Resplandor en hover */}
                <div className="absolute -inset-20 bg-gradient-to-tr from-[#8B4513]/0 via-[#A0522D]/0 to-[#b87333]/0 group-hover/book:from-[#8B4513]/20 group-hover/book:via-[#A0522D]/5 group-hover/book:to-[#b87333]/10 opacity-0 group-hover/book:opacity-100 blur-xl transition-opacity duration-1000"></div>
                
                {/* Textura de cuero más oscura para contraste */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#5e4534] via-stone-900 to-stone-950 transition-all duration-700 overflow-hidden">
                  {/* Patrón de cuero */}
                  <div className="absolute inset-0" 
                       style={{
                         backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.4' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.35'/%3E%3C/svg%3E")`,
                         mixBlendMode: 'overlay'
                       }}></div>
                  
                  {/* Detalles y decoraciones doradas */}
                  <div className="absolute inset-5 rounded-sm border border-[#A0522D]/30 opacity-40 group-hover/book:opacity-70 transition-opacity duration-700 shadow-[inset_0_0_10px_rgba(0,0,0,0.3)]"></div>
                  <div className="absolute inset-x-0 top-10 mx-10 h-px bg-gradient-to-r from-transparent via-[#b87333]/40 to-transparent opacity-40 group-hover/book:opacity-80 transition-opacity duration-700"></div>
                  <div className="absolute inset-x-0 bottom-10 mx-10 h-px bg-gradient-to-r from-transparent via-[#b87333]/40 to-transparent opacity-40 group-hover/book:opacity-80 transition-opacity duration-700"></div>
                  
                  {/* Título dorado en relieve */}
                  <div className="absolute inset-x-0 top-[40%] -translate-y-1/2 text-center">
                    <h3 className="font-serif tracking-wide text-[#c19a6b]/80 opacity-80 group-hover/book:opacity-100 transition-opacity duration-700 text-2xl font-bold"
                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>
                      MUNDOS DE TINTA
                    </h3>
                    <div className="mx-auto w-40 h-px bg-gradient-to-r from-transparent via-[#c19a6b]/50 to-transparent mt-2 opacity-60 group-hover/book:opacity-100 transition-opacity duration-700"></div>
                  </div>
                </div>
              </div>
              
              {/* Lomo del libro */}
              <div className="absolute top-0 bottom-0 left-0 w-6 rounded-l-sm overflow-hidden transform origin-right preserve-3d">
                <div className="absolute inset-0 bg-gradient-to-b from-[#8B4513] via-[#5e4534] to-[#8B4513] shadow-[inset_0_0_10px_rgba(0,0,0,0.7)]">
                  {/* Textura del lomo */}
                  <div className="absolute inset-0" 
                       style={{
                         backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.35' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E")`,
                         mixBlendMode: 'overlay'
                       }}></div>
                  
                  {/* Detalles dorados del lomo */}
                  <div className="absolute inset-x-0 top-[20%] h-px bg-[#c19a6b]/50"></div>
                  <div className="absolute inset-x-0 bottom-[20%] h-px bg-[#c19a6b]/50"></div>
                </div>
              </div>
              
              {/* EFECTO DE CAMBIO DE PÁGINA ALTERNANDO EN HOVER */}
              <div 
                className="absolute top-[12%] left-[10%] right-[10%] bottom-[12%] rounded-md z-30 overflow-hidden"
                onMouseEnter={() => setIsFlipped(!isFlipped)} // Cambia el estado al hacer hover
              >
                {/* Contenedor de ambas imágenes */}
                <div className="relative w-full h-full">
                  {/* Primera imagen */}
                  <div 
                    className={`absolute inset-0 origin-bottom-right transition-transform duration-1000 ease-in-out ${isFlipped ? 'z-0' : 'z-20'}`}
                    style={{
                      transform: isFlipped ? 'perspective(1500px) rotateY(-120deg)' : 'rotateY(0deg)',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <img 
                      src="/images/dibujoInicial.jpg" 
                      alt="Imagen principal"
                      className="absolute w-full h-full object-cover"
                    />
                    
                    {/* Reverso de la página */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-l from-white/70 to-white/90"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                      }}
                    ></div>
                  </div>
                  
                  {/* Segunda imagen */}
                  <div 
                    className={`absolute inset-0 origin-bottom-right transition-transform duration-1000 ease-in-out ${isFlipped ? 'z-20' : 'z-0'}`}
                    style={{
                      transform: !isFlipped ? 'perspective(1500px) rotateY(-120deg)' : 'rotateY(0deg)',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <img 
                      src="/icons/dibujoinicial2.jpg" 
                      alt="Segunda imagen"
                      className="absolute w-full h-full object-cover"
                    />
                    
                    {/* Reverso de la página */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-l from-white/70 to-white/90"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                      }}
                    ></div>
                  </div>
                </div>
                
                {/* Sombra dinámica que aparece durante la transición */}
                <div 
                  className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                  style={{
                    boxShadow: 'inset 50px 0 50px rgba(0,0,0,0.15)',
                    opacity: 0.7
                  }}
                ></div>
              </div>
            </div>
            
            {/* Páginas del libro (vistas del costado) */}
            {/* <div className="absolute inset-y-[3%] right-[3%] left-[5%] bg-gradient-to-r from-amber-100/90 to-amber-200/80 rounded-r-sm transform origin-left transition-all duration-1000 ease-in-out -translate-z-[1px] group-hover/book:rotate-y-[-5deg] group-hover/book:translate-z-1 preserve-3d shadow-md"> */}
              {/* Textura de páginas */}
              {/* <div className="absolute inset-0" 
                   style={{
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)' opacity='0.3'/%3E%3C/svg%3E")`,
                   }}></div> */}
              
              {/* Sombreado de los bordes de las páginas */}
              <div className="absolute top-0 right-0 h-full w-2 bg-gradient-to-l from-amber-300/80 to-transparent"></div>
              <div className="absolute top-0 right-[3px] h-full w-[1px] bg-amber-100"></div>
            {/* </div> */}
          </div>
          
          {/* Elementos mágicos flotantes que aparecen en hover */}
          <div className="absolute inset-0 pointer-events-none z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 delay-300">
            {/* Motas de polvo mágico */}
            <div className="absolute top-1/4 left-1/3 w-1 h-1 rounded-full bg-[#b87333]/90 shadow-[0_0_8px_rgba(184,115,51,0.8)] animate-float-slow"></div>
            <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 rounded-full bg-[#c19a6b]/80 shadow-[0_0_6px_rgba(193,154,107,0.7)] animate-float-slow animation-delay-150"></div>
            <div className="absolute bottom-1/3 left-1/2 w-1 h-1 rounded-full bg-[#b87333]/90 shadow-[0_0_10px_rgba(184,115,51,0.8)] animate-float-slow animation-delay-300"></div>
            <div className="absolute top-1/2 right-1/4 w-0.5 h-0.5 rounded-full bg-[#c19a6b]/90 shadow-[0_0_8px_rgba(193,154,107,0.8)] animate-float-slow animation-delay-700"></div>
          </div>
          
          {/* Sello de biblioteca antigua */}
          <div className="absolute bottom-5 right-10 z-30 opacity-60 group-hover:opacity-100 transition-opacity duration-700">
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full border border-[#A0522D]/60 flex items-center justify-center">
                <div className="font-serif text-[10px] text-[#A0522D]">B</div>
              </div>
              <div className="ml-2 text-[10px] font-serif tracking-wider text-[#A0522D]">Mundo Tinta</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 