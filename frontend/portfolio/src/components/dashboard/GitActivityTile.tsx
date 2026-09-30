import React from 'react';
import type { GithubData } from '../../types';
import { BentoTile } from './BentoTile';
import { GitCommit, ExternalLink, GitBranch } from 'lucide-react';

interface GitActivityTileProps {
  data: GithubData;
}

export const GitActivityTile: React.FC<GitActivityTileProps> = ({ data }) => {
  const commits = data.commits?.length > 0 ? data.commits.slice(0, 4) : [];
  const profileUrl = data.profileUrl || `https://github.com/${data.username || 'aynanshaadyant'}`;

  return (
    <BentoTile
      title="Recent Git Activity"
      icon={<GitCommit className="size-4 text-emerald-400" />}
      badge={
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 font-mono text-xs">
          <span className="size-1.5 rounded-full bg-[#10B981] animate-pulse" />
          <span>Active CI/CD</span>
        </div>
      }
      subtitle="Real-time repository commits & code activity"
      className="col-span-1 md:col-span-3"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-2">
        {commits.map((commit, idx) => {
          const repoShort = commit.repo.includes('/') ? commit.repo.split('/')[1] : commit.repo;
          const formattedDate = commit.date
            ? new Date(commit.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            : '';

          return (
            <a
              key={commit.sha || idx}
              href={commit.url || `${profileUrl}/${repoShort}`}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-lg bg-[#0A0A0C] border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col justify-between gap-2 group"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium text-[#FAFAFA] group-hover:text-emerald-400 transition-colors line-clamp-1 font-sans">
                  {commit.message}
                </span>
                <ExternalLink className="size-3.5 text-muted-foreground group-hover:text-emerald-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-1 border-t border-white/5">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <GitBranch className="size-3" />
                  <span className="truncate max-w-[140px]">{repoShort}</span>
                </span>
                <div className="flex items-center gap-2">
                  {commit.sha && (
                    <span className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-muted-foreground">
                      {commit.sha.substring(0, 7)}
                    </span>
                  )}
                  {formattedDate && <span>{formattedDate}</span>}
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* See More Button */}
      <div className="pt-2">
        <a
          href={profileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-md bg-[#0A0A0C] border border-white/10 hover:border-emerald-500/50 hover:bg-white/[0.04] text-xs font-mono text-[#FAFAFA] transition-all group shadow-sm"
        >
          <span>See more on GitHub</span>
          <ExternalLink className="size-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </BentoTile>
  );
};
