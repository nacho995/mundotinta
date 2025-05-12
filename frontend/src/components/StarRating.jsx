'use client';

import React from 'react';

export default function StarRating({ rating = 0, totalStars = 5, size = 'md', interactive = false, onRatingChange = null }) {
  const stars = [];
  
  const sizes = {
    sm: { starSize: 'w-4 h-4', wrapper: 'gap-1' },
    md: { starSize: 'w-5 h-5', wrapper: 'gap-1.5' },
    lg: { starSize: 'w-6 h-6', wrapper: 'gap-2' },
  };
  
  const { starSize, wrapper } = sizes[size] || sizes.md;
  
  const handleClick = (newRating) => {
    if (interactive && onRatingChange) {
      onRatingChange(newRating);
    }
  };
  
  for (let i = 1; i <= totalStars; i++) {
    const filled = i <= rating;
    
    stars.push(
      <span 
        key={i} 
        className={`cursor-${interactive ? 'pointer' : 'default'}`}
        onClick={() => handleClick(i)}
      >
        <svg 
          className={`${starSize} ${filled ? 'text-amber-400' : 'text-stone-500'}`} 
          fill={filled ? 'currentColor' : 'none'} 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          ></path>
        </svg>
      </span>
    );
  }
  
  return (
    <div className={`flex items-center ${wrapper}`}>
      {stars}
      {/* Opcionalmente mostrar el valor numérico */}
      {rating > 0 && (
        <span className="text-sm font-medium text-stone-300 ml-1">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
