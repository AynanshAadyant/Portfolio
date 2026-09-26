import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { FALLBACK_SPOTIFY_DATA } from '../data/fallback/spotify.fallback';
import type { SpotifyData } from '../types';

export function useSpotify() {
  return useQuery<SpotifyData>({
    queryKey: ['spotify-data'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/api/spotify/now-playing');
        if (data && typeof data.isPlaying === 'boolean') {
          return {
            isPlaying: data.isPlaying,
            nowPlaying: data.nowPlaying ?? null,
            topTracks: Array.isArray(data.topTracks) && data.topTracks.length > 0
              ? data.topTracks
              : FALLBACK_SPOTIFY_DATA.topTracks,
          };
        }
        return FALLBACK_SPOTIFY_DATA;
      } catch {
        return FALLBACK_SPOTIFY_DATA;
      }
    },
    initialData: FALLBACK_SPOTIFY_DATA,
    initialDataUpdatedAt: 0,
    refetchInterval: () => (typeof document !== 'undefined' && document.hidden ? false : 30000),
  });
}
