import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Loader2,
  Plus,
  Trash2,
  Code,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import type { ProjectDocument, KeyFeature } from '../../types';
import { DynamicDiagram } from '../diagrams/DynamicDiagram';

interface ProjectEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: Partial<ProjectDocument>) => Promise<void>;
  initialData?: ProjectDocument | null;
}

const DEFAULT_MERMAID = `graph TD
  A[Client] -->|HTTP/REST| B[BFF Service]
  B --> C[(MongoDB)]
  B --> D[External APIs]`;

export const ProjectEditorModal: React.FC<ProjectEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'features' | 'diagram'>('details');

  // Form fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [problem, setProblem] = useState('');
  const [architecture, setArchitecture] = useState('');
  const [architectureDiagram, setArchitectureDiagram] = useState(DEFAULT_MERMAID);
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(0);

  // Tech tags
  const [techTags, setTechTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  // Key Features
  const [keyFeatures, setKeyFeatures] = useState<KeyFeature[]>([]);

  // Impact Metrics
  const [impactMetrics, setImpactMetrics] = useState<[string, string][]>([]);
  const [newMetricKey, setNewMetricKey] = useState('');
  const [newMetricVal, setNewMetricVal] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-slug generation from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setSlug(initialData.slug || '');
      setDescription(initialData.description || '');
      setProblem(initialData.problem || '');
      setArchitecture(initialData.architecture || '');
      setArchitectureDiagram(initialData.architecture_diagram || DEFAULT_MERMAID);
      setGithubUrl(initialData.github_url || '');
      setLiveUrl(initialData.live_url || '');
      setThumbnailUrl(initialData.thumbnail_url || '');
      setFeatured(Boolean(initialData.featured));
      setDisplayOrder(initialData.display_order ?? 0);
      setTechTags(initialData.tech_tags || []);
      setKeyFeatures(initialData.key_features || []);
      setImpactMetrics(
        initialData.impact_metrics
          ? Object.entries(initialData.impact_metrics).map(([k, v]) => [k, String(v)])
          : []
      );
    } else {
      setTitle('');
      setSlug('');
      setDescription('');
      setProblem('');
      setArchitecture('');
      setArchitectureDiagram(DEFAULT_MERMAID);
      setGithubUrl('');
      setLiveUrl('');
      setThumbnailUrl('/thumbnails/default.webp');
      setFeatured(false);
      setDisplayOrder(0);
      setTechTags(['React', 'TypeScript', 'Node.js']);
      setKeyFeatures([
        {
          title: 'Core Implementation',
          code: '// Implementation snippet\nfunction init() {\n  return true;\n}',
          language: 'typescript',
        },
      ]);
      setImpactMetrics([
        ['performance', 'High'],
        ['latency', '<10ms'],
      ]);
    }
    setError(null);
    setActiveTab('details');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Tech tags management
  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (!techTags.includes(newTag.trim())) {
      setTechTags([...techTags, newTag.trim()]);
    }
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTechTags(techTags.filter((t) => t !== tagToRemove));
  };

  // Features management
  const handleAddFeature = () => {
    setKeyFeatures([
      ...keyFeatures,
      {
        title: 'New Feature Highlight',
        code: '// Code snippet',
        language: 'typescript',
      },
    ]);
  };

  const handleUpdateFeature = (index: number, field: keyof KeyFeature, val: string) => {
    const updated = [...keyFeatures];
    updated[index] = { ...updated[index], [field]: val };
    setKeyFeatures(updated);
  };

  const handleRemoveFeature = (index: number) => {
    setKeyFeatures(keyFeatures.filter((_, i) => i !== index));
  };

  // Metrics management
  const handleAddMetric = () => {
    if (!newMetricKey.trim() || !newMetricVal.trim()) return;
    setImpactMetrics([...impactMetrics, [newMetricKey.trim(), newMetricVal.trim()]]);
    setNewMetricKey('');
    setNewMetricVal('');
  };

  const handleRemoveMetric = (index: number) => {
    setImpactMetrics(impactMetrics.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      setError('Title and Slug are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const metricsObject = Object.fromEntries(impactMetrics);

    const payload: Partial<ProjectDocument> = {
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      description: description.trim(),
      problem: problem.trim(),
      architecture: architecture.trim(),
      architecture_diagram: architectureDiagram.trim(),
      github_url: githubUrl.trim(),
      live_url: liveUrl.trim(),
      thumbnail_url: thumbnailUrl.trim(),
      featured,
      display_order: Number(displayOrder) || 0,
      tech_tags: techTags,
      key_features: keyFeatures,
      impact_metrics: metricsObject,
    };

    try {
      await onSave(payload);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to save project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#121216] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#18181B]/50">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981]">
              <Layers className="size-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#FAFAFA]">
                {initialData ? `Edit Project: ${initialData.title}` : 'Create New Project'}
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Slug: <span className="font-mono text-emerald-400">{slug || 'not-set'}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-[#FAFAFA] hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/10 bg-[#121216]">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'details'
                ? 'border-[#10B981] text-[#10B981]'
                : 'border-transparent text-muted-foreground hover:text-[#FAFAFA]'
            }`}
          >
            1. Core Details & Metadata
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('features')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'features'
                ? 'border-[#10B981] text-[#10B981]'
                : 'border-transparent text-muted-foreground hover:text-[#FAFAFA]'
            }`}
          >
            2. Features & Metrics ({keyFeatures.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('diagram')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'diagram'
                ? 'border-[#10B981] text-[#10B981]'
                : 'border-transparent text-muted-foreground hover:text-[#FAFAFA]'
            }`}
          >
            <Sparkles className="size-3.5" />
            <span>3. Architecture Diagram (Live Mermaid)</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: DETAILS */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!initialData) setSlug(generateSlug(e.target.value));
                    }}
                    placeholder="e.g. Distributed IoT Telemetry"
                    required
                    className="w-full px-3.5 py-2 bg-[#18181B] border border-white/10 rounded-lg text-sm text-[#FAFAFA] placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#10B981]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Slug (URL identifier) *
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(generateSlug(e.target.value))}
                    disabled={Boolean(initialData)}
                    placeholder="e.g. distributed-iot-telemetry"
                    required
                    className="w-full px-3.5 py-2 bg-[#18181B] border border-white/10 rounded-lg text-sm text-[#FAFAFA] placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#10B981]/50 font-mono disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary shown on project cards..."
                  className="w-full px-3.5 py-2 bg-[#18181B] border border-white/10 rounded-lg text-sm text-[#FAFAFA] placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#10B981]/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Problem Statement
                  </label>
                  <textarea
                    rows={3}
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="What challenge does this project address?"
                    className="w-full px-3.5 py-2 bg-[#18181B] border border-white/10 rounded-lg text-sm text-[#FAFAFA] placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#10B981]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Architecture Overview Text
                  </label>
                  <textarea
                    rows={3}
                    value={architecture}
                    onChange={(e) => setArchitecture(e.target.value)}
                    placeholder="Summary of architectural choices and pipeline..."
                    className="w-full px-3.5 py-2 bg-[#18181B] border border-white/10 rounded-lg text-sm text-[#FAFAFA] placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#10B981]/50"
                  />
                </div>
              </div>

              {/* Links & Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2 bg-[#18181B] border border-white/10 rounded-lg text-xs text-[#FAFAFA] placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#10B981]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 bg-[#18181B] border border-white/10 rounded-lg text-xs text-[#FAFAFA] placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#10B981]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Thumbnail Image URL
                  </label>
                  <input
                    type="text"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="/thumbnails/project.webp"
                    className="w-full px-3.5 py-2 bg-[#18181B] border border-white/10 rounded-lg text-xs text-[#FAFAFA] placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#10B981]/50"
                  />
                </div>
              </div>

              {/* Settings row */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#18181B] border border-white/10">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured-toggle"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="size-4 accent-[#10B981] rounded cursor-pointer"
                  />
                  <label htmlFor="featured-toggle" className="text-xs font-medium text-[#FAFAFA] cursor-pointer">
                    Feature on Home Selected Work
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-muted-foreground">Display Order:</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
                    className="w-16 px-2 py-1 bg-[#121216] border border-white/10 rounded text-xs text-center text-[#FAFAFA]"
                  />
                </div>
              </div>

              {/* Tech Tags */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Tech Stack Tags
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {techTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 font-mono"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-400 cursor-pointer"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add tag (e.g. AWS Lambda, MQTT, Express) + press Enter"
                    className="flex-1 px-3.5 py-1.5 bg-[#18181B] border border-white/10 rounded-lg text-xs text-[#FAFAFA] placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#10B981]/50"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-[#FAFAFA] border border-white/10 cursor-pointer"
                  >
                    Add Tag
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FEATURES & METRICS */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              {/* Key Features List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Code className="size-3.5 text-[#10B981]" />
                    Key Architecture Code Features
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="text-xs text-[#10B981] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="size-3" /> Add Feature Code Block
                  </button>
                </div>

                <div className="space-y-3">
                  {keyFeatures.map((feat, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#18181B] border border-white/10 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={feat.title}
                          onChange={(e) => handleUpdateFeature(idx, 'title', e.target.value)}
                          placeholder="Feature Title (e.g. Structured LLM Inference Pipeline)"
                          className="flex-1 px-3 py-1.5 bg-[#121216] border border-white/10 rounded text-xs text-[#FAFAFA] font-medium"
                        />
                        <select
                          value={feat.language}
                          onChange={(e) => handleUpdateFeature(idx, 'language', e.target.value)}
                          className="px-2 py-1.5 bg-[#121216] border border-white/10 rounded text-xs text-muted-foreground font-mono"
                        >
                          <option value="typescript">TypeScript</option>
                          <option value="javascript">JavaScript</option>
                          <option value="python">Python</option>
                          <option value="cpp">C++</option>
                          <option value="bash">Bash / Shell</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="p-1.5 text-muted-foreground hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>

                      <textarea
                        rows={5}
                        value={feat.code}
                        onChange={(e) => handleUpdateFeature(idx, 'code', e.target.value)}
                        placeholder="// Enter key implementation snippet..."
                        className="w-full px-3 py-2 bg-[#0A0A0C] border border-white/10 rounded font-mono text-xs text-emerald-300 focus:outline-none"
                      />
                    </div>
                  ))}
                  {keyFeatures.length === 0 && (
                    <div className="p-4 text-center rounded-xl bg-[#18181B]/50 border border-dashed border-white/10 text-xs text-muted-foreground">
                      No code features added. Click "Add Feature Code Block" to highlight core snippets.
                    </div>
                  )}
                </div>
              </div>

              {/* Impact Metrics */}
              <div className="pt-4 border-t border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Impact Metrics & KPIs
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {impactMetrics.map(([k, v], idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#18181B] border border-white/10 text-xs font-mono"
                    >
                      <span className="text-muted-foreground">{k}:</span>
                      <span className="text-[#10B981] font-semibold">{v}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMetric(idx)}
                        className="hover:text-red-400 cursor-pointer"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newMetricKey}
                    onChange={(e) => setNewMetricKey(e.target.value)}
                    placeholder="Key (e.g. latency)"
                    className="w-1/3 px-3 py-1.5 bg-[#18181B] border border-white/10 rounded-lg text-xs text-[#FAFAFA]"
                  />
                  <input
                    type="text"
                    value={newMetricVal}
                    onChange={(e) => setNewMetricVal(e.target.value)}
                    placeholder="Value (e.g. <10ms)"
                    className="flex-1 px-3 py-1.5 bg-[#18181B] border border-white/10 rounded-lg text-xs text-[#FAFAFA]"
                  />
                  <button
                    type="button"
                    onClick={handleAddMetric}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-[#FAFAFA] border border-white/10 cursor-pointer"
                  >
                    Add KPI
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LIVE MERMAID DIAGRAM */}
          {activeTab === 'diagram' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#FAFAFA] flex items-center gap-2">
                    <span>Architecture Diagram Definition</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] font-mono">
                      Mermaid.js v12
                    </span>
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Must start with a valid Mermaid keyword (e.g. graph TD, flowchart LR, sequenceDiagram).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setArchitectureDiagram(
                        `graph TD\n  Client[React App] -->|HTTPS| Gateway[Express BFF]\n  Gateway --> DB[(MongoDB Cluster)]`
                      )
                    }
                    className="text-[10px] px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-[#FAFAFA] border border-white/10 cursor-pointer"
                  >
                    Preset: Graph TD
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setArchitectureDiagram(
                        `graph LR\n  ESP32[Device Sensor] -->|MQTT| IoT[AWS IoT Core]\n  IoT --> Lambda[Worker]\n  Lambda --> Dynamo[(DynamoDB)]`
                      )
                    }
                    className="text-[10px] px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-[#FAFAFA] border border-white/10 cursor-pointer"
                  >
                    Preset: Graph LR
                  </button>
                </div>
              </div>

              {/* Editor + Live Preview Split View */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Code Editor */}
                <div>
                  <div className="flex items-center justify-between pb-1.5 text-[11px] text-muted-foreground">
                    <span>Mermaid Syntax Editor</span>
                    <span className="text-[10px] text-[#10B981]">Updates preview in real-time</span>
                  </div>
                  <textarea
                    rows={12}
                    value={architectureDiagram}
                    onChange={(e) => setArchitectureDiagram(e.target.value)}
                    placeholder="graph TD&#10;  A --> B"
                    className="w-full h-72 p-3 bg-[#0A0A0C] border border-white/10 rounded-xl font-mono text-xs text-emerald-300 focus:outline-none focus:border-[#10B981]/50 resize-none"
                  />
                </div>

                {/* Live Diagram Preview */}
                <div>
                  <div className="flex items-center justify-between pb-1.5 text-[11px] text-muted-foreground">
                    <span>Live Interactive Visual Preview</span>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                      <CheckCircle2 className="size-3" /> Live Rendered
                    </span>
                  </div>
                  <div className="h-72 overflow-y-auto rounded-xl border border-white/10 bg-[#0A0A0C]/50 flex items-center justify-center p-2">
                    <DynamicDiagram chart={architectureDiagram} className="border-0 bg-transparent p-0" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Submit Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="text-xs text-muted-foreground">
              {activeTab === 'details' && 'Proceed to Features & Metrics or Diagram to complete configuration.'}
              {activeTab === 'features' && 'Next: verify or customize the Mermaid architecture diagram.'}
              {activeTab === 'diagram' && 'Review your live diagram before saving.'}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-[#FAFAFA] hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !slug.trim()}
                className="px-5 py-2 rounded-lg bg-[#10B981] hover:bg-[#10B981]/90 text-[#0A0A0C] font-semibold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-lg shadow-[#10B981]/20"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Saving Project...</span>
                  </>
                ) : (
                  <>
                    <Save className="size-3.5" />
                    <span>Save Project</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectEditorModal;
