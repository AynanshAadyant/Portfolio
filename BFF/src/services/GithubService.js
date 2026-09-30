import { ENV } from '../config/env.js';
import cacheManager from '../utils/CacheManager.js';
import { SEED_GITHUB_STATS } from '../utils/seedData.js';
import Logger from '../utils/Logger.js';

export class GithubService {
  static API_ENDPOINT = 'https://api.github.com';
  static CACHE_KEY = 'github:stats';

  /**
   * Retrieves cached GitHub stats/commits. If missing from cache, attempts background refresh
   * or returns seed stats gracefully.
   * @returns {Promise<object>}
   */
  static async getCachedStats() {
    const cached = await cacheManager.get(GithubService.CACHE_KEY);
    if (cached) {
      return cached;
    }

    // Try fetching if username is configured
    if (ENV.GITHUB_USERNAME) {
      try {
        return await GithubService.sync();
      } catch (err) {
        Logger.warn(`[GithubService] Sync on demand failed: ${err.message}. Serving seed data.`);
      }
    }

    await cacheManager.set(GithubService.CACHE_KEY, SEED_GITHUB_STATS, ENV.TTL.GITHUB);
    return SEED_GITHUB_STATS;
  }

  /**
   * Forces a refresh of GitHub stats/commits and updates cache.
   * @returns {Promise<object>}
   */
  static async sync() {
    const username = ENV.GITHUB_USERNAME;
    const activity_URL = `${GithubService.API_ENDPOINT}/users/${username}/events`;

    if (!username) {
      Logger.warn('[GithubService] GITHUB_USERNAME is not set in environment. Using seed stats.');
      await cacheManager.set(GithubService.CACHE_KEY, SEED_GITHUB_STATS, ENV.TTL.GITHUB);
      return SEED_GITHUB_STATS;
    }

    Logger.info(`[GithubService] Fetching api data for user: ${username}`);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    try {
      const getHeaders = (token) => {
        const h = {
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'Portfolio-BFF',
        };
        if (token) {
          h.Authorization = `Bearer ${token}`;
        }
        return h;
      };

      let headers = getHeaders(ENV.GITHUB_TOKEN);

      // 1. Fetch user's activity events
      let activityRes = await fetch(activity_URL, {
        method: 'GET',
        headers,
        signal: controller.signal,
      });

      // If token is invalid/expired (401), fallback to unauthenticated request
      if (activityRes.status === 401 && ENV.GITHUB_TOKEN) {
        Logger.warn('[GithubService] Provided GITHUB_TOKEN unauthorized (401), retrying unauthenticated.');
        headers = getHeaders(null);
        activityRes = await fetch(activity_URL, {
          method: 'GET',
          headers,
          signal: controller.signal,
        });
      }

      clearTimeout(timeout);

      if (!activityRes.ok) {
        throw new Error(`Github API returned HTTP ${activityRes.status}`);
      }

      const events = await activityRes.json();
      if (!Array.isArray(events)) {
        throw new Error('Github events response is not an array');
      }

      // Extract unique repos from activity events
      const repoMap = new Map();
      for (const activity of events) {
        if (activity?.repo?.name) {
          if (!repoMap.has(activity.repo.name)) {
            repoMap.set(activity.repo.name, activity.repo);
          }
        }
      }

      // Limit to 4 unique repositories to avoid API rate limiting
      const uniqueRepos = Array.from(repoMap.values()).slice(0, 4);

      const commitsPerRepo = await Promise.all(
        uniqueRepos.map(async (repo) => {
          try {
            const repoFullName = repo.name.includes('/') ? repo.name : `${username}/${repo.name}`;
            const commitRes = await fetch(
              `${GithubService.API_ENDPOINT}/repos/${repoFullName}/commits?per_page=5`,
              { headers }
            );

            if (!commitRes.ok) {
              return {
                repo: repo.name,
                repoUrl: repo.html_url || `https://github.com/${repoFullName}`,
                commits: [],
              };
            }

            const commitData = await commitRes.json();
            const commitList = Array.isArray(commitData) ? commitData : [];

            return {
              repo: repo.name,
              repoUrl: repo.html_url || `https://github.com/${repoFullName}`,
              commits: commitList.map((commit) => ({
                sha: commit.sha ? commit.sha.substring(0, 7) : '',
                message: commit.commit?.message?.split('\n')[0] || 'Commit',
                author: commit.commit?.author?.name || username,
                date: commit.commit?.author?.date || new Date().toISOString(),
                url: commit.html_url || `https://github.com/${repoFullName}/commit/${commit.sha}`,
                repo: repo.name,
                repoUrl: repo.html_url || `https://github.com/${repoFullName}`,
              })),
            };
          } catch {
            return {
              repo: repo.name,
              repoUrl: repo.html_url || `https://github.com/${repo.name}`,
              commits: [],
            };
          }
        })
      );

      const allCommits = commitsPerRepo.flatMap((r) => r.commits);
      allCommits.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const latestFive = allCommits.slice(0, 5);

      const finalCommits = latestFive.length > 0 ? latestFive : SEED_GITHUB_STATS.commits;

      const result = {
        username,
        profileUrl: `https://github.com/${username}`,
        commits: finalCommits,
        activities: finalCommits.map((c) => ({
          message: c.message,
          repo: c.repo,
          url: c.url,
          sha: c.sha,
          date: c.date,
        })),
      };

      await cacheManager.set(GithubService.CACHE_KEY, result, ENV.TTL.GITHUB);
      return result;
    } catch (err) {
      clearTimeout(timeout);
      Logger.error(`[GithubService] Fetch failed: ${err.message}`);
      const fallback = (await cacheManager.get(GithubService.CACHE_KEY)) || SEED_GITHUB_STATS;
      return fallback;
    }
  }
}

export default GithubService;
