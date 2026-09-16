import AdminService from '../services/AdminService.js';
import ContentService from '../services/ContentService.js';
import ProjectService from '../services/ProjectService.js';
import LeetCodeService from '../services/LeetCodeService.js';
import SpotifyService from '../services/SpotifyService.js';
import ResponseFormatter from '../utils/ResponseFormatter.js';

export class AdminController {
  // --- Content CMS Operations ---
  static async listContent(req, res, next) {
    try {
      const data = await ContentService.listAllWithMetadata();
      return ResponseFormatter.success(res, data, 200);
    } catch (err) {
      next(err);
    }
  }

  static async createContent(req, res, next) {
    try {
      const { key, value } = req.body;
      const data = await ContentService.upsertContent(key, value);
      return ResponseFormatter.success(res, data, 201);
    } catch (err) {
      next(err);
    }
  }

  static async deleteContent(req, res, next) {
    try {
      const { key } = req.params;
      const data = await ContentService.deleteContent(key);
      return ResponseFormatter.success(res, data, 200);
    } catch (err) {
      next(err);
    }
  }

  static async bulkUpsertContent(req, res, next) {
    try {
      const data = await ContentService.bulkUpsert(req.body);
      return ResponseFormatter.success(res, data, 200);
    } catch (err) {
      next(err);
    }
  }

  // --- Project CMS Operations ---
  static async listProjects(req, res, next) {
    try {
      const data = await ProjectService.listAllWithMetadata();
      return ResponseFormatter.success(res, data, 200);
    } catch (err) {
      next(err);
    }
  }

  static async createProject(req, res, next) {
    try {
      const data = await ProjectService.createProject(req.body);
      return ResponseFormatter.success(res, data, 201);
    } catch (err) {
      next(err);
    }
  }

  static async updateProject(req, res, next) {
    try {
      const { slug } = req.params;
      const data = await ProjectService.updateProject(slug, req.body);
      return ResponseFormatter.success(res, data, 200);
    } catch (err) {
      next(err);
    }
  }

  static async deleteProject(req, res, next) {
    try {
      const { slug } = req.params;
      const data = await ProjectService.deleteProject(slug);
      return ResponseFormatter.success(res, data, 200);
    } catch (err) {
      next(err);
    }
  }

  static async reorderProjects(req, res, next) {
    try {
      const data = await ProjectService.reorderProjects(req.body);
      return ResponseFormatter.success(res, data, 200);
    } catch (err) {
      next(err);
    }
  }

  // --- Cache & Telemetry Operations ---
  static async getCacheStatus(req, res, next) {
    try {
      const data = await AdminService.getCacheStatus();
      return ResponseFormatter.success(res, data, 200);
    } catch (err) {
      next(err);
    }
  }

  static async clearCache(req, res, next) {
    try {
      const data = await AdminService.clearCache();
      return ResponseFormatter.success(res, data, 200);
    } catch (err) {
      next(err);
    }
  }

  static async seedInitialData(req, res, next) {
    try {
      const force = Boolean(req.body?.force);
      const data = await AdminService.seedData(force);
      return ResponseFormatter.success(res, data, 200);
    } catch (err) {
      next(err);
    }
  }

  static async syncLeetCode(req, res, next) {
    try {
      const data = await LeetCodeService.sync();
      return ResponseFormatter.success(res, data, 200);
    } catch (err) {
      next(err);
    }
  }

  static async syncSpotify(req, res, next) {
    try {
      const data = await SpotifyService.sync();
      return ResponseFormatter.success(res, data, 200);
    } catch (err) {
      next(err);
    }
  }

  // --- System Diagnostics ---
  static async getHealth(req, res, next) {
    try {
      const data = await AdminService.getSystemHealth();
      return ResponseFormatter.success(res, data, 200);
    } catch (err) {
      next(err);
    }
  }
}

export default AdminController;
