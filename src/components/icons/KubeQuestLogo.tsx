import React from 'react';

interface KubeQuestLogoProps {
  className?: string;
  size?: number;
}

const KubeQuestLogo: React.FC<KubeQuestLogoProps> = ({ className = "", size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer compass circle */}
      <circle
        cx="200"
        cy="200"
        r="180"
        stroke="#4ECDC4"
        strokeWidth="8"
        fill="none"
      />
      
      {/* Inner compass points */}
      <circle cx="200" cy="80" r="12" fill="#4ECDC4" />
      <circle cx="320" cy="200" r="12" fill="#4ECDC4" />
      <circle cx="200" cy="320" r="12" fill="#4ECDC4" />
      <circle cx="80" cy="200" r="12" fill="#4ECDC4" />
      
      {/* Main compass star */}
      <g transform="translate(200, 200)">
        {/* North point */}
        <path
          d="M0,-120 L20,-40 L0,-20 L-20,-40 Z"
          fill="#1E3A8A"
        />
        
        {/* South point */}
        <path
          d="M0,120 L20,40 L0,20 L-20,40 Z"
          fill="#1E3A8A"
        />
        
        {/* East point */}
        <path
          d="M120,0 L40,20 L20,0 L40,-20 Z"
          fill="#1E3A8A"
        />
        
        {/* West point */}
        <path
          d="M-120,0 L-40,20 L-20,0 L-40,-20 Z"
          fill="#1E3A8A"
        />
        
        {/* Northeast point */}
        <path
          d="M85,-85 L25,-25 L5,-45 L-15,-25 Z"
          fill="#F59E0B"
        />
        
        {/* Southeast point */}
        <path
          d="M85,85 L25,25 L5,45 L-15,25 Z"
          fill="#F59E0B"
        />
        
        {/* Southwest point */}
        <path
          d="M-85,85 L-25,25 L-5,45 L15,25 Z"
          fill="#F59E0B"
        />
        
        {/* Northwest point */}
        <path
          d="M-85,-85 L-25,-25 L-5,-45 L15,-25 Z"
          fill="#F59E0B"
        />
        
        {/* Center circle */}
        <circle cx="0" cy="0" r="15" fill="#1E3A8A" />
        
        {/* Center highlight */}
        <circle cx="0" cy="0" r="8" fill="#F59E0B" />
      </g>
      
      {/* Top cross/star */}
      <g transform="translate(200, 40)">
        <path d="M-8,-8 L8,8 M8,-8 L-8,8" stroke="#4ECDC4" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
};

export default KubeQuestLogo;
