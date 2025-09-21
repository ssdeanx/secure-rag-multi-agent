import type { JSX, SVGProps } from 'react';

export function DeanMachinesLogo(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={`logo-fixed-size transition-all duration-300 ease-in-out group ${props.className || ''}`}
    >
      <title>DeanMachines Logo</title>
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="oklch(var(--color-primary))" className="transition-colors duration-300 ease-in-out group-hover:stop-color-[oklch(var(--color-accent))]"/>
          <stop offset="100%" stopColor="oklch(var(--color-accent))" className="transition-colors duration-300 ease-in-out group-hover:stop-color-[oklch(var(--color-primary))]"/>
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Main Symbol */}
      <g className="group-hover:filter-[url(#glow)] transition-all duration-300 ease-in-out group-hover:rotate-[10deg] group-hover:scale-110">
        {/* Stylized 'D' */}
        <path 
          d="M4 4 C12 2, 20 6, 20 12 C20 18, 12 22, 4 20 L4 4 Z" 
          fill="url(#logo-gradient)"
          className="transition-all duration-300 ease-in-out"
        />
        
        {/* Stylized 'M' cutout */}
        <path 
          d="M8 8 L8 16 L11 13 L14 16 L14 8 L11 11 L8 8 Z" 
          fill="oklch(var(--background))"
          className="transition-all duration-300 ease-in-out"
        />
      </g>
    </svg>
  );
}