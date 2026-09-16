import { ENV } from '../config/env.js';
import TokenManager from '../utils/TokenManager.js';
import CookieManager from '../utils/CookieManager.js';
import Logger from '../utils/Logger.js';

export class AuthService {
  /**
   * Validates admin password, creates session token, sets HTTP-only cookie.
   * @param {string} password
   * @param {import('express').Response} res
   * @returns {{ success: boolean, token: string, expiresIn: number }}
   */
  static async login(password, res) {
    if (!password || password !== ENV.ADMIN_PASSWORD) {
      Logger.securityAudit('ADMIN_LOGIN', false, { reason: 'INVALID_CREDENTIALS' });
      const error = new Error('Incorrect administrative password.');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const token = TokenManager.sign({ admin: true });
    CookieManager.setAuthCookie(res, token);
    Logger.securityAudit('ADMIN_LOGIN', true, {});

    return {
      success: true,
      token,
      expiresIn: 86400, // 24 hours in seconds (standard contract)
    };
  }

  /**
   * Clears session cookie and logs out.
   * @param {import('express').Response} res
   * @returns {{ success: boolean, message: string }}
   */
  static logout(res) {
    CookieManager.clearAuthCookie(res);
    Logger.securityAudit('ADMIN_LOGOUT', true, {});
    return {
      success: true,
      message: 'Successfully logged out.',
    };
  }

  /**
   * Verifies current session token or cookie.
   * @param {import('express').Request} req
   * @returns {{ success: boolean, authenticated: boolean }}
   */
  static verifySession(req) {
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
    if (!token) {
      token = CookieManager.getAuthCookie(req);
    }

    if (!token) {
      return { success: true, authenticated: false };
    }

    try {
      TokenManager.verify(token);
      return { success: true, authenticated: true };
    } catch {
      return { success: true, authenticated: false };
    }
  }
}

export default AuthService;
