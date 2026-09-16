import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { FALLBACK_CONTENT_BLOCKS } from '../data/fallback/contentBlocks.fallback';

export function useContent(key: string) {
  return useQuery<string>({
    queryKey: ['content', key],
    queryFn: async () => {
      try {
        const response = await api.get(`/api/content/${key}`);
        if (response.data && typeof response.data.value === 'string') {
          return response.data.value;
        }
        if (typeof response.data === 'string') {
          return response.data;
        }
        return FALLBACK_CONTENT_BLOCKS[key] ?? '';
      } catch {
        return FALLBACK_CONTENT_BLOCKS[key] ?? '';
      }
    },
    initialData: FALLBACK_CONTENT_BLOCKS[key] ?? '',
    staleTime: 1000 * 60 * 10,
  });
}

export function useAllContent() {
  return useQuery<Record<string, string>>({
    queryKey: ['content-all'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/content');
        if (response.data && typeof response.data === 'object') {
          return { ...FALLBACK_CONTENT_BLOCKS, ...response.data };
        }
        return FALLBACK_CONTENT_BLOCKS;
      } catch {
        return FALLBACK_CONTENT_BLOCKS;
      }
    },
    initialData: FALLBACK_CONTENT_BLOCKS,
    staleTime: 1000 * 60 * 10,
  });
}
