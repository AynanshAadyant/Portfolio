import TokenManager from '../utils/TokenManager.js';
import CookieManager from '../utils/CookieManager.js';
import ResponseFormatter from '../utils/ResponseFormatter.js';
import Logger from '../utils/Logger.js';

/**
 * Middleware requiring valid administrative JWT authentication.
 * Supports both HTTP Bearer Authorization header and HTTP-only cookie.
 */
export function requireAdmin(req, res, next) {
  try {
    let token = null;

    // 1. Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }

    // 2. Fallback to HTTP-only cookie
    if (!token) {
      token = CookieManager.getAuthCookie(req);
    }

    if (!token) {
      Logger.securityAudit('REQUIRE_ADMIN', false, { ip: req.ip, reason: 'TOKEN_MISSING' });
      return ResponseFormatter.error(
        res,
        'UNAUTHORIZED',
        'Authentication required. Please provide a valid Bearer token or cookie.',
        401
      );
    }

    const decoded = TokenManager.verify(token);
    req.admin = decoded;
    Logger.securityAudit('REQUIRE_ADMIN', true, { ip: req.ip });
    next();
  } catch (err) {
    Logger.securityAudit('REQUIRE_ADMIN', false, { ip: req.ip, error: err.message });
    return ResponseFormatter.error(
      res,
      'INVALID_TOKEN',
      'Invalid or expired administrative credentials.',
      401
    );
  }
}

export default requireAdmin;
