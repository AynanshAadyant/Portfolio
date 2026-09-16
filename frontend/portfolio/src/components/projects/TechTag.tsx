import React from 'react';

interface TechTagProps {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

export const TechTag: React.FC<TechTagProps> = ({ label, onClick, active = false }) => (
  <span
    onClick={onClick}
    className={`font-mono text-xs px-2 py-0.5 rounded transition-all select-none ${
      active
        ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400 shadow-none font-semibold'
        : 'text-cyan-400 bg-cyan-950/30 border border-cyan-800/40 hover:border-cyan-600/70 hover:bg-cyan-900/30'
    } ${onClick ? 'cursor-pointer' : ''}`}
  >
    {label}
  </span>
);
