import React from 'react';
import { Link } from 'react-router-dom';
import { StatusPill } from './StatusPill';
import { DecryptText } from '../reactbits/DecryptText';
import { Button } from '../ui/button';
import { ArrowRight, Terminal, FileText, Activity } from 'lucide-react';

interface HeroSectionProps {
  statusPillText: string;
  headlineText: string;
  subheadlineText: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  statusPillText,
  headlineText,
  subheadlineText,
}) => {
  return (
    <section className="pt-12 pb-16 border-b border-white/10">
      <StatusPill status={statusPillText} />

      <div className="max-w-4xl">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#FAFAFA] tracking-tight leading-[1.15] mb-6">
          <DecryptText text={headlineText} speed={25} />
        </h1>

        <p className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed mb-8 max-w-3xl font-sans">
          {subheadlineText}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Link to="/projects" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto gap-2 bg-[#10B981] hover:bg-[#10B981]/90 text-[#0A0A0C] font-semibold border-0 px-4 py-2 text-sm rounded-md">
              <Terminal className="size-4" />
              Explore Systems & Architecture
              <ArrowRight className="size-4" />
            </Button>
          </Link>

          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto gap-2 border-white/10 bg-[#121216] text-[#FAFAFA] hover:bg-white/5 hover:text-white px-4 py-2 text-sm rounded-md"
            >
              <Activity className="size-4 text-[#10B981]" />
              Live Dashboard
            </Button>
          </Link>

          <Link to="/resume" className="w-full sm:w-auto">
            <Button
              variant="ghost"
              className="w-full sm:w-auto gap-2 text-muted-foreground hover:text-[#FAFAFA] hover:bg-white/5 px-3 py-2 text-sm rounded-md"
            >
              <FileText className="size-4" />
              Resume
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
