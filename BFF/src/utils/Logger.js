class Logger {
  // Standard RFC 5424 Log Levels with numeric weights
  static LEVELS = Object.freeze({
    TRACE: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    FATAL: 5,
  });

  // State categories for backend tracing and observability
  static STATES = Object.freeze({
    // Lifecycle & System
    STARTUP: 'SYSTEM_STARTUP',
    SHUTDOWN: 'SYSTEM_SHUTDOWN',
    HEALTH_CHECK: 'SYSTEM_HEALTH_CHECK',
    CONFIG_LOAD: 'CONFIG_LOAD',

    // Network & Transport
    HTTP_REQUEST: 'HTTP_REQUEST',
    HTTP_RESPONSE: 'HTTP_RESPONSE',
    WS_CONNECT: 'WS_CONNECT',
    WS_DISCONNECT: 'WS_DISCONNECT',

    // Data & Storage
    DB_QUERY: 'DB_QUERY',
    DB_TX_START: 'DB_TX_START',
    DB_TX_COMMIT: 'DB_TX_COMMIT',
    DB_TX_ROLLBACK: 'DB_TX_ROLLBACK',
    CACHE_HIT: 'CACHE_HIT',
    CACHE_MISS: 'CACHE_MISS',

    // Messaging & Async
    QUEUE_PUBLISH: 'QUEUE_PUBLISH',
    QUEUE_CONSUME: 'QUEUE_CONSUME',
    CRON_EXECUTE: 'CRON_EXECUTE',

    // Identity & Security
    AUTH_SUCCESS: 'AUTH_SUCCESS',
    AUTH_FAILURE: 'AUTH_FAILURE',
    ACCESS_DENIED: 'ACCESS_DENIED',
    RATE_LIMITED: 'RATE_LIMITED',

    // Failures & Resilience
    CIRCUIT_OPEN: 'CIRCUIT_OPEN',
    RETRY_ATTEMPT: 'RETRY_ATTEMPT',
    UNCAUGHT_EXCEPTION: 'UNCAUGHT_EXCEPTION',
    UNHANDLED_REJECTION: 'UNHANDLED_REJECTION',
  });

  constructor(options = {}) {
    this.serviceName = options.serviceName || 'backend-service';
    this.environment = options.environment || process.env.NODE_ENV || 'development';
    this.minLevel = Logger.LEVELS[options.minLevel?.toUpperCase()] ?? Logger.LEVELS.INFO;
  }

  // Core structured logging engine
  _log(levelName, state, message, meta = {}) {
    const levelWeight = Logger.LEVELS[levelName];
    if (levelWeight < this.minLevel) return;

    const entry = {
      timestamp: new Date().toISOString(),
      service: this.serviceName,
      env: this.environment,
      level: levelName,
      state: state || 'GENERAL',
      message,
      correlationId: meta.correlationId || meta.reqId || null,
      ...meta,
    };

    // Serialize Error instances properly
    if (meta.error instanceof Error) {
      entry.error = {
        name: meta.error.name,
        message: meta.error.message,
        stack: meta.error.stack,
      };
    }

    const output = JSON.stringify(entry);
    
    if (levelWeight >= Logger.LEVELS.ERROR) {
      process.stderr.write(output + '\n');
    } else {
      process.stdout.write(output + '\n');
    }
  }

  // Standard Severity Methods
  trace(message, meta, state = Logger.STATES.DEBUG) {
    this._log('TRACE', state, message, meta);
  }

  debug(message, meta, state = Logger.STATES.DEBUG) {
    this._log('DEBUG', state, message, meta);
  }

  info(message, meta = {}, state = Logger.STATES.INFO) {
    this._log('INFO', state, message, meta);
  }

  warn(message, meta, state = Logger.STATES.WARN) {
    this._log('WARN', state, message, meta);
  }

  error(message, meta, state = Logger.STATES.ERROR) {
    this._log('ERROR', state, message, meta);
  }

  fatal(message, meta, state = Logger.STATES.FATAL) {
    this._log('FATAL', state, message, meta);
  }

  // Domain-Specific Convenience Methods
  httpRequest(req, meta = {}) {
    this.info(`Incoming ${req.method} ${req.url}`, {
      method: req.method,
      url: req.url,
      ip: req.ip || req.socket?.remoteAddress,
      userAgent: req.headers?.['user-agent'],
      ...meta,
    }, Logger.STATES.HTTP_REQUEST);
  }

  httpResponse(res, durationMs, meta = {}) {
    const level = res.statusCode >= 500 ? 'ERROR' : res.statusCode >= 400 ? 'WARN' : 'INFO';
    this._log(level, Logger.STATES.HTTP_RESPONSE, `Handled request with status ${res.statusCode}`, {
      statusCode: res.statusCode,
      durationMs,
      ...meta,
    });
  }

  dbQuery(query, durationMs, meta = {}) {
    this.debug(`Executed query in ${durationMs}ms`, {
      query,
      durationMs,
      ...meta,
    }, Logger.STATES.DB_QUERY);
  }

  securityAudit(action, success, meta = {}) {
    const state = success ? Logger.STATES.AUTH_SUCCESS : Logger.STATES.AUTH_FAILURE;
    const level = success ? 'INFO' : 'WARN';
    this._log(level, state, `Security action: ${action} [${success ? 'SUCCESS' : 'FAILURE'}]`, meta);
  }
}

export default new Logger()