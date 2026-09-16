export interface KeyFeature {
  title: string;
  code: string;
  language: string;
}

export interface ProjectDocument {
  slug: string;
  title: string;
  description: string;
  problem: string;
  architecture: string;
  architecture_diagram: string;
  key_features: KeyFeature[];
  impact_metrics: Record<string, string | number>;
  tech_tags: string[];
  github_url: string;
  live_url: string;
  thumbnail_url: string;
  featured: boolean;
  display_order: number;
}

export interface LeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  contestRating: number;
  streakDays: number;
  badges: string[];
  recentSubmissions: {
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    timestamp: string;
  }[];
}

export interface SpotifyTrack {
  track: string;
  artist: string;
  album?: string;
  albumArt: string;
  spotifyUrl: string;
}

export interface SpotifyData {
  isPlaying: boolean;
  nowPlaying: SpotifyTrack | null;
  topTracks: SpotifyTrack[];
}

export type ContentBlockMap = Record<string, string>;
