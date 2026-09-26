import dotenv from 'dotenv';

dotenv.config();

export const ENV = Object.freeze({
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URL: process.env.MONGO_URL || process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Auth & Security
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin',
  JWT_SECRET: process.env.JWT_SECRET || 'super-secret-jwt-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  COOKIE_NAME: process.env.COOKIE_NAME || 'portfolio_admin_token',

  // Spotify Credentials (OAuth refresh token flow)
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID || '',
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET || '',
  SPOTIFY_REFRESH_TOKEN: process.env.SPOTIFY_REFRESH_TOKEN || '',

  // LeetCode Public Username
  LEETCODE_USERNAME: process.env.LEETCODE_USERNAME || '',

  // Cache TTLs in milliseconds
  TTL: {
    LEETCODE: 60 * 60 * 1000, // 1 hour
    SPOTIFY_NOW_PLAYING: 15 * 1000, // 15 seconds
    SPOTIFY_TOP_TRACKS: 24 * 60 * 60 * 1000, // 24 hours
    CONTENT: 10 * 60 * 1000, // 10 minutes
    PROJECTS: 10 * 60 * 1000, // 10 minutes
  },
});

export default ENV;
