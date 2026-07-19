/**
 * middleware/errorHandler.js — Centralized error-handling middleware.
 *
 * Catches all errors forwarded via next(err), logs them via Winston,
 * and returns a consistent JSON error response.
 */

import logger from '../config/logger.js';

const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  const errors = [];

  if (err.name === 'ValidationError') {
    statusCode = 400;
    for (const field of Object.keys(err.errors)) {
      errors.push({ field, message: err.errors[field].message });
    }
  }

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for '${field}'. This record already exists.`;
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired';
  }

  logger.error(`${req.method} ${req.originalUrl} — ${statusCode} ${message}`, {
    stack: err.stack,
    statusCode,
    method: req.method,
    url: req.originalUrl,
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
