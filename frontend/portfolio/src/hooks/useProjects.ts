import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { FALLBACK_PROJECTS } from '../data/fallback/projects.fallback';
import type { ProjectDocument } from '../types';

export function useProjects() {
  return useQuery<ProjectDocument[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/api/projects');
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
        return FALLBACK_PROJECTS;
      } catch {
        return FALLBACK_PROJECTS;
      }
    },
    initialData: FALLBACK_PROJECTS,
    initialDataUpdatedAt: 0,
    staleTime: 1000 * 60 * 5,
  });
}

export function useProject(slug: string) {
  return useQuery<ProjectDocument | undefined>({
    queryKey: ['project', slug],
    queryFn: async () => {
      try {
        const { data } = await api.get(`/api/projects/${slug}`);
        if (data && data.slug === slug) {
          return data;
        }
        return FALLBACK_PROJECTS.find((p) => p.slug === slug);
      } catch {
        return FALLBACK_PROJECTS.find((p) => p.slug === slug);
      }
    },
    initialData: FALLBACK_PROJECTS.find((p) => p.slug === slug),
    initialDataUpdatedAt: 0,
    staleTime: 1000 * 60 * 5,
  });
}
