import AuthService from '../services/AuthService.js';
import ResponseFormatter from '../utils/ResponseFormatter.js';

export class AuthController {
  /**
   * Admin authentication endpoint handler.
   */
  static async login(req, res, next) {
    try {
      const { password } = req.body;
      const result = await AuthService.login(password, res);
      return ResponseFormatter.success(res, result, 200);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Admin logout endpoint handler.
   */
  static async logout(req, res, next) {
    try {
      const result = AuthService.logout(res);
      return ResponseFormatter.success(res, result, 200);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Session verification endpoint handler.
   */
  static async getMe(req, res, next) {
    try {
      const result = AuthService.verifySession(req);
      return ResponseFormatter.success(res, result, 200);
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
