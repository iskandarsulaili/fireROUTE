import pino from 'pino';

import { prisma } from './prisma.js';
import { ProviderHealthStatus } from '../../types/category.js';
import type { ProviderConnection } from '../../types/category.js';

const logger = pino({ name: 'db.provider-repo', level: 'debug' });

function toDomain(model: any): ProviderConnection {
  const authConfig = deserializeJson(model?.authConfig, 'authConfig');
  const metadata = deserializeJson(model?.metadata, 'metadata');
  return {
    id: model?.id ?? '',
    categoryId: model?.categoryId ?? '',
    category: model?.category ? {
      id: model?.category?.id ?? '',
      slug: model?.category?.slug ?? '',
      name: model?.category?.name ?? '',
      description: model?.category?.description ?? null,
      createdAt: model?.category?.createdAt ?? new Date(0),
      updatedAt: model?.category?.updatedAt ?? new Date(0),
    } : undefined,
    name: model?.name ?? '',
    slug: model?.slug ?? '',
    baseUrl: model?.baseUrl ?? '',
    authType: model?.authType ?? 'no_auth',
    authConfig,
    healthStatus: model?.healthStatus ?? ProviderHealthStatus.HEALTHY,
    failureCount: model?.failureCount ?? 0,
    cooldownUntil: model?.cooldownUntil ?? null,
    lastProbedAt: model?.lastProbedAt ?? null,
    priority: model?.priority ?? 0,
    isActive: model?.isActive ?? true,
    rateLimitPerMinute: model?.rateLimitPerMinute ?? 60,
    timeoutMs: model?.timeoutMs ?? 3000,
    metadata,
    createdAt: model?.createdAt ?? new Date(0),
    updatedAt: model?.updatedAt ?? new Date(0),
  };
}

function deserializeJson(
  value: unknown,
  field: string,
): Record<string, unknown> | null {
  if (value == null) {
    return null;
  }
  if (typeof value === 'object') {
    return value as Record<string, unknown>;
  }
  if (typeof value !== 'string') {
    logger.warn({ field, valueType: typeof value }, 'Unexpected JSON field type; returning null');
    return null;
  }
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch (error) {
    logger.warn({ err: error, field }, 'Failed to parse JSON field; returning null');
    return null;
  }
}

function serializeJson(value: Record<string, unknown> | null | undefined): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return JSON.stringify(value);
}

export interface CreateProviderInput {
  categorySlug: string;
  name: string;
  slug: string;
  baseUrl: string;
  authType: string;
  authConfig?: Record<string, unknown>;
  priority?: number;
  rateLimitPerMinute?: number;
  timeoutMs?: number;
  metadata?: Record<string, unknown>;
}

export interface UpdateProviderInput {
  name?: string;
  baseUrl?: string;
  authConfig?: Record<string, unknown>;
  priority?: number;
  isActive?: boolean;
  rateLimitPerMinute?: number;
  timeoutMs?: number;
  metadata?: Record<string, unknown>;
}

