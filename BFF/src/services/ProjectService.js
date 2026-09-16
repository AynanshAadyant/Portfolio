import mongoose from 'mongoose';
import Project from '../models/Project.js';
import cacheManager from '../utils/CacheManager.js';
import DataProcessor from '../utils/DataProcessor.js';
import MermaidValidator from '../utils/MermaidValidator.js';
import { SEED_PROJECTS } from '../utils/seedData.js';
import { ENV } from '../config/env.js';
import Logger from '../utils/Logger.js';

export class ProjectService {
  static CACHE_KEY = 'projects:all';

  /**
   * Retrieves all projects ordered by display_order ascending.
   * Employs multi-tier caching with fallback resilience.
   * @returns {Promise<Array<object>>}
   */
  static async getAllProjects() {
    const cached = await cacheManager.get(ProjectService.CACHE_KEY);
    if (cached) {
      return cached;
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const docs = await Project.find({}).sort({ display_order: 1 }).lean();
        if (docs && docs.length > 0) {
          const projects = docs.map((doc) => DataProcessor.normalizeProjectDocument(doc));
          await cacheManager.set(ProjectService.CACHE_KEY, projects, ENV.TTL.PROJECTS);
          return projects;
        }
      } catch (err) {
        Logger.warn(`[ProjectService] DB error in getAllProjects: ${err.message}`);
      }
    }

