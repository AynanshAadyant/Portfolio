import mongoose from 'mongoose';
import Cache from '../models/Cache.js';
import Logger from './Logger.js';

export class CacheManager {
  constructor() {
    /** @type {Map<string, { payload: any, expiresAt: number }>} */
    this.memoryStore = new Map();
  }

  /**
   * Retrieves an item from memory cache or database cache.
   * @param {string} key
   * @returns {Promise<any|null>}
   */
  async get(key) {
    const now = Date.now();

    // 1. Check in-memory store
    if (this.memoryStore.has(key)) {
      const entry = this.memoryStore.get(key);
      if (entry.expiresAt && entry.expiresAt <= now) {
        this.memoryStore.delete(key);
      } else {
        Logger.debug(`[CacheManager] Memory hit for key: ${key}`);
        return entry.payload;
      }
    }

    // 2. Check Database store only if DB is connected
    if (mongoose.connection.readyState === 1) {
      try {
        const dbEntry = await Cache.findOne({ key }).lean();
        if (dbEntry) {
          if (dbEntry.expiresAt && new Date(dbEntry.expiresAt).getTime() <= now) {
            await Cache.deleteOne({ key });
          } else {
            // Repopulate memory store with remaining TTL
            this.memoryStore.set(key, {
              payload: dbEntry.payload,
              expiresAt: dbEntry.expiresAt ? new Date(dbEntry.expiresAt).getTime() : 0,
            });
            Logger.debug(`[CacheManager] DB hit for key: ${key}`);
            return dbEntry.payload;
          }
        }
      } catch (err) {
        Logger.warn(`[CacheManager] DB read error for key ${key}: ${err.message}`);
      }
    }

    return null;
  }

  /**
   * Stores an item into memory and persistent database cache.
   * @param {string} key
   * @param {any} payload
   * @param {number} [ttlMs] Time-to-live in milliseconds.
   */
  async set(key, payload, ttlMs = 0) {
    const now = Date.now();
    const expiresAt = ttlMs > 0 ? now + ttlMs : 0;

    // Update in-memory
    this.memoryStore.set(key, {
      payload,
      expiresAt,
    });

    // Update DB only if DB is connected
    if (mongoose.connection.readyState === 1) {
      try {
        const expiresAtDate = ttlMs > 0 ? new Date(expiresAt) : null;
        await Cache.findOneAndUpdate(
          { key },
          { payload, expiresAt: expiresAtDate, updatedAt: new Date() },
          { upsert: true, returnDocument: 'after' }
        );
        Logger.debug(`[CacheManager] Persisted key: ${key}`);
      } catch (err) {
        Logger.warn(`[CacheManager] DB write error for key ${key}: ${err.message}`);
      }
    }
  }

  /**
   * Deletes a key from both caches.
   * @param {string} key
   */
  async delete(key) {
    this.memoryStore.delete(key);
    if (mongoose.connection.readyState === 1) {
      try {
        await Cache.deleteOne({ key });
      } catch (err) {
        Logger.warn(`[CacheManager] DB delete error for key ${key}: ${err.message}`);
      }
    }
  }

  /**
   * Clears all entries from both caches.
   */
  async clear() {
    this.memoryStore.clear();
    if (mongoose.connection.readyState === 1) {
      try {
        await Cache.deleteMany({});
      } catch (err) {
        Logger.warn(`[CacheManager] DB clear error: ${err.message}`);
      }
    }
  }

  /**
   * Returns cache diagnostics and status.
   * @returns {Promise<object>}
   */
  async getStatus() {
    const memoryKeys = Array.from(this.memoryStore.keys());
    let dbKeys = [];
    if (mongoose.connection.readyState === 1) {
      try {
        const records = await Cache.find({}, 'key updatedAt expiresAt').lean();
        dbKeys = records.map((r) => ({
          key: r.key,
          updatedAt: r.updatedAt,
          expiresAt: r.expiresAt,
        }));
      } catch (err) {
        Logger.warn(`[CacheManager] Failed to fetch DB cache keys: ${err.message}`);
      }
    }

    return {
      memoryEntriesCount: this.memoryStore.size,
      memoryKeys,
      dbEntriesCount: dbKeys.length,
      dbKeys,
    };
  }
}

export const cacheManager = new CacheManager();
export default cacheManager;
