/**
 * utils/apiError.js — Custom API error class.
 *
 * Extends the native Error with a statusCode and operational
 * flag so the centralized error handler can differentiate
 * expected errors from unexpected exceptions.
 */

class ApiError extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
