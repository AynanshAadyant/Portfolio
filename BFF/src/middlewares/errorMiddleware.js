import ResponseFormatter from '../utils/ResponseFormatter.js';
import Logger from '../utils/Logger.js';

/**
 * Centralized Express error handler middleware.
 */
export function errorHandler(err, req, res, next) {
  Logger.error(err.message || 'Internal server error', {
    error: err,
    path: req.originalUrl,
    method: req.method,
  });

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.status || err.statusCode || 500;
  const code = err.code || (statusCode === 404 ? 'RESOURCE_NOT_FOUND' : 'INTERNAL_SERVER_ERROR');
  const message = err.message || 'An unexpected server error occurred.';

  return ResponseFormatter.error(res, code, message, statusCode);
}

/**
 * 404 Not Found fallback handler.
 */
export function notFoundHandler(req, res) {
  return ResponseFormatter.error(
    res,
    'RESOURCE_NOT_FOUND',
    `Route ${req.method} ${req.originalUrl} not found.`,
    404
  );
}