    // Return seed projects if DB is empty or unavailable
    await cacheManager.set(ProjectService.CACHE_KEY, SEED_PROJECTS, ENV.TTL.PROJECTS);
    return SEED_PROJECTS;
  }

  /**
   * Retrieves single project case study by unique slug.
   * @param {string} slug
   * @returns {Promise<object>}
   */
  static async getProjectBySlug(slug) {
    if (!slug) {
      const error = new Error('Project slug is required.');
      error.statusCode = 400;
      error.code = 'INVALID_SLUG';
      throw error;
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const doc = await Project.findOne({ slug: slug.toLowerCase() }).lean();
        if (doc) {
          return DataProcessor.normalizeProjectDocument(doc);
        }
      } catch (err) {
        Logger.warn(`[ProjectService] DB error in getProjectBySlug: ${err.message}`);
      }
    }

    // Check seed projects
    const seed = SEED_PROJECTS.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
    if (seed) {
      return seed;
    }

    const error = new Error(`Project with slug '${slug}' does not exist.`);
    error.statusCode = 404;
    error.code = 'RESOURCE_NOT_FOUND';
    throw error;
  }

  /**
   * Creates a new project document.
   * Validates Mermaid diagram and slug uniqueness.
   * @param {object} projectData
   * @returns {Promise<object>}
   */
  static async createProject(projectData) {
    const { slug, title, architecture_diagram } = projectData;

    if (!slug || !title) {
      const error = new Error('Project slug and title are required.');
      error.statusCode = 400;
      error.code = 'VALIDATION_ERROR';
      throw error;
    }

    const cleanSlug = slug.trim().toLowerCase();

    if (mongoose.connection.readyState !== 1) {
      const error = new Error('Database is currently not connected.');
      error.statusCode = 503;
      error.code = 'DATABASE_UNAVAILABLE';
      throw error;
    }

    // 1. Check slug uniqueness
    const existing = await Project.findOne({ slug: cleanSlug }).lean();
    if (existing) {
      const error = new Error(`Project with slug '${cleanSlug}' already exists.`);
      error.statusCode = 409;
      error.code = 'PROJECT_ALREADY_EXISTS';
      throw error;
    }

    // 2. Validate Mermaid diagram
    if (architecture_diagram) {
      const validation = MermaidValidator.validate(architecture_diagram);
      if (!validation.isValid) {
        const error = new Error(validation.error || 'Invalid Mermaid architecture diagram.');
        error.statusCode = 400;
        error.code = 'INVALID_MERMAID_SYNTAX';
        throw error;
      }
      projectData.architecture_diagram = MermaidValidator.sanitize(architecture_diagram);
    }

    // 3. Create document
    const created = await Project.create({
      ...projectData,
      slug: cleanSlug,
    });

    await cacheManager.delete(ProjectService.CACHE_KEY);
    Logger.info(`[ProjectService] Created project: ${cleanSlug}`);

    return DataProcessor.normalizeProjectDocument(created);
  }

  /**
   * Updates an existing project document.
   * @param {string} slug
   * @param {object} updateData
   * @returns {Promise<object>}
   */
  static async updateProject(slug, updateData) {
    if (!slug) {
      const error = new Error('Project slug is required.');
      error.statusCode = 400;
      error.code = 'INVALID_SLUG';
      throw error;
    }

    if (mongoose.connection.readyState !== 1) {
      const error = new Error('Database is currently not connected.');
      error.statusCode = 503;
      error.code = 'DATABASE_UNAVAILABLE';
      throw error;
    }

    // Validate Mermaid diagram if updated
    if (updateData.architecture_diagram) {
      const validation = MermaidValidator.validate(updateData.architecture_diagram);
      if (!validation.isValid) {
        const error = new Error(validation.error || 'Invalid Mermaid architecture diagram.');
        error.statusCode = 400;
        error.code = 'INVALID_MERMAID_SYNTAX';
        throw error;
      }
      updateData.architecture_diagram = MermaidValidator.sanitize(updateData.architecture_diagram);
    }

    const updated = await Project.findOneAndUpdate(
      { slug: slug.toLowerCase() },
      { $set: updateData },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updated) {
      const error = new Error(`Project with slug '${slug}' does not exist.`);
      error.statusCode = 404;
      error.code = 'RESOURCE_NOT_FOUND';
      throw error;
    }

    await cacheManager.delete(ProjectService.CACHE_KEY);
    Logger.info(`[ProjectService] Updated project: ${slug}`);

    return DataProcessor.normalizeProjectDocument(updated);
  }

  /**
   * Deletes a project document by slug.
   * @param {string} slug
   * @returns {Promise<{ success: boolean, deletedSlug: string }>}
   */
  static async deleteProject(slug) {
    if (!slug) {
      const error = new Error('Project slug is required.');
      error.statusCode = 400;
      error.code = 'INVALID_SLUG';
      throw error;
    }

    if (mongoose.connection.readyState !== 1) {
      const error = new Error('Database is currently not connected.');
      error.statusCode = 503;
      error.code = 'DATABASE_UNAVAILABLE';
      throw error;
    }

    const res = await Project.deleteOne({ slug: slug.toLowerCase() });
    if (res.deletedCount === 0) {
      const error = new Error(`Project with slug '${slug}' does not exist.`);
      error.statusCode = 404;
      error.code = 'RESOURCE_NOT_FOUND';
      throw error;
    }

    await cacheManager.delete(ProjectService.CACHE_KEY);
    Logger.info(`[ProjectService] Deleted project: ${slug}`);

    return {
      success: true,
      deletedSlug: slug,
    };
  }

  /**
   * Reorders projects based on an array of { slug, display_order }.
   * @param {Array<{ slug: string, display_order: number }>} orderList
   * @returns {Promise<{ success: boolean, updatedCount: number }>}
   */
  static async reorderProjects(orderList) {
    if (!Array.isArray(orderList) || orderList.length === 0) {
      const error = new Error('Order list must be a non-empty array of { slug, display_order }.');
      error.statusCode = 400;
      error.code = 'INVALID_PAYLOAD';
      throw error;
    }

    if (mongoose.connection.readyState !== 1) {
      const error = new Error('Database is currently not connected.');
      error.statusCode = 503;
      error.code = 'DATABASE_UNAVAILABLE';
      throw error;
    }

    const bulkOps = orderList.map((item) => ({
      updateOne: {
        filter: { slug: item.slug.toLowerCase() },
        update: { $set: { display_order: Number(item.display_order) || 0 } },
      },
    }));

    const result = await Project.bulkWrite(bulkOps);
    await cacheManager.delete(ProjectService.CACHE_KEY);
    Logger.info(`[ProjectService] Reordered ${result.modifiedCount} projects.`);

    return {
      success: true,
      updatedCount: result.modifiedCount,
    };
  }

  /**
   * Admin listing of all projects with internal database IDs and metadata.
   * @returns {Promise<Array<object>>}
   */
  static async listAllWithMetadata() {
    if (mongoose.connection.readyState !== 1) {
      return SEED_PROJECTS;
    }
    return Project.find({}).sort({ display_order: 1 }).lean();
  }
}

export default ProjectService;
