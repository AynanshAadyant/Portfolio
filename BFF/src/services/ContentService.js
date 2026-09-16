import mongoose from 'mongoose';
import Content from '../models/Content.js';
import cacheManager from '../utils/CacheManager.js';
import DataProcessor from '../utils/DataProcessor.js';
import { SEED_CONTENT_BLOCKS } from '../utils/seedData.js';
import { ENV } from '../config/env.js';
import Logger from '../utils/Logger.js';

export class ContentService {
  static CACHE_KEY = 'content:all';

  /**
   * Retrieves all content blocks as a dictionary Map.
   * Uses multi-tier cache with seed data fallback.
   * @returns {Promise<Record<string, string>>}
   */
  static async getAllContent() {
    // 1. Check cache
    const cached = await cacheManager.get(ContentService.CACHE_KEY);
    if (cached) {
      return cached;
    }

    // If DB is not connected, serve seed data immediately
    if (mongoose.connection.readyState !== 1) {
      return { ...SEED_CONTENT_BLOCKS };
    }

    // 2. Fetch from DB
    try {
      const docs = await Content.find({}).lean();
      let dictionary = {};

      if (docs && docs.length > 0) {
        dictionary = { ...SEED_CONTENT_BLOCKS, ...DataProcessor.normalizeContentDictionary(docs) };
      } else {
        dictionary = { ...SEED_CONTENT_BLOCKS };
      }

      await cacheManager.set(ContentService.CACHE_KEY, dictionary, ENV.TTL.CONTENT);
      return dictionary;
    } catch (err) {
      Logger.warn(`[ContentService] DB error in getAllContent, returning seed data: ${err.message}`);
      return { ...SEED_CONTENT_BLOCKS };
    }
  }

  /**
   * Retrieves a single content block by dot-notated key.
   * @param {string} key
   * @returns {Promise<{ key: string, value: string }>}
   */
  static async getContentByKey(key) {
    if (!key) {
      const error = new Error('Content key is required.');
      error.statusCode = 400;
      error.code = 'INVALID_KEY';
      throw error;
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const doc = await Content.findOne({ key }).lean();
        if (doc) {
          return { key: doc.key, value: doc.value ?? '' };
        }
      } catch (err) {
        Logger.warn(`[ContentService] DB error in getContentByKey: ${err.message}`);
      }
    }

    // Fallback to seed data if available
    if (SEED_CONTENT_BLOCKS[key] !== undefined) {
      return { key, value: SEED_CONTENT_BLOCKS[key] };
    }

    return { key, value: '' };
  }

  /**
   * Upserts a content block.
   * @param {string} key
   * @param {string} value
   * @returns {Promise<{ success: boolean, key: string, value: string }>}
   */
  static async upsertContent(key, value) {
    if (!key) {
      const error = new Error('Content key is required.');
      error.statusCode = 400;
      error.code = 'INVALID_KEY';
      throw error;
    }

    const valStr = typeof value === 'string' ? value : String(value ?? '');

    if (mongoose.connection.readyState !== 1) {
      const error = new Error('Database is currently not connected.');
      error.statusCode = 503;
      error.code = 'DATABASE_UNAVAILABLE';
      throw error;
    }

    const doc = await Content.findOneAndUpdate(
      { key },
      { value: valStr },
      { upsert: true, returnDocument: 'after', runValidators: true }
    );

    // Invalidate cache
    await cacheManager.delete(ContentService.CACHE_KEY);
    Logger.info(`[ContentService] Upserted content block: ${key}`);

    return {
      success: true,
      key: doc.key,
      value: doc.value,
    };
  }

  /**
   * Deletes a content block by key.
   * @param {string} key
   * @returns {Promise<{ success: boolean, deletedKey: string }>}
   */
  static async deleteContent(key) {
    if (mongoose.connection.readyState !== 1) {
      const error = new Error('Database is currently not connected.');
      error.statusCode = 503;
      error.code = 'DATABASE_UNAVAILABLE';
      throw error;
    }

    const res = await Content.deleteOne({ key });
    if (res.deletedCount === 0) {
      const error = new Error(`Content block '${key}' does not exist.`);
      error.statusCode = 404;
      error.code = 'RESOURCE_NOT_FOUND';
      throw error;
    }

    await cacheManager.delete(ContentService.CACHE_KEY);
    Logger.info(`[ContentService] Deleted content block: ${key}`);

    return {
      success: true,
      deletedKey: key,
    };
  }

  /**
   * Bulk upserts multiple content blocks.
   * @param {Record<string, string>} contentMap
   * @returns {Promise<{ success: boolean, count: number }>}
   */
  static async bulkUpsert(contentMap = {}) {
    const entries = Object.entries(contentMap);
    if (entries.length === 0) {
      return { success: true, count: 0 };
    }

    if (mongoose.connection.readyState !== 1) {
      const error = new Error('Database is currently not connected.');
      error.statusCode = 503;
      error.code = 'DATABASE_UNAVAILABLE';
      throw error;
    }

    const bulkOps = entries.map(([key, value]) => ({
      updateOne: {
        filter: { key },
        update: { $set: { value: String(value ?? '') } },
        upsert: true,
      },
    }));

    await Content.bulkWrite(bulkOps);
    await cacheManager.delete(ContentService.CACHE_KEY);
    Logger.info(`[ContentService] Bulk upserted ${entries.length} content blocks.`);

    return {
      success: true,
      count: entries.length,
    };
  }

  /**
   * Returns all content documents with admin metadata.
   * @returns {Promise<Array<object>>}
   */
  static async listAllWithMetadata() {
    if (mongoose.connection.readyState !== 1) {
      return Object.entries(SEED_CONTENT_BLOCKS).map(([key, value]) => ({
        key,
        value,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    }
    return Content.find({}).sort({ key: 1 }).lean();
  }
}

export default ContentService;
