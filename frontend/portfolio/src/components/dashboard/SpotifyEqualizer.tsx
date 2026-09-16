import React from 'react';

interface SpotifyEqualizerProps {
  isPlaying: boolean;
}

export const SpotifyEqualizer: React.FC<SpotifyEqualizerProps> = ({ isPlaying }) => {
  return (
    <div className="flex items-end gap-[3px] h-4" aria-hidden="true">
      {[1, 2, 3, 4].map((bar) => (
        <span
          key={bar}
          className={`w-1 rounded-sm transition-all duration-300 ${
            isPlaying ? 'bg-[#10B981] animate-pulse' : 'bg-[#A1A1AA]/40 h-1.5'
          }`}
          style={
            isPlaying
              ? {
                  height: `${[45, 100, 70, 30][bar - 1]}%`,
                  animationDuration: `${0.6 + bar * 0.2}s`,
                }
              : undefined
          }
        />
      ))}
    </div>
  );
};
