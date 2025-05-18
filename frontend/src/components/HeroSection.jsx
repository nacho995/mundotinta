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

// Componente para el pergamino flotante con texto - oculto en móviles y tablets
const FloatingScroll = ({ text, top, left, rotate }) => (
  <div className={`absolute ${top} ${left} transform ${rotate} opacity-0 group-hover:opacity-100 transition-opacity duration-1000 delay-300 z-30 pointer-events-none hidden md:block`}>
    <div className="bg-gradient-to-b from-amber-50 to-amber-100/90 px-3 py-1 rounded-lg shadow-md border border-amber-200/50 max-w-[120px]">
      <p className="text-amber-950/80 text-[10px] font-serif italic text-center">{text}</p>
    </div>
  </div>
);

export default function HeroSection() {
  // Estado para controlar el efecto de cambio de página (0, 1, 2 para rotar entre tres imágenes)
  const [pageIndex, setPageIndex] = useState(0);
  // Estado para el efecto de typing en el título
  const [titleText1, setTitleText1] = useState("");
  const [titleText2, setTitleText2] = useState("");
  // Estado para controlar el tutorial
  const [showTutorial, setShowTutorial] = useState(true);
  
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
    
    // Ocultar el tutorial después de 6 segundos
    const tutorialTimer = setTimeout(() => {
      setShowTutorial(false);
    }, 6000);
    
    return () => {
      clearInterval(type1Interval);
      clearTimeout(tutorialTimer);
    };
  }, []);

  return (
    <section 
      id="hero" 
      className="group relative min-h-screen overflow-hidden pt-20
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
        {/* Polvo mágico que aparece en hover - INTENSIFICADO */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-[#b87333]/0 group-hover:bg-[#b87333]/90 shadow-[0_0_8px_rgba(184,115,51,0)] group-hover:shadow-[0_0_20px_rgba(184,115,51,1)] transition-all duration-1000 delay-100 group-hover:translate-y-[-30px]"></div>
        <div className="absolute top-1/2 left-1/5 w-2 h-2 rounded-full bg-[#A0522D]/0 group-hover:bg-[#A0522D]/90 shadow-[0_0_8px_rgba(160,82,45,0)] group-hover:shadow-[0_0_18px_rgba(160,82,45,0.9)] transition-all duration-1000 delay-300 group-hover:translate-x-[25px]"></div>
        <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 rounded-full bg-[#d2b48c]/0 group-hover:bg-[#d2b48c]/90 shadow-[0_0_8px_rgba(210,180,140,0)] group-hover:shadow-[0_0_15px_rgba(210,180,140,0.9)] transition-all duration-1000 delay-500 group-hover:translate-y-[15px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-2.5 h-2.5 rounded-full bg-[#b87333]/0 group-hover:bg-[#b87333]/90 shadow-[0_0_8px_rgba(184,115,51,0)] group-hover:shadow-[0_0_25px_rgba(184,115,51,1)] transition-all duration-1000 delay-700 group-hover:translate-x-[-35px]"></div>
      </div>
      
      {/* Luces mágicas alrededor que se activan con hover - INTENSIFICADAS */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(184,115,51,0)_0%,transparent_50%)] group-hover:bg-[radial-gradient(circle_at_30%_30%,rgba(184,115,51,0.15)_0%,transparent_60%)] transition-all duration-1000 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(139,69,19,0)_0%,transparent_50%)] group-hover:bg-[radial-gradient(circle_at_70%_70%,rgba(139,69,19,0.12)_0%,transparent_60%)] transition-all duration-1000 pointer-events-none"></div>
      
      {/* Pergaminos con textos que aparecen en hover */}
      <FloatingScroll text="Los mundos perdidos te esperan..." top="top-1/5" left="left-1/4" rotate="rotate-3" />
      <FloatingScroll text="Historias que trascienden el tiempo" top="bottom-1/4" left="right-1/4" rotate="-rotate-2" />
      <FloatingScroll text="Al otro lado del umbral..." top="top-2/3" left="right-1/3" rotate="rotate-1" />
      
      {/* Cuadrícula principal con hover effect en todo el componente */}
      <div className="w-full min-h-screen grid lg:grid-cols-2 relative z-10">

        {/* Columna de Texto (izquierda) - ESTILO BIBLIOTECA MÁGICA */}
        <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left p-8 sm:p-12 md:p-16 lg:p-20 relative group/texto">
          
          {/* Mensaje solo visible en móviles */}
          <div className="lg:hidden mb-6 px-4 py-2 bg-amber-800/20 backdrop-blur-sm rounded-md border border-amber-600/30">
            <div className="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-xs text-amber-200/90 font-serif">Experiencia interactiva completa en pantallas más grandes</p>
            </div>
          </div>
          
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
          
          {/* Título con estilo de libro antiguo - INTENSIFICADO */}
          <div className="relative">
            {/* Decoración de título de libro antiguo */}
            <div className="absolute -top-4 left-0 h-1.5 w-24 bg-[#8B4513]/30 rounded-full hidden lg:block group-hover/texto:bg-[#8B4513]/60 transition-colors duration-500"></div>
            <div className="absolute -bottom-4 right-0 h-1.5 w-24 bg-[#8B4513]/30 rounded-full hidden lg:block group-hover/texto:bg-[#8B4513]/60 transition-colors duration-500"></div>
            
            <h1 className="relative text-5xl md:text-6xl font-bold mb-10 leading-tight font-serif">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#d2b48c] via-[#e6c9ab] to-[#d3a87d] py-2 group-hover/texto:from-[#e6c9ab] group-hover/texto:via-[#f2e0ca] group-hover/texto:to-[#e3b68d] group-hover/texto:drop-shadow-[0_0_8px_rgba(210,180,140,0.3)] transition-all duration-700">
                {titleText1}
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#d3a87d] via-[#e6c9ab]/90 to-[#c19a6b] py-2 group-hover/texto:from-[#e6c9ab] group-hover/texto:via-[#f2e0ca] group-hover/texto:to-[#c19a6b] group-hover/texto:drop-shadow-[0_0_8px_rgba(210,180,140,0.3)] transition-all duration-700">
                {titleText2}
              </span>
              
              {/* Línea decorativa estilo pergamino - INTENSIFICADA */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#A0522D]/60 to-transparent mt-2 group-hover/texto:via-[#b87333]/80 transition-all duration-700"></div>
              
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
          
          {/* Botón con estilo de marcador de libro mágico - INTENSIFICADO */}
          <div className="relative group/btn">
            {/* Resplandor mágico del marcador - Más amplio e intenso */}
            <div className="absolute -inset-2 bg-gradient-to-r from-[#8B4513]/0 via-[#b87333]/70 to-[#A0522D]/0 rounded opacity-0 group-hover/btn:opacity-100 blur-xl transition-all duration-700 animate-pulse-slow"></div>
            
            <a 
              href="/biblioteca"
              className="relative flex items-center justify-center px-8 py-4 
                       bg-gradient-to-b from-[#8B4513] to-stone-900 group-hover/btn:from-[#A0522D] group-hover/btn:to-[#3b291e]
                       text-[#e6c9ab] font-serif tracking-wide
                       rounded border border-[#A0522D]/40 overflow-hidden
                       transition-all duration-500 ease-out transform
                       hover:text-[#f0e0ca] hover:border-[#c19a6b]/90
                       hover:shadow-[0_0_35px_rgba(184,115,51,0.5)]
                       group-hover/btn:shadow-[0_0_45px_rgba(184,115,51,0.6)] group-hover/btn:scale-[1.04]"
            >
              {/* Textura de cuero del marcador */}
              <div className="absolute inset-0 opacity-20 group-hover/btn:opacity-30 transition-opacity duration-700" 
                   style={{
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E")`,
                   }}></div>
              
              {/* Efecto de luz que aparece en hover - Más pronunciado */}
              <div className="absolute -inset-full h-full w-2/3 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-0 group-hover/btn:opacity-30 group-hover/btn:animate-shine"></div>
              
              {/* Partículas brillantes en hover - INTENSIFICADAS */}
              <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 rounded-full bg-[#c19a6b]/0 group-hover/btn:bg-[#c19a6b]/100 blur-[1px] transition-all duration-700 delay-300 group-hover/btn:animate-float-slow"></div>
              <div className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-[#e6c9ab]/0 group-hover/btn:bg-[#e6c9ab]/100 blur-[1px] transition-all duration-700 delay-150 group-hover/btn:animate-float-slow"></div>
              
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
          {/* Tutorial elegante que aparece solo al cargar la página - INTENSIFICADO */}
          {showTutorial && (
            <div className="absolute inset-0 z-50 flex items-center justify-center">
              <div className="bg-gradient-to-b from-stone-900/95 to-stone-950/95 border border-amber-700/60 rounded-lg px-7 py-6 max-w-sm transform transition-all duration-1000 backdrop-blur-md animate-fade-in relative">
                <button 
                  onClick={() => setShowTutorial(false)}
                  className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-amber-800/30 hover:bg-amber-700/60 transition-colors duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-amber-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-800/0 via-amber-700/40 to-amber-800/0 rounded-lg blur-md"></div>
                
                <div className="relative">
                  <div className="flex items-center mb-3.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400 mr-2.5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-amber-300 font-serif text-lg tracking-wide">Descubre la Magia</h3>
                  </div>
                  
                  <p className="text-sm text-stone-300 mb-4 font-serif">
                    Pasa el ratón sobre el libro para ver cómo las páginas cobran vida, revelando nuevos mundos a explorar.
                  </p>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-amber-800/50 flex items-center justify-center mr-3 shadow-inner">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-300 animate-pulse-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
                      </svg>
                    </div>
                    <div className="flex-1 h-1.5 bg-gradient-to-r from-amber-700/50 via-amber-600/80 to-amber-700/50 rounded animate-pulse-slow"></div>
                    <div className="w-10 h-10 rounded-full bg-amber-800/50 flex items-center justify-center ml-3 shadow-inner">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-300 animate-pulse-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Resplandores de fondo - INTENSIFICADOS */}
          <div className="absolute right-1/3 top-1/3 w-80 h-80 rounded-full bg-gradient-radial from-[#b87333]/10 to-transparent blur-3xl pointer-events-none animate-pulse-slow"></div>
          <div className="absolute right-1/4 bottom-1/4 w-96 h-96 rounded-full bg-gradient-radial from-[#8B4513]/10 to-transparent blur-3xl pointer-events-none animate-pulse-slower"></div>
          
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
          
          {/* Elementos mágicos flotantes más visibles */}
          <div className="absolute inset-0 pointer-events-none z-40 opacity-100">
            {/* Motas de polvo mágico más grandes y brillantes */}
            <div className="absolute top-1/4 left-1/3 w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,1)] animate-float-enhanced"></div>
            <div className="absolute top-1/3 right-1/3 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)] animate-float-enhanced animation-delay-150"></div>
            <div className="absolute bottom-1/3 left-1/2 w-4 h-4 rounded-full bg-amber-500 shadow-[0_0_18px_rgba(245,158,11,1)] animate-float-enhanced animation-delay-300"></div>
            <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,1)] animate-float-enhanced animation-delay-700"></div>
            
            {/* Partículas brillantes adicionales */}
            <div className="absolute top-1/3 left-1/4 w-5 h-5 rounded-full bg-amber-300/70 blur-md animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 right-1/3 w-6 h-6 rounded-full bg-amber-500/60 blur-md animate-pulse-slow"></div>
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
          
          {/* LIBRO PRINCIPAL INTERACTIVO CON HOVER ESPECTACULAR */}
          <div className="absolute top-1/2 -translate-y-1/2 left-[15%] w-[80%] aspect-[5/6] group/book">
            {/* Sombra que se ilumina con hover */}
            <div className="absolute -bottom-10 -right-5 -left-5 h-20 opacity-70 blur-xl bg-gradient-to-t from-amber-600/50 via-amber-500/30 to-transparent"></div>
            
            {/* Efectos de luz ambiental para llamar la atención */}
            <div className="absolute -inset-20 bg-gradient-radial from-amber-500/20 to-transparent blur-2xl opacity-70 animate-pulse-slow"></div>
            
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
              
              {/* EFECTO DE CAMBIO DE PÁGINA ALTERNANDO EN HOVER - INTENSIFICADO */}
              <div 
                className="absolute top-[12%] left-[10%] right-[10%] bottom-[12%] rounded-md z-30 overflow-hidden cursor-pointer"
                onMouseEnter={() => setPageIndex((pageIndex + 1) % 3)} // Rotar entre 3 imágenes (0, 1, 2)
                style={{ cursor: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%23e6c9ab' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'/%3E%3C/svg%3E\") 16 16, pointer" }}
              >
                {/* Indicador de interactividad más visible */}
                <div className="absolute bottom-5 right-5 z-50 transition-all duration-700 ease-in-out opacity-100 group-hover/book:opacity-0">
                  <div className="bg-amber-700/90 backdrop-blur-sm px-4 py-3 rounded-full border-2 border-amber-600/80 shadow-xl flex items-center gap-2 transform hover:scale-110 transition-all animate-pulse-slow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-200 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    <span className="text-amber-200 text-base font-serif tracking-wide">Pasa el ratón aquí</span>
                  </div>
                </div>

                {/* Nuevo indicador de cambio de página que aparece en hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/book:opacity-100 bg-black/40 hover:bg-black/20 transition-all duration-500">
                  <div className="bg-amber-800/90 backdrop-blur-md px-7 py-4 rounded-lg border-2 border-amber-600/80 shadow-2xl transform hover:scale-110 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-amber-300 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span className="text-amber-200 text-xl font-serif">{pageIndex === 0 ? "Primera página" : pageIndex === 1 ? "Segunda página" : "Tercera página"}</span>
                    </div>
                  </div>
                </div>

                {/* Contenedor de ambas imágenes - TRANSICIÓN INTENSIFICADA */}
                <div className="relative w-full h-full">
                  {/* Primera imagen con efecto de brillo mejorado */}
                  <div 
                    className={`absolute inset-0 origin-bottom-right transition-transform duration-1000 ease-in-out ${pageIndex === 0 ? 'z-20 opacity-100' : 'z-0 opacity-0'}`}
                    style={{
                      transform: pageIndex !== 0 ? 'perspective(1200px) rotateY(-130deg)' : 'rotateY(0deg)',
                      transformStyle: 'preserve-3d',
                      background: 'linear-gradient(to bottom right, #8B4513, #3b291e)' // Color de fallback
                    }}
                  >
                    {/* Efecto de brillo mejorado */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 via-amber-400/0 to-amber-500/30 animate-gradient-x"></div>
                    
                    {/* Añadimos onError para manejar imágenes que no cargan */}
                    <img 
                      src="/images/dibujoInicial.jpg" 
                      alt="Imagen principal"
                      className="absolute w-full h-full object-cover border-4 border-amber-800/70"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/600x800/8B4513/e6c9ab?text=Mundo+de+Tinta";
                      }}
                    />
                    
                    {/* Efecto de brillo superior */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/60 to-transparent opacity-0 group-hover/book:opacity-100 animate-shine -translate-x-full"></div>
                    </div>
                    
                    {/* Reverso de la página más visible */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-l from-amber-100 to-amber-200 border-4 border-amber-800/70"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                      }}
                    ></div>
                  </div>
                  
                  {/* Segunda imagen con efecto de brillo mejorado */}
                  <div 
                    className={`absolute inset-0 origin-bottom-right transition-transform duration-1000 ease-in-out ${pageIndex === 1 ? 'z-20 opacity-100' : 'z-0 opacity-0'}`}
                    style={{
                      transform: pageIndex !== 1 ? 'perspective(1200px) rotateY(-130deg)' : 'rotateY(0deg)',
                      transformStyle: 'preserve-3d',
                      background: 'linear-gradient(to bottom right, #A0522D, #5e4534)' // Color de fallback
                    }}
                  >
                    {/* Efecto de brillo mejorado */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-600/30 via-amber-500/0 to-amber-600/30 animate-gradient-x"></div>
                    
                    <img 
                      src="/icons/dibujoinicial2.jpg" 
                      alt="Segunda imagen"
                      className="absolute w-full h-full object-cover border-4 border-amber-800/70"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/600x800/A0522D/e6c9ab?text=Fantasia+y+Ficcion";
                      }}
                    />
                    
                    {/* Efecto de brillo superior */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/60 to-transparent opacity-0 group-hover/book:opacity-100 animate-shine -translate-x-full"></div>
                    </div>
                    
                    {/* Reverso de la página más visible */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-l from-amber-100 to-amber-200 border-4 border-amber-800/70"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                      }}
                    ></div>
                  </div>
                  
                  {/* Tercera imagen con efecto de brillo mejorado */}
                  <div 
                    className={`absolute inset-0 origin-bottom-right transition-transform duration-1000 ease-in-out ${pageIndex === 2 ? 'z-20 opacity-100' : 'z-0 opacity-0'}`}
                    style={{
                      transform: pageIndex !== 2 ? 'perspective(1200px) rotateY(-130deg)' : 'rotateY(0deg)',
                      transformStyle: 'preserve-3d',
                      background: 'linear-gradient(to bottom right, #8B4513, #3b291e)' // Color de fallback
                    }}
                  >
                    {/* Efecto de brillo mejorado */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 via-amber-400/0 to-amber-500/30 animate-gradient-x"></div>
                    
                    <img 
                      src="/images/dibujoinicial3.jpg" 
                      alt="Tercera imagen"
                      className="absolute w-full h-full object-cover border-4 border-amber-800/70"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/600x800/8B4513/e6c9ab?text=Mundo+de+Tinta";
                      }}
                    />
                    
                    {/* Efecto de brillo superior */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/60 to-transparent opacity-0 group-hover/book:opacity-100 animate-shine -translate-x-full"></div>
                    </div>
                    
                    {/* Reverso de la página más visible */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-l from-amber-100 to-amber-200 border-4 border-amber-800/70"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                      }}
                    ></div>
                  </div>
                </div>
                
                {/* Brillo global más visible y siempre presente */}
                <div className="absolute top-[12%] left-[10%] right-[10%] bottom-[12%] rounded-md overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/90 to-transparent opacity-50 group-hover/book:opacity-90 animate-shine -translate-x-full"></div>
                </div>
                
                {/* Sombra más pronunciada */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    boxShadow: 'inset 50px 0 50px rgba(0,0,0,0.5)',
                    opacity: 0.9
                  }}
                ></div>
              </div>
            </div>
            
            {/* Sombreado de los bordes de las páginas */}
            <div className="absolute top-0 right-0 h-full w-2 bg-gradient-to-l from-amber-300/80 to-transparent"></div>
            <div className="absolute top-0 right-[3px] h-full w-[1px] bg-amber-100"></div>
          </div>
        </div>
      </div>
    </section>
  );
} 