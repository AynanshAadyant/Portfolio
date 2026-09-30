import GithubService from '../services/Github.js';
import ResponseFormatter from '../utils/ResponseFormatter.js';

export class GithubController {
  /**
   * Retrieves cached GitHub stats/commits.
   */
  static async getStats(req, res, next) {
    try {
      const data = await GithubService.getCachedStats();
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Forces refresh of GitHub stats/commits (Admin only).
   */
  static async syncStats(req, res, next) {
    try {
      const data = await GithubService.sync();
      return ResponseFormatter.success(res, data, 200);
    } catch (err) {
      next(err);
    }
  }
}

export default GithubController;
