/**
 * middleware/errorHandler.js — Centralized error-handling middleware.
 *
 * Catches all errors forwarded via next(err) and returns a
 * consistent JSON error response to the client.
 */

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  console.error(err.stack);

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

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
