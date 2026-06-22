import type {
  ServerConfig,
  LoggerConfig,
  RateLimitConfig,
  HttpClientConfig,
} from '../types/config.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Environment-derived server configuration.
 */
export const serverConfig: ServerConfig = {
  port: parseInt(process.env['PORT'] ?? '3000', 10),
  host: process.env['HOST'] ?? '0.0.0.0',
  logLevel: process.env['LOG_LEVEL'] ?? 'info',
  nodeEnv: process.env['NODE_ENV'] ?? 'development',
  databaseUrl: process.env['DATABASE_URL'] ?? 'file:./dev.db',
};

/**
 * Logger configuration.
 */
export const loggerConfig: LoggerConfig = {
  level: serverConfig.logLevel,
  prettyPrint: false,
  prettyTransport: serverConfig.nodeEnv === 'development',
  redact: ['req.headers.authorization', 'req.headers.cookie'],
};

/**
 * Rate limit configuration.
 */
export const rateLimitConfig: RateLimitConfig = {
  max: 100,
  timeWindow: '1 minute',
};

/**
 * Upstream HTTP client defaults.
 */
export const httpClientConfig: HttpClientConfig = {
  defaultTimeout: 8000,
  maxRetries: 3,
  retryDelay: 1000,
  maxConnections: 100,
};
