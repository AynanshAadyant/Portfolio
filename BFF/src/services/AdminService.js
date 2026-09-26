import mongoose from 'mongoose';
import cacheManager from '../utils/CacheManager.js';
import Content from '../models/Content.js';
import Project from '../models/Project.js';
import { SEED_CONTENT_BLOCKS, SEED_PROJECTS } from '../utils/seedData.js';
import { ENV } from '../config/env.js';
import Logger from '../utils/Logger.js';

export class AdminService {
  /**
   * Returns cache diagnostics.
   */
  static async getCacheStatus() {
    return cacheManager.getStatus();
  }

  /**
   * Clears in-memory and database cache.
   */
  static async clearCache() {
    await cacheManager.clear();
    Logger.info('[AdminService] Cache completely cleared.');
    return {
      success: true,
      message: 'All cache stores successfully cleared.',
    };
  }

  /**
   * Seeds database collections with default fallback data if empty or forced.
   * @param {boolean} force - If true, overwrites existing content and projects.
   */
  static async seedData(force = false) {
    Logger.info(`[AdminService] Initiating database seeding (force: ${force})...`);

    // 1. Seed Content Blocks
    const existingContentCount = await Content.countDocuments();
    let contentInserted = 0;

    if (force || existingContentCount === 0) {
      if (force) {
        await Content.deleteMany({});
      }
      const contentDocs = Object.entries(SEED_CONTENT_BLOCKS).map(([key, value]) => ({
        key,
        value,
      }));
      const res = await Content.insertMany(contentDocs);
      contentInserted = res.length;
    }

    // 2. Seed Projects
    const existingProjectsCount = await Project.countDocuments();
    let projectsInserted = 0;

    if (force || existingProjectsCount === 0) {
      if (force) {
        await Project.deleteMany({});
      }
      const res = await Project.insertMany(SEED_PROJECTS);
      projectsInserted = res.length;
    }

    // Invalidate caches
    await cacheManager.clear();

    return {
      success: true,
      seeded: {
        contentBlocks: contentInserted,
        projects: projectsInserted,
      },
      message: `Database seeded: ${contentInserted} content blocks, ${projectsInserted} projects.`,
    };
  }

  /**
   * Returns complete system health and runtime diagnostics.
   */
  static async getSystemHealth() {
    const memory = process.memoryUsage();
    const uptimeSec = Math.floor(process.uptime());

    const mongoStateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    const dbStatus = mongoStateMap[mongoose.connection.readyState] || 'unknown';

    return {
      success: true,
      status: 'operational',
      uptime: `${uptimeSec}s`,
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        host: mongoose.connection.host || 'N/A',
        name: mongoose.connection.name || 'N/A',
      },
      memory: {
        heapUsedMb: Math.round(memory.heapUsed / 1024 / 1024),
        heapTotalMb: Math.round(memory.heapTotal / 1024 / 1024),
        rssMb: Math.round(memory.rss / 1024 / 1024),
      },
      integrations: {
        spotifyConfigured: Boolean(ENV.SPOTIFY_CLIENT_ID && ENV.SPOTIFY_REFRESH_TOKEN),
        leetcodeConfigured: Boolean(ENV.LEETCODE_USERNAME),
      },
    };
  }
}

export default AdminService;
