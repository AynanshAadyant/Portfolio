import React from 'react';
import { Link } from 'react-router-dom';
import type { ProjectDocument } from '../../types';
import { ProjectCard } from '../projects/ProjectCard';
import { ArrowRight, Layers } from 'lucide-react';

interface SelectedWorkProps {
  projects: ProjectDocument[];
}

export const SelectedWork: React.FC<SelectedWorkProps> = ({ projects }) => {
  const featured = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Layers className="size-5 text-[#10B981]" />
          <h2 className="text-xl font-bold text-[#FAFAFA] tracking-tight">Selected Engineering Work</h2>
        </div>
        <Link
          to="/projects"
          className="text-xs font-mono text-muted-foreground hover:text-[#10B981] flex items-center gap-1 transition-colors"
        >
          <span>View all ({projects.length})</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
};
