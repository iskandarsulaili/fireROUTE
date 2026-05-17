import type { CategoryAdapter } from '../types/adapter.js';
import { WeatherAdapter } from './weather-adapter.js';
import type { Logger } from './base-adapter.js';

/**
 * Registry of all category adapters.
 * Each category slug maps to its adapter instance.
 * Add new adapters here as categories are implemented.
 */
class AdapterRegistry {
  private readonly adapters: Map<string, CategoryAdapter> = new Map();

  constructor(logger?: Logger) {
    this.register(logger ? new WeatherAdapter(logger) : new WeatherAdapter());
  }

  /** Register a category adapter. */
  register(adapter: CategoryAdapter): void {
    if (this.adapters.has(adapter.categorySlug)) {
      throw new Error(`Adapter for category '${adapter.categorySlug}' is already registered`);
    }
    this.adapters.set(adapter.categorySlug, adapter);
  }

  /** Get adapter for a category slug. */
  get(categorySlug: string): CategoryAdapter | undefined {
    return this.adapters.get(categorySlug);
  }

  /** Check if a category has an adapter. */
  has(categorySlug: string): boolean {
    return this.adapters.has(categorySlug);
  }

  /** Get all registered category slugs. */
  getCategories(): string[] {
    return Array.from(this.adapters.keys());
  }

  /** Get all registered adapters. */
  getAll(): CategoryAdapter[] {
    return Array.from(this.adapters.values());
  }
}

export const adapterRegistry = new AdapterRegistry();
