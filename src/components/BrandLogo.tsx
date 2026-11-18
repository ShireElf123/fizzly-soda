import React from 'react';
import type { BrandId } from '../data/brands';

interface BrandLogoProps {
  brand: BrandId;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  brand,
  size = 'md',
  className = '',
}) => {
  const heightMap = {
    sm: 'h-8',
    md: 'h-11',
    lg: 'h-16',
  };

  if (brand === 'gladchemistry') {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        <img
          src="/images/gladchemistry-logo.jpg"
          alt="Gladchemistry Products Logo"
          className={`${heightMap[size]} w-auto rounded-lg object-contain bg-white p-0.5 shadow-sm border border-emerald-100`}
        />
      </div>
    );
  }

  if (brand === 'felis-be-glad') {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        <svg
          viewBox="0 0 44 44"
          className={`${heightMap[size]} w-auto`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="44" height="44" rx="12" fill="#1C1917" />
          <path
            d="M22 8L26.5 17.5L36 22L26.5 26.5L22 36L17.5 26.5L8 22L17.5 17.5L22 8Z"
            stroke="#F59E0B"
            strokeWidth="2"
            fill="#F59E0B"
            fillOpacity="0.18"
          />
          <circle cx="22" cy="22" r="4" fill="#FBBF24" />
        </svg>
        <div className="flex flex-col leading-none">
          <span className="font-display font-bold tracking-tight text-stone-900 text-base">
            Felis <span className="text-amber-600">be Glad</span>
          </span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-stone-500 font-medium">
            Fine Fragrances
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 44 44"
        className={`${heightMap[size]} w-auto`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="44" height="44" rx="12" fill="#0284C7" />
        <circle cx="17" cy="24" r="7" fill="#38BDF8" stroke="white" strokeWidth="2" />
        <circle cx="28" cy="17" r="5" fill="#A3E635" stroke="white" strokeWidth="2" />
        <circle cx="29" cy="29" r="3.5" fill="white" fillOpacity="0.9" />
      </svg>
      <div className="flex flex-col leading-none">
        <span className="font-display font-extrabold tracking-tight text-sky-950 text-base">
          BUBBLES
        </span>
        <span className="text-[10px] uppercase tracking-[0.16em] text-sky-600 font-bold">
          Detergents
        </span>
      </div>
    </div>
  );
};
