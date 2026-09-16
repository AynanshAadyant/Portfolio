import Logger from '../utils/Logger.js';

/**
 * Express middleware for request and response logging with execution latency.
 */
export function requestLogger(req, res, next) {
  const start = Date.now();
  Logger.httpRequest(req);

  res.on('finish', () => {
    const duration = Date.now() - start;
    Logger.httpResponse(res, duration);
  });

  next();
}

export default requestLogger;
