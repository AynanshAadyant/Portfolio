import React from 'react';

interface BackgroundGridProps {
  className?: string;
}

export const BackgroundGrid: React.FC<BackgroundGridProps> = ({ className = '' }) => {
  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Subtle hairline grid lines */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Radial vignette mask for ambient edge fade */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(16, 185, 129, 0.08), transparent 70%), radial-gradient(ellipse 60% 50% at 50% 110%, rgba(6, 182, 212, 0.05), transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 30%, #0A0A0C 95%)',
        }}
      />
    </div>
  );
};
