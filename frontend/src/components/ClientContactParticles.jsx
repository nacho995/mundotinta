'use client';

import { useState, useEffect } from 'react';

export default function ClientContactParticles() {
  const [particles, setParticles] = useState([]);
  
  // Generar partículas solo en el lado del cliente después del montaje del componente
  useEffect(() => {
    const newParticles = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`,
      animationDuration: `${Math.random() * 2 + 1}s`
    }));
    
    setParticles(newParticles);
  }, []);
  
  // No renderizar nada en el servidor, solo en el cliente
  return (
    <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500">
      {particles.map((particle) => (
        <span 
          key={particle.id}
          className="absolute w-1 h-1 bg-[#d3a87d] rounded-full animate-particle"
          style={{
            top: particle.top,
            left: particle.left,
            animationDelay: particle.animationDelay,
            animationDuration: particle.animationDuration,
          }}
        />
      ))}
    </div>
  );
}
