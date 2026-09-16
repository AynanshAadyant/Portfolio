import React from 'react';
import type { SpotifyData } from '../../types';
import { BentoTile } from './BentoTile';
import { SpotifyEqualizer } from './SpotifyEqualizer';
import { Music, Radio, ExternalLink } from 'lucide-react';

interface SpotifyTileProps {
  spotify: SpotifyData;
}

export const SpotifyTile: React.FC<SpotifyTileProps> = ({ spotify }) => {
  const isPlaying = spotify.isPlaying && !!spotify.nowPlaying;
  const currentTrack = isPlaying ? spotify.nowPlaying : spotify.topTracks[0];

  return (
    <BentoTile
      title={isPlaying ? 'Now Playing' : 'Heavy Rotation'}
      icon={<Music className="size-4 text-emerald-400" />}
      badge={
        <div className="flex items-center gap-2">
          <SpotifyEqualizer isPlaying={isPlaying} />
          <span className="text-[11px] font-mono text-muted-foreground uppercase">
            {isPlaying ? 'Live on Spotify' : 'Offline'}
          </span>
        </div>
      }
      subtitle={isPlaying ? 'Synchronized with Spotify' : 'Top tracks currently on repeat'}
      className="col-span-1"
    >
      {currentTrack ? (
        <div className="flex items-center gap-3.5 my-2">
          <div className="size-14 rounded-md overflow-hidden bg-[#0A0A0C] border border-white/10 shrink-0 relative group">
            <img
              src={currentTrack.albumArt}
              alt={currentTrack.track}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Radio className="size-4 text-emerald-400" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <a
              href={currentTrack.spotifyUrl}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-sm text-[#FAFAFA] hover:text-emerald-400 transition-colors truncate block flex items-center gap-1 group"
            >
              <span className="truncate">{currentTrack.track}</span>
              <ExternalLink className="size-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </a>
            <p className="text-xs text-muted-foreground truncate font-sans">{currentTrack.artist}</p>
            {currentTrack.album && (
              <p className="text-[11px] text-muted-foreground/70 truncate font-mono mt-0.5">
                {currentTrack.album}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="py-4 text-center text-xs text-muted-foreground font-mono">
          No playback activity detected
        </div>
      )}

      {/* Top tracks mini-list if idle */}
      {!isPlaying && spotify.topTracks.length > 1 && (
        <div className="mt-2 space-y-1 pt-2 border-t border-white/5">
          {spotify.topTracks.slice(1, 3).map((item, i) => (
            <div key={i} className="flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span className="truncate max-w-[180px] text-[#FAFAFA]/80">{item.track}</span>
              <span className="text-[10px] text-muted-foreground truncate">{item.artist}</span>
            </div>
          ))}
        </div>
      )}
    </BentoTile>
  );
};
