/**
 * Comprehensive logging system for Stately
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export enum LogCategory {
  STATE = 'state',
  ACTION = 'action',
  MIDDLEWARE = 'middleware',
  PERFORMANCE = 'performance',
  ERROR = 'error'
}

export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  category: LogCategory;
  message: string;
  data?: unknown;
  stack?: string;
}

export interface LoggerOptions {
  enabled?: boolean;
  level?: LogLevel;
  categories?: LogCategory[];
  persist?: boolean;
  maxEntries?: number;
  format?: 'json' | 'text';
}

export class Logger {
  private enabled: boolean;
  private level: LogLevel;
  private categories: Set<LogCategory>;
  private persist: boolean;
  private maxEntries: number;
  private format: 'json' | 'text';
  private entries: LogEntry[] = [];

  constructor(options: LoggerOptions = {}) {
    this.enabled = options.enabled ?? process.env.NODE_ENV === 'development';
    this.level = options.level ?? LogLevel.INFO;
    this.categories = new Set(options.categories ?? Object.values(LogCategory));
    this.persist = options.persist ?? false;
    this.maxEntries = options.maxEntries ?? 1000;
    this.format = options.format ?? 'text';
  }

  private shouldLog(level: LogLevel, category: LogCategory): boolean {
    if (!this.enabled) {
      return false;
    }
    if (!this.categories.has(category)) {
      return false;
    }
    return this.getLevelPriority(level) >= this.getLevelPriority(this.level);
  }

  private getLevelPriority(level: LogLevel): number {
    const priorities = {
      [LogLevel.DEBUG]: 0,
      [LogLevel.INFO]: 1,
      [LogLevel.WARN]: 2,
      [LogLevel.ERROR]: 3
    };
    return priorities[level];
  }

  private createEntry(
    level: LogLevel,
    category: LogCategory,
    message: string,
    data?: unknown
  ): LogEntry {
    return {
      timestamp: Date.now(),
      level,
      category,
      message,
      data,
      stack: level === LogLevel.ERROR ? new Error().stack : undefined
    };
  }

  private formatEntry(entry: LogEntry): string {
    if (this.format === 'json') {
      return JSON.stringify(entry);
    }
    return `[${new Date(entry.timestamp).toISOString()}] [${entry.level.toUpperCase()}] [${entry.category}] ${entry.message}`;
  }

  private log(entry: LogEntry): void {
    if (!this.shouldLog(entry.level, entry.category)) {
      return;
    }

    if (this.persist) {
      this.entries.push(entry);
      if (this.entries.length > this.maxEntries) {
        this.entries.shift();
      }
    }

    const formattedMessage = this.formatEntry(entry);
    /* eslint-disable no-console */
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, entry.data);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, entry.data);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, entry.data);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage, entry.data);
        break;
    }
    /* eslint-enable no-console */
  }

  debug(category: LogCategory, message: string, data?: unknown): void {
    this.log(this.createEntry(LogLevel.DEBUG, category, message, data));
  }

  info(category: LogCategory, message: string, data?: unknown): void {
    this.log(this.createEntry(LogLevel.INFO, category, message, data));
  }

  warn(category: LogCategory, message: string, data?: unknown): void {
    this.log(this.createEntry(LogLevel.WARN, category, message, data));
  }

  error(category: LogCategory, message: string, data?: unknown): void {
    this.log(this.createEntry(LogLevel.ERROR, category, message, data));
  }

  // Specialized logging methods for common use cases
  logAction(action: unknown, prevState: unknown, nextState: unknown): void {
    this.info(LogCategory.ACTION, `Action: ${(action as { type: string }).type}`, {
      action,
      prevState,
      nextState
    });
  }

  logStateChange(prevState: unknown, nextState: unknown): void {
    this.debug(LogCategory.STATE, 'State changed', {
      prevState,
      nextState
    });
  }

  logMiddleware(middlewareName: string, action: unknown): void {
    this.debug(LogCategory.MIDDLEWARE, `Middleware: ${middlewareName}`, {
      action
    });
  }

  logPerformance(operation: string, duration: number): void {
    this.debug(LogCategory.PERFORMANCE, `Operation: ${operation}`, {
      duration
    });
  }

  // Utility methods
  getEntries(): LogEntry[] {
    return [...this.entries];
  }

  clearEntries(): void {
    this.entries = [];
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  setCategories(categories: LogCategory[]): void {
    this.categories = new Set(categories);
  }

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }
}

// Create default logger instance
export const logger = new Logger({
  enabled: process.env.NODE_ENV === 'development',
  level: LogLevel.INFO,
  categories: Object.values(LogCategory),
  persist: true,
  maxEntries: 1000,
  format: 'text'
}); 