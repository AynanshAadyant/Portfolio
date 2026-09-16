import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

export class TokenManager {
  /**
   * Generates a signed JWT for the admin user.
   * @param {object} payload
   * @param {string|number} expiresIn
   * @returns {string}
   */
  static sign(payload = { admin: true }, expiresIn = ENV.JWT_EXPIRES_IN) {
    return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn });
  }

  /**
   * Verifies and decodes a JWT token.
   * @param {string} token
   * @returns {object} Decoded payload
   */
  static verify(token) {
    if (!token) {
      throw new Error('Token is missing');
    }
    return jwt.verify(token, ENV.JWT_SECRET);
  }

  /**
   * Decodes a token without verifying signature.
   * @param {string} token
   * @returns {object|null}
   */
  static decode(token) {
    return jwt.decode(token);
  }
}

export default TokenManager;
