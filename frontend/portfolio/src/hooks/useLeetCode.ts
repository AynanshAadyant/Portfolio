import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { FALLBACK_LEETCODE_STATS } from '../data/fallback/leetcode.fallback';
import type { LeetCodeStats } from '../types';

export function useLeetCode() {
  return useQuery<LeetCodeStats>({
    queryKey: ['leetcode-stats'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/api/leetcode/stats');
        if (data && typeof data.totalSolved === 'number') {
          return data;
        }
        return FALLBACK_LEETCODE_STATS;
      } catch {
        return FALLBACK_LEETCODE_STATS;
      }
    },
    initialData: FALLBACK_LEETCODE_STATS,
    initialDataUpdatedAt: 0,
    staleTime: 1000 * 60 * 5,
  });
}
