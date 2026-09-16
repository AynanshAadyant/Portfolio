import React, { type ReactNode } from 'react';
import { SpotlightCard } from '../reactbits/SpotlightCard';

interface BentoTileProps {
  title?: string;
  subtitle?: string;
  badge?: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const BentoTile: React.FC<BentoTileProps> = ({
  title,
  subtitle,
  badge,
  icon,
  children,
  className = '',
  onClick,
}) => {
  return (
    <SpotlightCard
      onClick={onClick}
      className={`p-5 flex flex-col justify-between border border-white/10 bg-[#121216] rounded-lg transition-all ${className}`}
    >
      {(title || icon || badge) && (
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            {icon && <span className="text-muted-foreground">{icon}</span>}
            {title && <h3 className="font-medium text-sm text-[#FAFAFA] tracking-tight">{title}</h3>}
          </div>
          {badge}
        </div>
      )}
      <div className="flex-1 flex flex-col justify-center">{children}</div>
      {subtitle && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <p className="text-xs text-muted-foreground font-mono">{subtitle}</p>
        </div>
      )}
    </SpotlightCard>
  );
};
