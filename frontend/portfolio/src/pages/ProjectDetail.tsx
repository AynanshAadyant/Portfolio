import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useProject } from '../hooks/useProjects';
import { DynamicDiagram } from '../components/diagrams/DynamicDiagram';
import { TechTag } from '../components/projects/TechTag';
import { CodeBlock } from '../components/projects/CodeBlock';
import { Button } from '../components/ui/button';
import { GithubIcon } from '../components/ui/icons';
import {
  ArrowLeft,
  ExternalLink,
  Cpu,
  AlertCircle,
  Network,
  CheckCircle2,
} from 'lucide-react';

export const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading } = useProject(slug || '');

  if (isLoading) {
    return (
      <div className="py-20 text-center font-mono text-sm text-muted-foreground">
        Loading system architecture...
      </div>
    );
  }

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <div className="py-8 max-w-4xl mx-auto">
      {/* Back navigation */}
      <div className="mb-8">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-[#FAFAFA] transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Projects</span>
        </Link>
      </div>

      {/* Header */}
      <div className="border-b border-white/10 pb-8 mb-10">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {project.tech_tags.map((tag) => (
            <TechTag key={tag} label={tag} />
          ))}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#FAFAFA] tracking-tight mb-4">
          {project.title}
        </h1>

        <p className="text-base text-[#A1A1AA] leading-relaxed mb-6 font-sans">
          {project.description}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noreferrer">
              <Button
                variant="outline"
                className="gap-2 border-white/10 bg-[#121216] text-[#FAFAFA] hover:bg-white/5"
              >
                <GithubIcon className="size-4" />
                View Repository
              </Button>
            </a>
          )}
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noreferrer">
              <Button className="gap-2 bg-[#10B981] hover:bg-[#10B981]/90 text-[#0A0A0C]">
                <ExternalLink className="size-4" />
                Live Deployment
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* Problem Section */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-3 text-[#FAFAFA]">
          <AlertCircle className="size-5 text-amber-400" />
          <h2 className="text-xl font-bold tracking-tight">The Problem</h2>
        </div>
        <div className="p-5 rounded-lg border border-white/10 bg-[#121216] text-sm text-[#A1A1AA] leading-relaxed font-sans">
          {project.problem}
        </div>
      </section>

      {/* Architecture & Dynamic Diagram */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-3 text-[#FAFAFA]">
          <Network className="size-5 text-[#10B981]" />
          <h2 className="text-xl font-bold tracking-tight">System Architecture & Pipeline</h2>
        </div>

        <p className="text-sm text-[#A1A1AA] leading-relaxed mb-4 font-sans">
          {project.architecture}
        </p>

        {/* Dynamic Mermaid Diagram */}
        {project.architecture_diagram && (
          <div className="my-6">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-2">
              Runtime Architecture Graph
            </span>
            <DynamicDiagram chart={project.architecture_diagram} />
          </div>
        )}
      </section>

      {/* Key Implementation Features & Code */}
      {project.key_features && project.key_features.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4 text-[#FAFAFA]">
            <Cpu className="size-5 text-cyan-400" />
            <h2 className="text-xl font-bold tracking-tight">Key Engineering Features</h2>
          </div>

          <div className="space-y-6">
            {project.key_features.map((feature, idx) => (
              <div key={idx}>
                <h3 className="text-base font-semibold text-[#FAFAFA] mb-2 font-mono">
                  {idx + 1}. {feature.title}
                </h3>
                <CodeBlock
                  code={feature.code}
                  language={feature.language}
                  title={feature.title}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Impact & Performance Metrics */}
      {project.impact_metrics && Object.keys(project.impact_metrics).length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4 text-[#FAFAFA]">
            <CheckCircle2 className="size-5 text-[#10B981]" />
            <h2 className="text-xl font-bold tracking-tight">Impact & Verification Metrics</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(project.impact_metrics).map(([key, value]) => (
              <div
                key={key}
                className="p-4 rounded-lg border border-white/10 bg-[#121216] flex flex-col"
              >
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">
                  {key.replace(/_/g, ' ')}
                </span>
                <span className="text-xl font-bold text-[#FAFAFA] font-mono">{String(value)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
