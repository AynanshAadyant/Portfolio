import React, { useState, useMemo } from 'react';
import { useProjects } from '../hooks/useProjects';
import { ProjectCard } from '../components/projects/ProjectCard';
import { TechTag } from '../components/projects/TechTag';
import { Terminal, Filter } from 'lucide-react';

export const Projects: React.FC = () => {
  const { data: projects = [] } = useProjects();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract unique tech tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach((p) => p.tech_tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    if (!selectedTag) return projects;
    return projects.filter((p) => p.tech_tags.includes(selectedTag));
  }, [projects, selectedTag]);

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8 pb-8 border-b border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Terminal className="size-5 text-[#10B981]" />
          <h1 className="text-3xl font-extrabold text-[#FAFAFA] tracking-tight">
            Engineering Projects & Systems
          </h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl font-sans">
          Production systems, distributed microservices, hardware IoT pipelines, and AI orchestrations.
          Each case study includes architecture diagrams, problems tackled, and implementation code.
        </p>

        {/* Tag Filters */}
        <div className="flex items-center flex-wrap gap-2 mt-6">
          <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground mr-1">
            <Filter className="size-3.5 text-[#10B981]" />
            <span>Filter:</span>
          </div>

          <button
            onClick={() => setSelectedTag(null)}
            className={`font-mono text-xs px-2.5 py-1 rounded transition-all ${
              selectedTag === null
                ? 'bg-white text-black font-semibold'
                : 'text-muted-foreground bg-white/[0.04] border border-white/10 hover:text-white'
            }`}
          >
            All ({projects.length})
          </button>

          {allTags.map((tag) => (
            <TechTag
              key={tag}
              label={tag}
              active={selectedTag === tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            />
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="py-16 text-center text-sm font-mono text-muted-foreground">
          No projects match tag "{selectedTag}".
        </div>
      )}
    </div>
  );
};
