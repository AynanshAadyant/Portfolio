import React from 'react';
import { useLeetCode } from '../hooks/useLeetCode';
import { useSpotify } from '../hooks/useSpotify';
import { useGithub } from '../hooks/useGithub';
import { LeetCodeTile } from '../components/dashboard/LeetCodeTile';
import { SpotifyTile } from '../components/dashboard/SpotifyTile';
import { GitActivityTile } from '../components/dashboard/GitActivityTile';
import { Activity } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { data: leetCodeStats } = useLeetCode();
  const { data: spotifyData } = useSpotify();
  const { data: githubData } = useGithub();

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8 pb-8 border-b border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="size-5 text-[#10B981]" />
          <h1 className="text-3xl font-extrabold text-[#FAFAFA] tracking-tight">
            Live Engineering Dashboard
          </h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl font-sans">
          Real-time telemetry, algorithmic activity, current listening rotation, and GitHub CI/CD activity.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LeetCode Tile (spans 2 cols) */}
        {leetCodeStats && <LeetCodeTile stats={leetCodeStats} />}

        {/* Spotify Tile (1 col) */}
        {spotifyData && <SpotifyTile spotify={spotifyData} />}

        {/* Git Activity Tile (spans 3 cols) */}
        {githubData && <GitActivityTile data={githubData} />}
      </div>
    </div>
  );
};
