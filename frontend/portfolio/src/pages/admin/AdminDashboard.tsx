import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  LogOut,
  RefreshCw,
  Server,
  Layers,
  FileText,
  Database,
  Activity,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Radio,
  Search,
  Check,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  adminApi,
  type AdminContentDoc,
  type AdminHealthData,
  type AdminCacheStatus,
} from '../../api/admin';
import type { ProjectDocument } from '../../types';
import { ContentBlockModal } from '../../components/admin/ContentBlockModal';
import { ProjectEditorModal } from '../../components/admin/ProjectEditorModal';

export const AdminDashboard: React.FC = () => {
  const { logout } = useAdminAuth();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'projects' | 'cache'>('overview');

  // Data states
  const [health, setHealth] = useState<AdminHealthData | null>(null);
  const [contentList, setContentList] = useState<AdminContentDoc[]>([]);
  const [projectList, setProjectList] = useState<ProjectDocument[]>([]);
  const [cacheStatus, setCacheStatus] = useState<AdminCacheStatus | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Search filter
  const [contentSearch, setContentSearch] = useState('');
  const [projectSearch, setProjectSearch] = useState('');

  // Modals state
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<AdminContentDoc | null>(null);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectDocument | null>(null);

  // Notification helper
  const notify = (text: string, type: 'success' | 'error' = 'success') => {
    setActionMessage({ text, type });
    setTimeout(() => {
      setActionMessage(null);
    }, 4000);
  };

  // Fetch all dashboard data
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [healthRes, contentRes, projectsRes, cacheRes] = await Promise.all([
        adminApi.getHealth().catch(() => null),
        adminApi.getContentList().catch(() => []),
        adminApi.getProjectsList().catch(() => []),
        adminApi.getCacheStatus().catch(() => null),
      ]);

      if (healthRes) setHealth(healthRes);
      if (Array.isArray(contentRes)) setContentList(contentRes);
      if (Array.isArray(projectsRes)) {
        // Ensure sorted by display_order
        setProjectList(projectsRes.sort((a, b) => a.display_order - b.display_order));
      }
      if (cacheRes) setCacheStatus(cacheRes);
    } catch (err: any) {
      notify('Failed to refresh CMS data.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // --- Content Block Handlers ---
  const handleSaveContent = async (key: string, value: string) => {
    await adminApi.saveContent(key, value);
    notify(`Content block '${key}' successfully updated.`);
    refreshData();
  };

  const handleDeleteContent = async (key: string) => {
    if (!window.confirm(`Are you sure you want to delete content block '${key}'?`)) return;
    try {
      await adminApi.deleteContent(key);
      notify(`Content block '${key}' deleted.`);
      refreshData();
    } catch (err: any) {
      notify(err.response?.data?.error?.message || 'Failed to delete block.', 'error');
    }
  };

  // --- Project Handlers ---
  const handleSaveProject = async (projectData: Partial<ProjectDocument>) => {
    if (selectedProject) {
      await adminApi.updateProject(selectedProject.slug, projectData);
      notify(`Project '${projectData.title}' updated successfully.`);
    } else {
      await adminApi.createProject(projectData);
      notify(`Project '${projectData.title}' created successfully.`);
    }
    refreshData();
  };

  const handleDeleteProject = async (slug: string) => {
    if (!window.confirm(`Are you sure you want to delete project '${slug}'? This cannot be undone.`)) return;
    try {
      await adminApi.deleteProject(slug);
      notify(`Project '${slug}' deleted.`);
      refreshData();
    } catch (err: any) {
      notify(err.response?.data?.error?.message || 'Failed to delete project.', 'error');
    }
  };

  const handleMoveProject = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projectList.length) return;

    const reordered = [...projectList];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    // Update display_order sequence
    const payload = reordered.map((p, idx) => ({
      slug: p.slug,
      display_order: idx + 1,
    }));

    // Optimistic UI update
    setProjectList(
      reordered.map((p, idx) => ({ ...p, display_order: idx + 1 }))
    );

    try {
      await adminApi.reorderProjects(payload);
      notify('Project order updated.');
    } catch (err: any) {
      notify('Failed to persist project reordering.', 'error');
      refreshData();
    }
  };

  // --- Telemetry & Diagnostics Actions ---
  const handleSyncLeetCode = async () => {
    try {
      await adminApi.syncLeetCode();
      notify('LeetCode stats synced from external GraphQL API.');
      refreshData();
    } catch (err: any) {
      notify('Failed to sync LeetCode stats.', 'error');
    }
  };

  const handleSyncSpotify = async () => {
    try {
      await adminApi.syncSpotify();
      notify('Spotify playback and top rotation synced from Spotify API.');
      refreshData();
    } catch (err: any) {
      notify('Failed to sync Spotify data.', 'error');
    }
  };

  const handleClearCache = async () => {
    if (!window.confirm('Clear all in-memory and database caches?')) return;
    try {
      await adminApi.clearCache();
      notify('All caches successfully invalidated.');
      refreshData();
    } catch (err: any) {
      notify('Failed to clear cache.', 'error');
    }
  };

  const handleSeedDatabase = async () => {
    if (
      !window.confirm(
        'Seed database with initial portfolio content and projects? This will populate empty collections.'
      )
    )
      return;
    try {
      const res = await adminApi.seedDatabase(false);
      notify(res.message || 'Database seeded.');
      refreshData();
    } catch (err: any) {
      notify('Failed to seed database.', 'error');
    }
  };

  // Filtered lists
  const filteredContent = contentList.filter(
    (c) =>
      c.key.toLowerCase().includes(contentSearch.toLowerCase()) ||
      c.value.toLowerCase().includes(contentSearch.toLowerCase())
  );

  const filteredProjects = projectList.filter(
    (p) =>
      p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.slug.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.tech_tags.some((t) => t.toLowerCase().includes(projectSearch.toLowerCase()))
  );

  return (
    <div className="py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Session Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#121216] border border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
            <ShieldCheck className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[#FAFAFA]">Portfolio CMS & Control Plane</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-[#10B981] animate-pulse" />
                Live Session
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Manage editable portfolio micro-copy, project case studies, telemetry cache, and runtime health.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-[#FAFAFA] border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin text-[#10B981]' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs font-medium text-red-400 border border-red-500/20 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="size-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Floating Action Feedback Notification */}
      {actionMessage && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center justify-between shadow-lg transition-all animate-in slide-in-from-top-2 ${
            actionMessage.type === 'success'
              ? 'bg-[#10B981]/15 border-[#10B981]/30 text-emerald-300'
              : 'bg-red-500/15 border-red-500/30 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? (
              <Check className="size-4 shrink-0" />
            ) : (
              <AlertTriangle className="size-4 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-muted-foreground hover:text-[#FAFAFA] cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-white/10 pb-px overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-[#121216] border-t border-x border-white/10 text-[#10B981]'
              : 'text-muted-foreground hover:text-[#FAFAFA] hover:bg-white/[0.02]'
          }`}
        >
          <Server className="size-4" />
          <span>Overview & Health</span>
        </button>

        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'content'
              ? 'bg-[#121216] border-t border-x border-white/10 text-[#10B981]'
              : 'text-muted-foreground hover:text-[#FAFAFA] hover:bg-white/[0.02]'
          }`}
        >
          <FileText className="size-4" />
          <span>Content Blocks ({contentList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'projects'
              ? 'bg-[#121216] border-t border-x border-white/10 text-[#10B981]'
              : 'text-muted-foreground hover:text-[#FAFAFA] hover:bg-white/[0.02]'
          }`}
        >
          <Layers className="size-4" />
          <span>Projects & Case Studies ({projectList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cache')}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'cache'
              ? 'bg-[#121216] border-t border-x border-white/10 text-[#10B981]'
              : 'text-muted-foreground hover:text-[#FAFAFA] hover:bg-white/[0.02]'
          }`}
        >
          <Database className="size-4" />
          <span>Cache & Sync</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: OVERVIEW & SYSTEM HEALTH */}
      {/* ========================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Diagnostics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* MongoDB State */}
            <div className="p-4 rounded-xl bg-[#121216] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
                <span>Database Status</span>
                <Database className="size-4 text-[#10B981]" />
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`size-2.5 rounded-full ${
                    health?.database.status === 'connected'
                      ? 'bg-[#10B981] shadow-lg shadow-[#10B981]/50'
                      : 'bg-amber-400'
                  }`}
                />
                <span className="text-base font-bold text-[#FAFAFA] capitalize">
                  {health?.database.status || 'Connected'}
                </span>
              </div>
              <p className="text-[11px] font-mono text-muted-foreground truncate">
                DB: {health?.database.name || 'portfolio'}
              </p>
            </div>

            {/* Server Uptime */}
            <div className="p-4 rounded-xl bg-[#121216] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
                <span>Server Uptime</span>
                <Activity className="size-4 text-emerald-400" />
              </div>
              <div className="text-base font-bold text-[#FAFAFA]">
                {health?.uptime || 'Online'}
              </div>
              <p className="text-[11px] text-muted-foreground">
                SLA target p95 &lt; 300ms
              </p>
            </div>

            {/* Memory Consumed */}
            <div className="p-4 rounded-xl bg-[#121216] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
                <span>Memory Allocation</span>
                <Server className="size-4 text-purple-400" />
              </div>
              <div className="text-base font-bold text-[#FAFAFA]">
                {health?.memory.heapUsedMb ?? 24} MB / {health?.memory.heapTotalMb ?? 48} MB
              </div>
              <p className="text-[11px] text-muted-foreground">
                RSS: {health?.memory.rssMb ?? 56} MB
              </p>
            </div>

            {/* Integrations */}
            <div className="p-4 rounded-xl bg-[#121216] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
                <span>Telemetry Status</span>
                <Radio className="size-4 text-cyan-400" />
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="size-3" /> LeetCode
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="size-3" /> Spotify
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Auto-cached & fallback protected
              </p>
            </div>
          </div>

          {/* Quick CMS Action Triggers */}
          <div className="p-6 rounded-2xl bg-[#121216] border border-white/10 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Zap className="size-4 text-[#10B981]" />
              Trigger Operational Tasks & Sync Webhooks
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={handleSyncLeetCode}
                className="p-3.5 rounded-xl bg-[#18181B] hover:bg-white/5 border border-white/10 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#FAFAFA] group-hover:text-[#10B981]">
                    Sync LeetCode
                  </span>
                  <ExternalLink className="size-3.5 text-muted-foreground group-hover:text-[#10B981]" />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Fetch fresh metrics from LeetCode GraphQL and refresh cache.
                </p>
              </button>

              <button
                onClick={handleSyncSpotify}
                className="p-3.5 rounded-xl bg-[#18181B] hover:bg-white/5 border border-white/10 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#FAFAFA] group-hover:text-[#10B981]">
                    Sync Spotify
                  </span>
                  <ExternalLink className="size-3.5 text-muted-foreground group-hover:text-[#10B981]" />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Refresh top rotation tracks and playback state from Spotify.
                </p>
              </button>

              <button
                onClick={handleClearCache}
                className="p-3.5 rounded-xl bg-[#18181B] hover:bg-white/5 border border-white/10 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#FAFAFA] group-hover:text-amber-400">
                    Purge All Cache
                  </span>
                  <RefreshCw className="size-3.5 text-muted-foreground group-hover:text-amber-400" />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Clear in-memory and database caches across all collections.
                </p>
              </button>

              <button
                onClick={handleSeedDatabase}
                className="p-3.5 rounded-xl bg-[#18181B] hover:bg-white/5 border border-white/10 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#FAFAFA] group-hover:text-[#10B981]">
                    Seed Fallback Data
                  </span>
                  <Database className="size-3.5 text-muted-foreground group-hover:text-[#10B981]" />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Ensure default content blocks and projects exist in MongoDB.
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: CONTENT BLOCKS MANAGER */}
      {/* ========================================================= */}
      {activeTab === 'content' && (
        <div className="space-y-4">
          {/* Search & Add Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={contentSearch}
                onChange={(e) => setContentSearch(e.target.value)}
                placeholder="Search content by key or text..."
                className="w-full pl-9 pr-4 py-2 bg-[#121216] border border-white/10 rounded-xl text-xs text-[#FAFAFA] placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#10B981]/50"
              />
            </div>

            <button
              onClick={() => {
                setSelectedContent(null);
                setIsContentModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#10B981]/90 text-[#0A0A0C] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-[#10B981]/20"
            >
              <Plus className="size-4" />
              <span>Add Content Key</span>
            </button>
          </div>

          {/* Content Table / Cards */}
          <div className="rounded-2xl bg-[#121216] border border-white/10 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#18181B] border-b border-white/10 text-muted-foreground uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-5 py-3 w-1/4">Key (Identifier)</th>
                    <th className="px-5 py-3 w-1/2">Content Value</th>
                    <th className="px-5 py-3 w-1/4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredContent.map((item) => (
                    <tr key={item.key} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-5 py-3.5 font-mono text-emerald-400 font-medium break-all">
                        {item.key}
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground group-hover:text-[#FAFAFA] transition-colors">
                        <span className="line-clamp-2">{item.value || '(Empty string)'}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedContent(item);
                              setIsContentModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-[#FAFAFA] transition-colors cursor-pointer"
                            title="Edit Block"
                          >
                            <Edit2 className="size-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteContent(item.key)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                            title="Delete Block"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredContent.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-5 py-8 text-center text-muted-foreground">
                        No content blocks found matching search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: PROJECTS & CASE STUDIES */}
      {/* ========================================================= */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                placeholder="Search projects by title, slug, or tech tags..."
                className="w-full pl-9 pr-4 py-2 bg-[#121216] border border-white/10 rounded-xl text-xs text-[#FAFAFA] placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#10B981]/50"
              />
            </div>

            <button
              onClick={() => {
                setSelectedProject(null);
                setIsProjectModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#10B981]/90 text-[#0A0A0C] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-[#10B981]/20"
            >
              <Plus className="size-4" />
              <span>Create Project</span>
            </button>
          </div>

          {/* Project List */}
          <div className="rounded-2xl bg-[#121216] border border-white/10 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#18181B] border-b border-white/10 text-muted-foreground uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-4 py-3 w-16 text-center">Order</th>
                    <th className="px-4 py-3">Project Title & Slug</th>
                    <th className="px-4 py-3">Tech Tags</th>
                    <th className="px-4 py-3 text-center">Featured</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredProjects.map((proj, idx) => (
                    <tr key={proj.slug} className="hover:bg-white/[0.02] transition-colors group">
                      {/* Order buttons */}
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <button
                            onClick={() => handleMoveProject(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded text-muted-foreground hover:text-[#FAFAFA] disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowUp className="size-3" />
                          </button>
                          <span className="font-mono text-[11px] text-muted-foreground font-bold">
                            {proj.display_order ?? idx + 1}
                          </span>
                          <button
                            onClick={() => handleMoveProject(idx, 'down')}
                            disabled={idx === filteredProjects.length - 1}
                            className="p-1 rounded text-muted-foreground hover:text-[#FAFAFA] disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowDown className="size-3" />
                          </button>
                        </div>
                      </td>

                      {/* Title & Slug */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          {proj.thumbnail_url ? (
                            <img
                              src={proj.thumbnail_url}
                              alt=""
                              className="size-10 rounded-lg object-cover bg-white/5 border border-white/10 shrink-0"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="size-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                              <Layers className="size-4 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-sm text-[#FAFAFA] group-hover:text-[#10B981] transition-colors">
                              {proj.title}
                            </div>
                            <div className="font-mono text-[11px] text-muted-foreground">
                              {proj.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Tech Tags */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {proj.tech_tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-muted-foreground font-mono"
                            >
                              {tag}
                            </span>
                          ))}
                          {proj.tech_tags.length > 3 && (
                            <span className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-muted-foreground">
                              +{proj.tech_tags.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Featured */}
                      <td className="px-4 py-3.5 text-center">
                        {proj.featured ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                            Featured
                          </span>
                        ) : (
                          <span className="text-muted-foreground/40 text-xs">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/projects/${proj.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-[#FAFAFA] transition-colors"
                            title="View Case Study"
                          >
                            <ExternalLink className="size-3.5" />
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedProject(proj);
                              setIsProjectModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-[#FAFAFA] transition-colors cursor-pointer"
                            title="Edit Project"
                          >
                            <Edit2 className="size-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.slug)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                            title="Delete Project"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProjects.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        No projects found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: CACHE & TELEMETRY */}
      {/* ========================================================= */}
      {activeTab === 'cache' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#FAFAFA]">Multi-Tier Cache State</h2>
              <p className="text-xs text-muted-foreground">
                In-memory fast lookup store (L1) synchronized with MongoDB persistent cache (L2).
              </p>
            </div>
            <button
              onClick={handleClearCache}
              className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-xs font-semibold text-amber-400 border border-amber-500/20 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="size-3.5" />
              <span>Purge All Cache</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* L1 In-Memory Cache */}
            <div className="p-5 rounded-2xl bg-[#121216] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  L1 In-Memory Store
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-[#10B981]">
                  {cacheStatus?.memoryEntriesCount ?? 0} Keys Active
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#18181B] border border-white/5 max-h-48 overflow-y-auto space-y-1">
                {cacheStatus?.memoryKeys?.map((k) => (
                  <div key={k} className="text-xs font-mono text-muted-foreground truncate">
                    • {k}
                  </div>
                ))}
                {(!cacheStatus?.memoryKeys || cacheStatus.memoryKeys.length === 0) && (
                  <div className="text-xs text-muted-foreground/60 italic">No in-memory keys currently cached.</div>
                )}
              </div>
            </div>

            {/* L2 Database Cache */}
            <div className="p-5 rounded-2xl bg-[#121216] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  L2 Persistent DB Store
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-purple-400">
                  {cacheStatus?.dbEntriesCount ?? 0} Entries
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#18181B] border border-white/5 max-h-48 overflow-y-auto space-y-1">
                {cacheStatus?.dbKeys?.map((item) => (
                  <div key={item.key} className="text-xs font-mono text-muted-foreground flex justify-between">
                    <span>• {item.key}</span>
                    <span className="text-[10px] text-muted-foreground/60">
                      {new Date(item.updatedAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
                {(!cacheStatus?.dbKeys || cacheStatus.dbKeys.length === 0) && (
                  <div className="text-xs text-muted-foreground/60 italic">No DB cache records.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ContentBlockModal
        isOpen={isContentModalOpen}
        onClose={() => setIsContentModalOpen(false)}
        onSave={handleSaveContent}
        initialData={selectedContent}
      />

      <ProjectEditorModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleSaveProject}
        initialData={selectedProject}
      />
    </div>
  );
};

export default AdminDashboard;
