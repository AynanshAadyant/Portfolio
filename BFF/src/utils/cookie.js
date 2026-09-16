import CookieManager from './CookieManager.js';

export const generateCookie = CookieManager.setAuthCookie;
export const clearCookie = CookieManager.clearAuthCookie;

export default {
  generateCookie,
  clearCookie,
};