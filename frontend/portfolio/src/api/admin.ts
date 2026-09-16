import { api } from './client';
import type { ProjectDocument } from '../types';

export interface AdminContentDoc {
  _id?: string;
  key: string;
  value: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminHealthData {
  status: string;
  uptime: string;
  timestamp: string;
  database: {
    status: string;
    host: string;
    name: string;
  };
  memory: {
    heapUsedMb: number;
    heapTotalMb: number;
    rssMb: number;
  };
  integrations: {
    spotifyConfigured: boolean;
    leetcodeConfigured: boolean;
  };
}

export interface AdminCacheStatus {
  memoryEntriesCount: number;
  memoryKeys: string[];
  dbEntriesCount: number;
  dbKeys: { key: string; updatedAt: string; expiresAt: string | null }[];
}

export const adminApi = {
  // Auth
  async login(password: string) {
    const { data } = await api.post<{ success: boolean; token: string; expiresIn: number }>(
      '/api/auth/login',
      { password }
    );
    return data;
  },

  async logout() {
    const { data } = await api.post<{ success: boolean; message: string }>('/api/auth/logout');
    return data;
  },

  async getMe() {
    const { data } = await api.get<{ success: boolean; authenticated: boolean }>('/api/auth/me');
    return data;
  },

  // Content Blocks CMS
  async getContentList() {
    const { data } = await api.get<AdminContentDoc[]>('/api/admin/content');
    return data;
  },

  async saveContent(key: string, value: string) {
    const { data } = await api.post<{ success: boolean; key: string; value: string }>(
      '/api/admin/content',
      { key, value }
    );
    return data;
  },

  async deleteContent(key: string) {
    const { data } = await api.delete<{ success: boolean; deletedKey: string }>(
      `/api/admin/content/${encodeURIComponent(key)}`
    );
    return data;
  },

  async bulkSaveContent(contentMap: Record<string, string>) {
    const { data } = await api.post<{ success: boolean; count: number }>(
      '/api/admin/content/bulk',
      contentMap
    );
    return data;
  },

  // Projects CMS
  async getProjectsList() {
    const { data } = await api.get<ProjectDocument[]>('/api/admin/projects');
    return data;
  },

  async createProject(project: Partial<ProjectDocument>) {
    const { data } = await api.post<ProjectDocument>('/api/admin/projects', project);
    return data;
  },

  async updateProject(slug: string, project: Partial<ProjectDocument>) {
    const { data } = await api.put<ProjectDocument>(`/api/admin/projects/${slug}`, project);
    return data;
  },

  async deleteProject(slug: string) {
    const { data } = await api.delete<{ success: boolean; deletedSlug: string }>(
      `/api/admin/projects/${slug}`
    );
    return data;
  },

  async reorderProjects(orderList: { slug: string; display_order: number }[]) {
    const { data } = await api.patch<{ success: boolean; updatedCount: number }>(
      '/api/admin/projects/reorder',
      orderList
    );
    return data;
  },

  // Cache & Telemetry
  async getCacheStatus() {
    const { data } = await api.get<AdminCacheStatus>('/api/admin/cache/status');
    return data;
  },

  async clearCache() {
    const { data } = await api.post<{ success: boolean; message: string }>('/api/admin/cache/clear');
    return data;
  },

  async seedDatabase(force: boolean = false) {
    const { data } = await api.post<{
      success: boolean;
      seeded: { contentBlocks: number; projects: number };
      message: string;
    }>('/api/admin/cache/seed', { force });
    return data;
  },

  async syncLeetCode() {
    const { data } = await api.post('/api/admin/sync/leetcode');
    return data;
  },

  async syncSpotify() {
    const { data } = await api.post('/api/admin/sync/spotify');
    return data;
  },

  // System Diagnostics
  async getHealth() {
    const { data } = await api.get<AdminHealthData>('/api/admin/system/health');
    return data;
  },
};

export default adminApi;
