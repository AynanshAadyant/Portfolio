import LeetCodeService from '../services/LeetCodeService.js';
import ResponseFormatter from '../utils/ResponseFormatter.js';

export class LeetCodeController {
  /**
   * Retrieves cached LeetCode stats.
   */
  static async getStats(req, res, next) {
    try {
      const data = await LeetCodeService.getCachedStats();
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Forces refresh of LeetCode stats (Admin only).
   */
  static async syncStats(req, res, next) {
    try {
      const data = await LeetCodeService.sync();
      return ResponseFormatter.success(res, data, 200);
    } catch (err) {
      next(err);
    }
  }
}

export default LeetCodeController;
