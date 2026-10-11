import React from 'react';
import { useLeetCode } from '../hooks/useLeetCode';
import { useGithub } from '../hooks/useGithub';
import { LeetCodeTile } from '../components/dashboard/LeetCodeTile';
import { GitActivityTile } from '../components/dashboard/GitActivityTile';
import { FocusTile } from '../components/dashboard/FocusTile';
import { Activity } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { data: leetCodeStats } = useLeetCode();
  const { data: githubData } = useGithub();
  //  const { data: spotifyData } = useSpotify();

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
          Real-time telemetry, algorithmic activity, current listening rotation, active focus pursuits, and GitHub CI/CD activity.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Row 1: LeetCode Tile (2 cols) & Spotify Tile (1 col) */}
        {leetCodeStats && <LeetCodeTile stats={leetCodeStats} />}

        {/* Row 2: Git Activity Tile (2 cols) & Current Focus Tile (1 col) */}
        {githubData && <GitActivityTile data={githubData} />}
        <FocusTile />
      </div>
    </div>
  );
};
