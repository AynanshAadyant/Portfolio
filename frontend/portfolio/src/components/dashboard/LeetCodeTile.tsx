import React from 'react';
import type { LeetCodeStats } from '../../types';
import { CountUp } from '../reactbits/CountUp';
import { BentoTile } from './BentoTile';
import { Code2, Flame, Award, Trophy } from 'lucide-react';

interface LeetCodeTileProps {
  stats: LeetCodeStats;
}

export const LeetCodeTile: React.FC<LeetCodeTileProps> = ({ stats }) => {
  const easyPct = Math.round((stats.easySolved / stats.totalSolved) * 100) || 0;
  const medPct = Math.round((stats.mediumSolved / stats.totalSolved) * 100) || 0;
  const hardPct = Math.round((stats.hardSolved / stats.totalSolved) * 100) || 0;

  return (
    <BentoTile
      title="LeetCode Problem Solving"
      icon={<Code2 className="size-4 text-[#10B981]" />}
      badge={
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 font-mono text-xs">
          <Flame className="size-3 text-orange-400" />
          <span>{stats.streakDays}d Streak</span>
        </div>
      }
      subtitle={`Contest Rating: ${stats.contestRating} • MAIT Computer Science`}
      className="col-span-1 md:col-span-2"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {/* Total Solved Hero Stat */}
        <div className="p-4 rounded-lg bg-[#0A0A0C] border border-white/5 flex flex-col justify-center">
          <span className="text-xs text-muted-foreground uppercase font-mono mb-1">Total Solved</span>
          <div className="text-3xl font-bold text-[#FAFAFA] font-mono">
            <CountUp to={stats.totalSolved} />
          </div>
          <span className="text-[11px] text-muted-foreground font-mono mt-1">across all algorithms</span>
        </div>

        {/* Difficulty Breakdown */}
        <div className="sm:col-span-2 p-4 rounded-lg bg-[#0A0A0C] border border-white/5 flex flex-col justify-between gap-2.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-400">Easy ({stats.easySolved})</span>
            <span className="text-amber-400">Med ({stats.mediumSolved})</span>
            <span className="text-rose-400">Hard ({stats.hardSolved})</span>
          </div>

          {/* Segmented Progress Bar */}
          <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden flex">
            <div style={{ width: `${easyPct}%` }} className="bg-emerald-500 h-full" />
            <div style={{ width: `${medPct}%` }} className="bg-amber-500 h-full" />
            <div style={{ width: `${hardPct}%` }} className="bg-rose-500 h-full" />
          </div>

          <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono pt-1">
            <span className="flex items-center gap-1">
              <Trophy className="size-3 text-amber-400" /> Rating: {stats.contestRating}
            </span>
            <span className="flex items-center gap-1">
              <Award className="size-3 text-cyan-400" /> {stats.badges.length} Badges
            </span>
          </div>
        </div>
      </div>

      {/* Recent Submissions */}
      {stats.recentSubmissions && stats.recentSubmissions.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
            Recent Verified Submissions
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {stats.recentSubmissions.slice(0, 4).map((sub, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-2.5 py-1.5 rounded bg-white/[0.02] border border-white/5 text-xs font-mono"
              >
                <span className="text-[#FAFAFA] truncate max-w-[160px]">{sub.title}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                    sub.difficulty === 'Hard'
                      ? 'text-rose-400 bg-rose-950/40 border border-rose-800/40'
                      : sub.difficulty === 'Medium'
                      ? 'text-amber-400 bg-amber-950/40 border border-amber-800/40'
                      : 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/40'
                  }`}
                >
                  {sub.difficulty}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </BentoTile>
  );
};
