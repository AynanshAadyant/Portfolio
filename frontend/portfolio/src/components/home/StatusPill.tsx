import React from 'react';

interface StatusPillProps {
  status: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-950/20 text-emerald-400 font-mono text-xs mb-6 backdrop-blur-sm">
      <span className="relative flex size-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
      </span>
      <span>{status}</span>
    </div>
  );
};
