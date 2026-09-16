import { SEED_LEETCODE_STATS, SEED_SPOTIFY_DATA } from './seedData.js';

export class DataProcessor {
  /**
   * Formats a unix timestamp (seconds or milliseconds) or ISO string to relative time.
   * @param {number|string} timestamp
   * @returns {string}
   */
  static formatRelativeTime(timestamp) {
    if (!timestamp) return 'recently';

    let timeMs = Number(timestamp);
    // If timestamp is in seconds (10 digits), convert to ms
    if (!isNaN(timeMs) && timeMs < 10000000000) {
      timeMs *= 1000;
    } else if (isNaN(timeMs)) {
      timeMs = new Date(timestamp).getTime();
    }

    if (isNaN(timeMs)) return String(timestamp);

    const diffMs = Date.now() - timeMs;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;

    return new Date(timeMs).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  /**
   * Processes raw LeetCode GraphQL payload into standardized LeetCodeStats.
   * @param {object} rawData
   * @returns {object} LeetCodeStats
   */
  static processLeetCodeData(rawData) {
    if (!rawData || !rawData.matchedUser) {
      return { ...SEED_LEETCODE_STATS };
    }

    const acSubmissionNum = rawData.matchedUser?.submitStatsGlobal?.acSubmissionNum || [];
    const getCount = (diff) => {
      const item = acSubmissionNum.find((i) => i.difficulty.toLowerCase() === diff.toLowerCase());
      return item ? Number(item.count) || 0 : 0;
    };

    const totalSolved = getCount('all') || getCount('All');
    const easySolved = getCount('easy') || getCount('Easy');
    const mediumSolved = getCount('medium') || getCount('Medium');
    const hardSolved = getCount('hard') || getCount('Hard');

    // Process recent submissions
    const recentSubmissionsRaw = rawData.recentSubmissionList || [];
    const recentSubmissions = recentSubmissionsRaw.slice(0, 5).map((sub) => {
      // Determine difficulty heuristic or default to Medium if not present in basic list
      const difficulty = sub.difficulty || 'Medium';
      return {
        title: sub.title,
        difficulty: ['Easy', 'Medium', 'Hard'].includes(difficulty) ? difficulty : 'Medium',
        timestamp: DataProcessor.formatRelativeTime(sub.timestamp),
      };
    });

    return {
      totalSolved: totalSolved || SEED_LEETCODE_STATS.totalSolved,
      easySolved: easySolved || SEED_LEETCODE_STATS.easySolved,
      mediumSolved: mediumSolved || SEED_LEETCODE_STATS.mediumSolved,
      hardSolved: hardSolved || SEED_LEETCODE_STATS.hardSolved,
      contestRating: rawData.contestRating || SEED_LEETCODE_STATS.contestRating,
      streakDays: rawData.streakDays || SEED_LEETCODE_STATS.streakDays,
      badges: Array.isArray(rawData.badges) && rawData.badges.length > 0 ? rawData.badges : SEED_LEETCODE_STATS.badges,
      recentSubmissions: recentSubmissions.length > 0 ? recentSubmissions : SEED_LEETCODE_STATS.recentSubmissions,
    };
  }

  /**
   * Processes Spotify currently-playing response.
   * @param {object|null} rawItem
   * @returns {{ isPlaying: boolean, nowPlaying: object|null }}
   */
  static processSpotifyNowPlaying(rawItem) {
    if (!rawItem || !rawItem.item) {
      return {
        isPlaying: false,
        nowPlaying: null,
      };
    }

    const item = rawItem.item;
    const artists = Array.isArray(item.artists) ? item.artists.map((a) => a.name).join(', ') : 'Unknown Artist';
    const albumArt = item.album?.images?.[0]?.url || item.album?.images?.[1]?.url || '';
    const spotifyUrl = item.external_urls?.spotify || 'https://open.spotify.com';

    return {
      isPlaying: Boolean(rawItem.is_playing),
      nowPlaying: {
        track: item.name,
        artist: artists,
        album: item.album?.name || '',
        albumArt,
        spotifyUrl,
      },
    };
  }

  /**
   * Processes Spotify top tracks response items.
   * @param {Array<object>} rawItems
   * @returns {Array<object>} SpotifyTrack[]
   */
  static processSpotifyTopTracks(rawItems) {
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return SEED_SPOTIFY_DATA.topTracks;
    }

    return rawItems.map((item) => {
      const artists = Array.isArray(item.artists) ? item.artists.map((a) => a.name).join(', ') : 'Unknown Artist';
      const albumArt = item.album?.images?.[0]?.url || item.album?.images?.[1]?.url || '';
      const spotifyUrl = item.external_urls?.spotify || 'https://open.spotify.com';

      return {
        track: item.name,
        artist: artists,
        album: item.album?.name || '',
        albumArt,
        spotifyUrl,
      };
    });
  }

  /**
   * Converts a list of Mongoose Content documents into a plain dictionary Record<string, string>.
   * @param {Array<{ key: string, value: string }>} docs
   * @returns {Record<string, string>}
   */
  static normalizeContentDictionary(docs) {
    const result = {};
    if (Array.isArray(docs)) {
      for (const doc of docs) {
        if (doc && doc.key) {
          result[doc.key] = doc.value ?? '';
        }
      }
    }
    return result;
  }

  /**
   * Normalizes project payload and handles Map conversion for impact_metrics.
   * @param {object} rawProject
   * @returns {object}
   */
  static normalizeProjectDocument(rawProject) {
    if (!rawProject) return null;
    const doc = rawProject.toObject ? rawProject.toObject() : { ...rawProject };

    if (doc.impact_metrics instanceof Map) {
      doc.impact_metrics = Object.fromEntries(doc.impact_metrics);
    } else if (!doc.impact_metrics || typeof doc.impact_metrics !== 'object') {
      doc.impact_metrics = {};
    }

    delete doc._id;
    delete doc.__v;

    return doc;
  }
}

export default DataProcessor;
