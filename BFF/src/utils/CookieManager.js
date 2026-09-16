import { ENV } from '../config/env.js';

export class CookieManager {
  static COOKIE_OPTIONS = Object.freeze({
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: ENV.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    path: '/',
  });

  /**
   * Sets the authentication cookie on the response.
   * @param {import('express').Response} res
   * @param {string} token
   * @param {object} customOptions
   */
  static setAuthCookie(res, token, customOptions = {}) {
    const options = { ...CookieManager.COOKIE_OPTIONS, ...customOptions };
    res.cookie(ENV.COOKIE_NAME, token, options);
  }

  /**
   * Retrieves the authentication token from request cookies.
   * @param {import('express').Request} req
   * @returns {string|null}
   */
  static getAuthCookie(req) {
    if (!req) return null;
    if (req.cookies && req.cookies[ENV.COOKIE_NAME]) {
      return req.cookies[ENV.COOKIE_NAME];
    }
    // Fallback: manual parsing from req.headers.cookie
    if (req.headers && req.headers.cookie) {
      const match = req.headers.cookie.match(new RegExp(`(?:^|;\\s*)${ENV.COOKIE_NAME}=([^;]*)`));
      if (match) return decodeURIComponent(match[1]);
    }
    return null;
  }

  /**
   * Clears the authentication cookie from the response.
   * @param {import('express').Response} res
   */
  static clearAuthCookie(res) {
    res.clearCookie(ENV.COOKIE_NAME, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      sameSite: ENV.NODE_ENV === 'production' ? 'strict' : 'lax',
      path: '/',
    });
  }
}

export default CookieManager;
