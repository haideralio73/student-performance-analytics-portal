/**
 * middleware/performanceLogger.js — Request performance logging.
 *
 * Logs every HTTP request with method, URL, status code,
 * and response time. Errors are logged at error level.
 */

import logger from '../config/logger.js';

export const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration,
    };

    if (res.statusCode >= 500) {
      logger.error(`Server error`, logData);
    } else if (res.statusCode >= 400) {
      logger.warn(`Client error`, logData);
    } else {
      logger.info(`Request completed`, logData);
    }
  });

  next();
};

/**
 * Logs slow queries (over 500ms) to warn about performance issues.
 */
export const queryLogger = (req, _res, next) => {
  const start = Date.now();
  const origJson = req.app.response.json;

  req.app.response.json = function (body) {
    const duration = Date.now() - start;
    if (duration > 500) {
      logger.warn(`Slow request`, {
        method: req.method,
        url: req.originalUrl,
        duration,
      });
    }
    return origJson.call(this, body);
  };

  next();
};
