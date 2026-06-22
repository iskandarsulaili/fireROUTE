import pino from 'pino';

import { prisma } from './prisma.js';
import { FallbackStrategy } from '../../types/category.js';
import type { CategoryFallbackConfig } from '../../types/category.js';

const logger = pino({ name: 'db.fallback-config-repo', level: 'debug' });

function toDomain(model: any): CategoryFallbackConfig {
  return {
    id: model?.id ?? '',
    categoryId: model?.categoryId ?? '',
    category: model?.category
      ? {
          id: model?.category?.id ?? '',
          slug: model?.category?.slug ?? '',
          name: model?.category?.name ?? '',
          description: model?.category?.description ?? null,
          createdAt: model?.category?.createdAt ?? new Date(0),
          updatedAt: model?.category?.updatedAt ?? new Date(0),
        }
      : undefined,
    strategy: model?.strategy ?? FallbackStrategy.PRIORITY,
    maxRetries: model?.maxRetries ?? 3,
    retryDelayMs: model?.retryDelayMs ?? 1000,
    timeoutMs: model?.timeoutMs ?? 15000,
    circuitBreakerThreshold: model?.circuitBreakerThreshold ?? 3,
    cooldownMinutes: model?.cooldownMinutes ?? 5,
    canaryIntervalMs: model?.canaryIntervalMs ?? 300000,
    createdAt: model?.createdAt ?? new Date(0),
    updatedAt: model?.updatedAt ?? new Date(0),
  };
}

export interface UpsertFallbackConfig {
  strategy?: string;
  maxRetries?: number;
  retryDelayMs?: number;
  timeoutMs?: number;
  circuitBreakerThreshold?: number;
  cooldownMinutes?: number;
  canaryIntervalMs?: number;
}

export const fallbackConfigRepo = {
  /** Get fallback config for a category */
  async findByCategory(categorySlug: string): Promise<CategoryFallbackConfig | null> {
    try {
      logger.debug({ categorySlug }, 'Finding fallback config by category');
      const config = await prisma.categoryFallbackConfig.findFirst({
        where: { category: { slug: categorySlug } },
      });
      return config ? toDomain(config) : null;
    } catch (error) {
      logger.error(
        { err: error, categorySlug },
        'Failed to find fallback config by category',
      );
      throw error;
    }
  },

  /** Upsert fallback config */
  async upsert(
    categorySlug: string,
    data: UpsertFallbackConfig,
  ): Promise<CategoryFallbackConfig> {
    try {
      logger.info({ categorySlug }, 'Upserting fallback config');

      // First get the category to get its actual ID
      const category = await prisma.providerCategory.findUnique({
        where: { slug: categorySlug },
      });
      if (!category) {
        throw new Error(`Category '${categorySlug}' not found`);
      }

      const defaults = fallbackConfigRepo.getDefaults();
      const resolved = {
        strategy: data.strategy ?? defaults.strategy,
        maxRetries: data.maxRetries ?? defaults.maxRetries,
        retryDelayMs: data.retryDelayMs ?? defaults.retryDelayMs,
        timeoutMs: data.timeoutMs ?? defaults.timeoutMs,
        circuitBreakerThreshold:
          data.circuitBreakerThreshold ?? defaults.circuitBreakerThreshold,
        cooldownMinutes: data.cooldownMinutes ?? defaults.cooldownMinutes,
        canaryIntervalMs: data.canaryIntervalMs ?? defaults.canaryIntervalMs,
      };

      const upserted = await prisma.categoryFallbackConfig.upsert({
        where: { categoryId: category.id },
        create: {
          ...resolved,
          category: { connect: { slug: categorySlug } },
        },
        update: resolved,
      });

      return toDomain(upserted);
    } catch (error) {
      logger.error({ err: error, categorySlug }, 'Failed to upsert fallback config');
      throw error;
    }
  },

  /** Get default fallback config */
  getDefaults(): CategoryFallbackConfig {
    return {
      id: '',
      categoryId: '',
      strategy: FallbackStrategy.PRIORITY,
      maxRetries: 3,
      retryDelayMs: 1000,
      timeoutMs: 15000,
      circuitBreakerThreshold: 3,
      cooldownMinutes: 5,
      canaryIntervalMs: 300000,
      createdAt: new Date(0),
      updatedAt: new Date(0),
    };
  },
};
