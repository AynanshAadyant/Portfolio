import type { SpotifyData } from '../../types';

export const FALLBACK_SPOTIFY_DATA: SpotifyData = {
  isPlaying: false,
  nowPlaying: null,
  topTracks: [
    {
      track: 'Starboy',
      artist: 'The Weeknd, Daft Punk',
      album: 'Starboy',
      albumArt: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=120&auto=format&fit=crop&q=80',
      spotifyUrl: 'https://open.spotify.com',
    },
    {
      track: 'Midnight City',
      artist: 'M83',
      album: 'Hurry Up, We\'re Dreaming',
      albumArt: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=120&auto=format&fit=crop&q=80',
      spotifyUrl: 'https://open.spotify.com',
    },
    {
      track: 'Get Lucky',
      artist: 'Daft Punk ft. Pharrell Williams',
      album: 'Random Access Memories',
      albumArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&auto=format&fit=crop&q=80',
      spotifyUrl: 'https://open.spotify.com',
    },
  ],
};
