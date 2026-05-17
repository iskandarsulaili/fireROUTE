import pino from 'pino';
import { loggerConfig } from '../config/index.js';

/**
 * Shared application logger.
 */
export const logger = pino({
  level: loggerConfig.level,
  transport:
    loggerConfig.prettyPrint || loggerConfig.prettyTransport
      ? {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'SYS:standard' },
        }
      : undefined,
  redact: loggerConfig.redact,
});
