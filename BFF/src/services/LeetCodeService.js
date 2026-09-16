import { ENV } from '../config/env.js';
import cacheManager from '../utils/CacheManager.js';
import DataProcessor from '../utils/DataProcessor.js';
import { SEED_LEETCODE_STATS } from '../utils/seedData.js';
import Logger from '../utils/Logger.js';

export class LeetCodeService {
  static GRAPHQL_ENDPOINT = 'https://leetcode.com/graphql';
  static CACHE_KEY = 'leetcode:stats';

  static QUERY = `
    query userStats($username: String!) {
      matchedUser(username: $username) {
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
      recentSubmissionList(username: $username, limit: 10) {
        title
        timestamp
        statusDisplay
      }
    }
  `;

  /**
   * Retrieves cached LeetCode stats. If missing from cache, attempts background refresh
   * or returns seed stats gracefully.
   * @returns {Promise<object>} LeetCodeStats
   */
  static async getCachedStats() {
    const cached = await cacheManager.get(LeetCodeService.CACHE_KEY);
    if (cached) {
      return cached;
    }

    // Try fetching if username is configured
    if (ENV.LEETCODE_USERNAME) {
      try {
        return await LeetCodeService.sync();
      } catch (err) {
        Logger.warn(`[LeetCodeService] Sync on demand failed: ${err.message}. Serving seed data.`);
      }
    }

    await cacheManager.set(LeetCodeService.CACHE_KEY, SEED_LEETCODE_STATS, ENV.TTL.LEETCODE);
    return SEED_LEETCODE_STATS;
  }

  /**
   * Forces a refresh of LeetCode stats from GraphQL and updates cache.
   * @returns {Promise<object>}
   */
  static async sync() {
    const username = ENV.LEETCODE_USERNAME;
    if (!username) {
      Logger.warn('[LeetCodeService] LEETCODE_USERNAME is not set in environment. Using seed stats.');
      await cacheManager.set(LeetCodeService.CACHE_KEY, SEED_LEETCODE_STATS, ENV.TTL.LEETCODE);
      return SEED_LEETCODE_STATS;
    }

    Logger.info(`[LeetCodeService] Fetching GraphQL stats for user: ${username}`);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    try {
      const res = await fetch(LeetCodeService.GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Portfolio-BFF-Telemetry/1.0',
        },
        body: JSON.stringify({
          query: LeetCodeService.QUERY,
          variables: { username },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`LeetCode API returned HTTP ${res.status}`);
      }

      const body = await res.json();
      if (body.errors) {
        throw new Error(`LeetCode GraphQL error: ${JSON.stringify(body.errors)}`);
      }

      const processed = DataProcessor.processLeetCodeData(body.data);
      await cacheManager.set(LeetCodeService.CACHE_KEY, processed, ENV.TTL.LEETCODE);
      Logger.info('[LeetCodeService] Successfully synced LeetCode stats.');

      return processed;
    } catch (err) {
      clearTimeout(timeout);
      Logger.error(`[LeetCodeService] Fetch failed: ${err.message}`);
      // Return cached or seed if sync fails
      const fallback = (await cacheManager.get(LeetCodeService.CACHE_KEY)) || SEED_LEETCODE_STATS;
      return fallback;
    }
  }
}

export default LeetCodeService;
