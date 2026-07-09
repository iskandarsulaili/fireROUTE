import type { CategoryAdapter } from '../types/adapter.js';
import { WeatherAdapter } from './weather-adapter.js';
import { EmailAdapter } from './email-adapter.js';
import { GamesAdapter } from './games-adapter.js';
import { PersonalityAdapter } from './personality-adapter.js';
import { ArtAdapter } from './art-adapter.js';
import { BooksAdapter } from './books-adapter.js';
import { ScienceAdapter } from './science-adapter.js';
import { DictionaryAdapter } from './dictionary-adapter.js';
import { EnvironmentAdapter } from './environment-adapter.js';
import { MusicAdapter } from './music-adapter.js';
import { EntertainmentAdapter } from './entertainment-adapter.js';
import { TransportationAdapter } from './transportation-adapter.js';
import type { Logger } from './base-adapter.js';

/**
 * Registry of all category adapters.
 * Each category slug maps to its adapter instance.
 */
class AdapterRegistry {
  private readonly adapters: Map<string, CategoryAdapter> = new Map();

  constructor(logger?: Logger) {
    this.register(new WeatherAdapter(logger));
    this.register(new EmailAdapter(logger));
    this.register(new GamesAdapter(logger));
    this.register(new PersonalityAdapter(logger));
    this.register(new ArtAdapter(logger));
    this.register(new BooksAdapter(logger));
    this.register(new ScienceAdapter(logger));
    this.register(new DictionaryAdapter(logger));
    this.register(new EnvironmentAdapter(logger));
    this.register(new MusicAdapter(logger));
    this.register(new EntertainmentAdapter(logger));
    this.register(new TransportationAdapter(logger));
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
