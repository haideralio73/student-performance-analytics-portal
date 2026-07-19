/**
 * config/logger.js — Winston logger configuration.
 *
 * Provides structured logging with separate files for
 * errors and combined logs, plus console output in dev.
 */

import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logDir = path.join(__dirname, '..', '..', 'logs');

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack, duration, method, url, status }) => {
    if (stack) return `[${timestamp}] ${level.toUpperCase()}: ${message}\n${stack}`;
    if (duration) return `[${timestamp}] ${method} ${url} ${status} - ${duration}ms`;
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  })
);

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, duration, method, url, status }) => {
          if (duration) return `${level}: ${method} ${url} ${status} - ${duration}ms`;
          return `${level}: ${message}`;
        })
      ),
    })
  );
}

export default logger;
