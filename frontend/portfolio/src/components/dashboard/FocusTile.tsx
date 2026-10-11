import React from 'react';
import { BentoTile } from './BentoTile';
import { useContent } from '../../hooks/useContent';
import { Boxes, BookOpen, Sparkles, Compass } from 'lucide-react';

export const FocusTile: React.FC = () => {
  const { data: building } = useContent('home.right_now.building');
  const { data: reading } = useContent('home.right_now.reading');
  const { data: researching } = useContent('home.right_now.researching');

  const buildingText = building || 'Distributed IoT & AI Microservices';
  const readingText = reading || 'Designing Data-Intensive Applications';
  const researchingText = researching || 'Distributed Systems & Cold-Start Caching';

  return (
    <BentoTile
      title="Current Focus"
      icon={<Compass className="size-4 text-emerald-400" />}
      badge={
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 font-mono text-xs">
          <span className="size-1.5 rounded-full bg-[#10B981] animate-ping" />
          <span>Active</span>
        </div>
      }
      subtitle="Real-time engineering pursuits & research"
      className="col-span-1 md:col-span-1"
    >
      <div className="space-y-3 my-1">
        {/* Building */}
        <div className="p-3 rounded-lg bg-[#0A0A0C] border border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className="flex items-center gap-2 mb-1">
            <Boxes className="size-3.5 text-emerald-400" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Building
            </span>
          </div>
          <p className="text-xs font-medium text-[#FAFAFA] group-hover:text-emerald-300 transition-colors line-clamp-2">
            {buildingText}
          </p>
        </div>

        {/* Reading */}
        <div className="p-3 rounded-lg bg-[#0A0A0C] border border-white/5 hover:border-cyan-500/30 transition-all group">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="size-3.5 text-cyan-400" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              Reading
            </span>
          </div>
          <p className="text-xs font-medium text-[#FAFAFA] group-hover:text-cyan-300 transition-colors line-clamp-2">
            {readingText}
          </p>
        </div>

        {/* Researching */}
        <div className="p-3 rounded-lg bg-[#0A0A0C] border border-white/5 hover:border-purple-500/30 transition-all group">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="size-3.5 text-purple-400" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-purple-400 font-semibold">
              Researching
            </span>
          </div>
          <p className="text-xs font-medium text-[#FAFAFA] group-hover:text-purple-300 transition-colors line-clamp-2">
            {researchingText}
          </p>
        </div>
      </div>
    </BentoTile>
  );
};
