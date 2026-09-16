import React from 'react';
import { Link } from 'react-router-dom';
import type { ProjectDocument } from '../../types';
import { TechTag } from './TechTag';
import { SpotlightCard } from '../reactbits/SpotlightCard';
import { ArrowUpRight } from 'lucide-react';
import { GithubIcon } from '../ui/icons';

interface ProjectCardProps {
  project: ProjectDocument;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <SpotlightCard className="p-5 flex flex-col h-full bg-[#121216] border border-white/10 rounded-lg transition-transform duration-200 hover:-translate-y-1">
      <div className="aspect-video w-full rounded overflow-hidden mb-4 border border-white/10 bg-[#0A0A0C] relative group">
        <img
          src={project.thumbnail_url}
          alt={project.title}
          className="w-full h-full object-cover transition-opacity duration-300"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 -z-10 flex items-center justify-center bg-gradient-to-br from-[#121216] to-[#18181B] text-muted-foreground font-mono text-xs">
          <span>{project.slug}</span>
        </div>
      </div>

      <div className="flex items-start justify-between gap-2 mb-2">
        <Link to={`/projects/${project.slug}`} className="hover:text-[#10B981] transition-colors">
          <h3 className="text-lg font-bold text-[#FAFAFA] tracking-tight flex items-center gap-1 group">
            {project.title}
            <ArrowUpRight className="size-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#10B981]" />
          </h3>
        </Link>
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-[#FAFAFA] transition-colors"
            title="View Source"
          >
            <GithubIcon className="size-4" />
          </a>
        )}
      </div>

      <p className="text-sm text-[#A1A1AA] line-clamp-2 mb-4 font-sans leading-relaxed flex-grow">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-white/5">
        {project.tech_tags.map((tag) => (
          <TechTag key={tag} label={tag} />
        ))}
      </div>
    </SpotlightCard>
  );
};
