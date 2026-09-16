import ProjectService from '../services/ProjectService.js';
import ResponseFormatter from '../utils/ResponseFormatter.js';

export class ProjectController {
  /**
   * Retrieves all projects ordered by display_order ascending.
   */
  static async getAllProjects(req, res, next) {
    try {
      const data = await ProjectService.getAllProjects();
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Retrieves single project case study by slug.
   */
  static async getProjectBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const data = await ProjectService.getProjectBySlug(slug);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Creates a new project document (Admin only).
   */
  static async createProject(req, res, next) {
    try {
      const data = await ProjectService.createProject(req.body);
      return ResponseFormatter.success(res, data, 201);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Updates an existing project document by slug (Admin only).
   */
  static async updateProject(req, res, next) {
    try {
      const { slug } = req.params;
      const data = await ProjectService.updateProject(slug, req.body);
      return ResponseFormatter.success(res, data, 200);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Deletes a project document by slug (Admin only).
   */
  static async deleteProject(req, res, next) {
    try {
      const { slug } = req.params;
      const data = await ProjectService.deleteProject(slug);
      return ResponseFormatter.success(res, data, 200);
    } catch (err) {
      next(err);
    }
  }
}

export default ProjectController;
