import React from 'react';
import { Hammer, BookOpen, Cpu } from 'lucide-react';

interface RightNowStripProps {
  building: string;
  reading: string;
  learning: string;
}

export const RightNowStrip: React.FC<RightNowStripProps> = ({ building, reading, learning }) => {
  const items = [
    {
      label: 'BUILDING',
      value: building,
      icon: <Hammer className="size-4 text-[#10B981]" />,
    },
    {
      label: 'READING',
      value: reading,
      icon: <BookOpen className="size-4 text-cyan-400" />,
    },
    {
      label: 'RESEARCHING',
      value: learning,
      icon: <Cpu className="size-4 text-amber-400" />,
    },
  ];

  return (
    <section className="py-8 border-b border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 rounded-lg border border-white/10 bg-[#121216]">
        {items.map((item, idx) => (
          <div key={idx} className="p-4 flex items-start gap-3.5">
            <div className="mt-0.5 p-2 rounded bg-[#0A0A0C] border border-white/5 shrink-0">
              {item.icon}
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-mono tracking-wider text-muted-foreground uppercase block mb-1">
                {item.label}
              </span>
              <p className="text-sm font-medium text-[#FAFAFA] font-sans truncate">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
