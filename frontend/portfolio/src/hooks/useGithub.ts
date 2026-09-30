import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { FALLBACK_GITHUB_DATA } from '../data/fallback/github.fallback';
import type { GithubData } from '../types';

export function useGithub() {
  return useQuery<GithubData>({
    queryKey: ['github-stats'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/api/github/commits');
        if (data && (Array.isArray(data.commits) || Array.isArray(data.activities))) {
          return {
            username: data.username || FALLBACK_GITHUB_DATA.username,
            profileUrl: data.profileUrl || FALLBACK_GITHUB_DATA.profileUrl,
            commits: Array.isArray(data.commits) && data.commits.length > 0
              ? data.commits
              : FALLBACK_GITHUB_DATA.commits,
            activities: Array.isArray(data.activities) && data.activities.length > 0
              ? data.activities
              : FALLBACK_GITHUB_DATA.activities,
          };
        }
        return FALLBACK_GITHUB_DATA;
      } catch {
        return FALLBACK_GITHUB_DATA;
      }
    },
    initialData: FALLBACK_GITHUB_DATA,
    initialDataUpdatedAt: 0,
    staleTime: 1000 * 60 * 10,
  });
}
