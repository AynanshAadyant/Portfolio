import ContentService from '../services/ContentService.js';
import ResponseFormatter from '../utils/ResponseFormatter.js';

export class ContentController {
  /**
   * Retrieves all content blocks as key-value map.
   */
  static async getAllContent(req, res, next) {
    try {
      const data = await ContentService.getAllContent();
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Retrieves single content block by key.
   */
  static async getContentByKey(req, res, next) {
    try {
      const { key } = req.params;
      const data = await ContentService.getContentByKey(key);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Upserts single content block value by key.
   */
  static async updateContentByKey(req, res, next) {
    try {
      const { key } = req.params;
      const { value } = req.body;
      const data = await ContentService.upsertContent(key, value);
      return ResponseFormatter.success(res, data, 200);
    } catch (err) {
      next(err);
    }
  }
}

export default ContentController;
