import { ENV } from '../config/env.js';
import cacheManager from '../utils/CacheManager.js';
import DataProcessor from '../utils/DataProcessor.js';
import { SEED_SPOTIFY_DATA } from '../utils/seedData.js';
import Logger from '../utils/Logger.js';

export class SpotifyService {
  static API_BASE = 'https://api.spotify.com/v1';
  static TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
  static CACHE_KEY_NOW_PLAYING = 'spotify:now-playing';
  static CACHE_KEY_TOP_TRACKS = 'spotify:top-tracks';

  /**
   * Obtains a fresh access token using the OAuth refresh token.
   * @returns {Promise<string|null>}
   */
  static async getAccessToken() {
    // If a direct token was also provided, allow fallback
    if (ENV.SPOTIFY_TOKEN) {
      return ENV.SPOTIFY_TOKEN;
    }

    if (!ENV.SPOTIFY_CLIENT_ID || !ENV.SPOTIFY_CLIENT_SECRET || !ENV.SPOTIFY_REFRESH_TOKEN) {
      return null;
    }

    try {
      const credentials = Buffer.from(`${ENV.SPOTIFY_CLIENT_ID}:${ENV.SPOTIFY_CLIENT_SECRET}`).toString('base64');
      const res = await fetch(SpotifyService.TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${credentials}`,
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: ENV.SPOTIFY_REFRESH_TOKEN,
        }),
      });

      const data = await res.json();
      if (!data.access_token) {
        Logger.warn(`[SpotifyService] Token refresh returned no access_token: ${JSON.stringify(data)}`);
        return null;
      }

      return data.access_token;
    } catch (err) {
      Logger.warn(`[SpotifyService] Token refresh failed: ${err.message}`);
      return null;
    }
  }

  /**
   * Internal authenticated fetcher for Spotify endpoints.
   * @param {string} endpoint
   * @param {string} token
   * @returns {Promise<any>}
   */
  static async #fetchSpotify(endpoint, token) {
    if (!token) return null;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    try {
      const res = await fetch(`${SpotifyService.API_BASE}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.status === 204) return null; // No Content (playback inactive)
      if (!res.ok) {
        throw new Error(`Spotify request failed (${res.status}): ${res.statusText}`);
      }

      return await res.json();
    } catch (err) {
      clearTimeout(timeout);
      throw err;
    }
  }

  /**
   * Retrieves live playback and top tracks adhering to frontend schema.
   * Cached for 15s to support fast frontend polling without hitting rate limits.
   * @returns {Promise<object>} SpotifyData
   */
  static async getNowPlaying() {
    const cached = await cacheManager.get(SpotifyService.CACHE_KEY_NOW_PLAYING);
    if (cached) {
      return cached;
    }

    // Check if credentials exist
    const hasCredentials =
      Boolean(ENV.SPOTIFY_TOKEN) ||
      Boolean(ENV.SPOTIFY_CLIENT_ID && ENV.SPOTIFY_CLIENT_SECRET && ENV.SPOTIFY_REFRESH_TOKEN);

    if (!hasCredentials) {
      await cacheManager.set(SpotifyService.CACHE_KEY_NOW_PLAYING, SEED_SPOTIFY_DATA, ENV.TTL.SPOTIFY_NOW_PLAYING);
      return SEED_SPOTIFY_DATA;
    }

    try {
      const token = await SpotifyService.getAccessToken();
      if (!token) {
        return SEED_SPOTIFY_DATA;
      }

      // Fetch currently playing and top tracks concurrently
      const [nowPlayingRaw, topTracks] = await Promise.all([
        SpotifyService.#fetchSpotify('/me/player/currently-playing', token).catch((err) => {
          Logger.warn(`[SpotifyService] Currently playing fetch failed: ${err.message}`);
          return null;
        }),
        SpotifyService.getTopTracks(token).catch(() => SEED_SPOTIFY_DATA.topTracks),
      ]);

      const processedNowPlaying = DataProcessor.processSpotifyNowPlaying(nowPlayingRaw);
      const result = {
        isPlaying: processedNowPlaying.isPlaying,
        nowPlaying: processedNowPlaying.nowPlaying,
        topTracks: Array.isArray(topTracks) && topTracks.length > 0 ? topTracks : SEED_SPOTIFY_DATA.topTracks,
      };

      await cacheManager.set(SpotifyService.CACHE_KEY_NOW_PLAYING, result, ENV.TTL.SPOTIFY_NOW_PLAYING);
      return result;
    } catch (err) {
      Logger.warn(`[SpotifyService] Playback query failed: ${err.message}. Serving fallback.`);
      return SEED_SPOTIFY_DATA;
    }
  }

  /**
   * Retrieves top listening tracks, cached for 24 hours.
   * @param {string} [existingToken]
   * @returns {Promise<Array<object>>} SpotifyTrack[]
   */
  static async getTopTracks(existingToken) {
    const cached = await cacheManager.get(SpotifyService.CACHE_KEY_TOP_TRACKS);
    if (cached) {
      return cached;
    }

    const token = existingToken || (await SpotifyService.getAccessToken());
    if (!token) {
      return SEED_SPOTIFY_DATA.topTracks;
    }

    try {
      const raw = await SpotifyService.#fetchSpotify('/me/top/tracks?limit=10&time_range=short_term', token);
      const processed = DataProcessor.processSpotifyTopTracks(raw?.items);

      await cacheManager.set(SpotifyService.CACHE_KEY_TOP_TRACKS, processed, ENV.TTL.SPOTIFY_TOP_TRACKS);
      return processed;
    } catch (err) {
      Logger.warn(`[SpotifyService] Failed to fetch top tracks: ${err.message}. Serving fallback.`);
      return SEED_SPOTIFY_DATA.topTracks;
    }
  }

  /**
   * Forces refresh of top tracks and now playing from Spotify Web API.
   * @returns {Promise<object>} Refreshed SpotifyData
   */
  static async sync() {
    Logger.info('[SpotifyService] Syncing Spotify playback and top tracks...');
    await cacheManager.delete(SpotifyService.CACHE_KEY_NOW_PLAYING);
    await cacheManager.delete(SpotifyService.CACHE_KEY_TOP_TRACKS);

    return SpotifyService.getNowPlaying();
  }
}

export default SpotifyService;