export const providerRepo = {
  /** Find providers by category slug, ordered by priority */
  async findByCategory(categorySlug: string): Promise<ProviderConnection[]> {
    try {
      logger.debug({ categorySlug }, 'Finding providers by category');
      const providers = await prisma.providerConnection.findMany({
        where: { category: { slug: categorySlug } },
        orderBy: [{ priority: 'asc' }, { name: 'asc' }],
      });
      return providers.map((provider) => toDomain(provider));
    } catch (error) {
      logger.error({ err: error, categorySlug }, 'Failed to find providers by category');
      throw error;
    }
  },

  /** Find only HEALTHY providers in a category */
  async findHealthyByCategory(categorySlug: string): Promise<ProviderConnection[]> {
    try {
      logger.debug({ categorySlug }, 'Finding healthy providers by category');
      const providers = await prisma.providerConnection.findMany({
        where: {
          category: { slug: categorySlug },
          isActive: true,
          healthStatus: ProviderHealthStatus.HEALTHY,
        },
        orderBy: [{ priority: 'asc' }, { name: 'asc' }],
      });
      return providers.map((provider) => toDomain(provider));
    } catch (error) {
      logger.error(
        { err: error, categorySlug },
        'Failed to find healthy providers by category',
      );
      throw error;
    }
  },

  /** Find provider by slug */
  async findBySlug(slug: string): Promise<ProviderConnection | null> {
    try {
      logger.debug({ slug }, 'Finding provider by slug');
      const provider = await prisma.providerConnection.findUnique({ where: { slug } });
      return provider ? toDomain(provider) : null;
    } catch (error) {
      logger.error({ err: error, slug }, 'Failed to find provider by slug');
      throw error;
    }
  },

  /** Find provider by ID */
  async findById(id: string): Promise<ProviderConnection | null> {
    try {
      logger.debug({ id }, 'Finding provider by ID');
      const provider = await prisma.providerConnection.findUnique({ where: { id } });
      return provider ? toDomain(provider) : null;
    } catch (error) {
      logger.error({ err: error, id }, 'Failed to find provider by ID');
      throw error;
    }
  },

  /** Create a new provider connection */
  async create(data: CreateProviderInput): Promise<ProviderConnection> {
    try {
      logger.info({ slug: data.slug, category: data.categorySlug }, 'Creating provider');
      const created = await prisma.providerConnection.create({
        data: {
          slug: data.slug,
          name: data.name,
          baseUrl: data.baseUrl,
          authType: data.authType,
          authConfig: serializeJson(data.authConfig),
          priority: data.priority ?? 0,
          rateLimitPerMinute: data.rateLimitPerMinute ?? 60,
          timeoutMs: data.timeoutMs ?? 3000,
          metadata: serializeJson(data.metadata),
          category: { connect: { slug: data.categorySlug } },
        },
      });
      return toDomain(created);
    } catch (error) {
      logger.error({ err: error, slug: data.slug }, 'Failed to create provider');
      throw error;
    }
  },

  /** Update provider */
  async update(id: string, data: UpdateProviderInput): Promise<ProviderConnection> {
    try {
      logger.info({ id }, 'Updating provider');
      const updated = await prisma.providerConnection.update({
        where: { id },
        data: {
          name: data.name,
          baseUrl: data.baseUrl,
          authConfig: serializeJson(data.authConfig),
          priority: data.priority,
          isActive: data.isActive,
          rateLimitPerMinute: data.rateLimitPerMinute,
          timeoutMs: data.timeoutMs,
          metadata: serializeJson(data.metadata),
        },
      });
      return toDomain(updated);
    } catch (error) {
      logger.error({ err: error, id }, 'Failed to update provider');
      throw error;
    }
  },

  /** Update provider health status */
  async updateHealthStatus(
    id: string,
    status: ProviderHealthStatus,
    failureCount: number,
    cooldownUntil?: Date | null,
  ): Promise<ProviderConnection> {
    try {
      logger.info({ id, status, failureCount }, 'Updating provider health status');
      const updated = await prisma.providerConnection.update({
        where: { id },
        data: {
          healthStatus: status,
          failureCount,
          cooldownUntil: cooldownUntil ?? null,
          lastProbedAt: new Date(),
        },
      });
      return toDomain(updated);
    } catch (error) {
      logger.error({ err: error, id }, 'Failed to update provider health status');
      throw error;
    }
  },

  /** Increment failure count and potentially degrade */
  async recordFailure(id: string, threshold: number): Promise<ProviderConnection> {
    try {
      logger.warn({ id, threshold }, 'Recording provider failure');
      const updated = await prisma.$transaction(async (tx) => {
        const current = await tx.providerConnection.findUnique({ where: { id } });
        if (!current) {
          throw new Error(`Provider not found: ${id}`);
        }

        const failureCount = (current.failureCount ?? 0) + 1;
        const status =
          failureCount >= threshold
            ? ProviderHealthStatus.DEGRADED
            : current.healthStatus;

        return tx.providerConnection.update({
          where: { id },
          data: {
            failureCount,
            healthStatus: status,
            lastProbedAt: new Date(),
          },
        });
      });

      return toDomain(updated);
    } catch (error) {
      logger.error({ err: error, id }, 'Failed to record provider failure');
      throw error;
    }
  },

  /** Record a successful call (reset failure count, set HEALTHY) */
  async recordSuccess(id: string): Promise<ProviderConnection> {
    try {
      logger.info({ id }, 'Recording provider success');
      const updated = await prisma.providerConnection.update({
        where: { id },
        data: {
          failureCount: 0,
          healthStatus: ProviderHealthStatus.HEALTHY,
          cooldownUntil: null,
          lastProbedAt: new Date(),
        },
      });
      return toDomain(updated);
    } catch (error) {
      logger.error({ err: error, id }, 'Failed to record provider success');
      throw error;
    }
  },

  /** Set a provider as DEGRADED */
  async degrade(id: string, cooldownMinutes: number): Promise<ProviderConnection> {
    try {
      logger.warn({ id, cooldownMinutes }, 'Degrading provider');
      const cooldownUntil = new Date(Date.now() + cooldownMinutes * 60 * 1000);
      const updated = await prisma.providerConnection.update({
        where: { id },
        data: {
          healthStatus: ProviderHealthStatus.DEGRADED,
          cooldownUntil,
          lastProbedAt: new Date(),
        },
      });
      return toDomain(updated);
    } catch (error) {
      logger.error({ err: error, id }, 'Failed to degrade provider');
      throw error;
    }
  },

  /** Set a provider as DEAD */
  async markDead(id: string): Promise<ProviderConnection> {
    try {
      logger.error({ id }, 'Marking provider as dead');
      const updated = await prisma.providerConnection.update({
        where: { id },
        data: {
          healthStatus: ProviderHealthStatus.DEAD,
          cooldownUntil: null,
          lastProbedAt: new Date(),
        },
      });
      return toDomain(updated);
    } catch (error) {
      logger.error({ err: error, id }, 'Failed to mark provider as dead');
      throw error;
    }
  },

  /** Find providers that are in cooldown and due for canary probe */
  async findCanaryCandidates(): Promise<ProviderConnection[]> {
    try {
      const now = new Date();
      logger.debug({ now: now.toISOString() }, 'Finding canary candidates');
      const providers = await prisma.providerConnection.findMany({
        where: {
          healthStatus: ProviderHealthStatus.DEGRADED,
          cooldownUntil: { lte: now },
          isActive: true,
        },
        orderBy: [{ priority: 'asc' }, { name: 'asc' }],
      });
      return providers.map((provider) => toDomain(provider));
    } catch (error) {
      logger.error({ err: error }, 'Failed to find canary candidates');
      throw error;
    }
  },

  /** Delete provider */
  async delete(id: string): Promise<void> {
    try {
      logger.warn({ id }, 'Deleting provider');
      await prisma.providerConnection.delete({ where: { id } });
    } catch (error) {
      logger.error({ err: error, id }, 'Failed to delete provider');
      throw error;
    }
  },
};
