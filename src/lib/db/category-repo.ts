import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import pino from 'pino';

import { prisma } from './prisma.js';
import { ProviderHealthStatus } from '../../types/category.js';
import type { ProviderCategory } from '../../types/category.js';

const logger = pino({ name: 'db.category-repo', level: 'debug' });
const API_REFERENCES_DIR = path.resolve(process.cwd(), 'doc/api-references');

// Mapper from Prisma model to domain type
function toDomain(model: any): ProviderCategory {
  return {
    id: model?.id ?? '',
    slug: model?.slug ?? '',
    name: model?.name ?? '',
    description: model?.description ?? null,
    createdAt: model?.createdAt ?? new Date(0),
    updatedAt: model?.updatedAt ?? new Date(0),
  };
}

function toTitleCase(slug: string): string {
  return slug
    .split(/[-_]/g)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

export const categoryRepo = {
  /** Find all categories */
  async findAll(): Promise<ProviderCategory[]> {
    try {
      logger.debug('Finding all provider categories');
      const categories = await prisma.providerCategory.findMany({
        orderBy: { name: 'asc' },
      });
      return categories.map((category) => toDomain(category));
    } catch (error) {
      logger.error({ err: error }, 'Failed to find all provider categories');
      throw error;
    }
  },

  /** Find category by slug */
  async findBySlug(slug: string): Promise<ProviderCategory | null> {
    try {
      logger.debug({ slug }, 'Finding provider category by slug');
      const category = await prisma.providerCategory.findUnique({
        where: { slug },
      });
      return category ? toDomain(category) : null;
    } catch (error) {
      logger.error({ err: error, slug }, 'Failed to find provider category by slug');
      throw error;
    }
  },

  /** Find category by ID */
  async findById(id: string): Promise<ProviderCategory | null> {
    try {
      logger.debug({ id }, 'Finding provider category by ID');
      const category = await prisma.providerCategory.findUnique({
        where: { id },
      });
      return category ? toDomain(category) : null;
    } catch (error) {
      logger.error({ err: error, id }, 'Failed to find provider category by ID');
      throw error;
    }
  },

  /** Create a new category */
  async create(data: {
    slug: string;
    name: string;
    description?: string;
  }): Promise<ProviderCategory> {
    try {
      logger.info({ slug: data.slug }, 'Creating provider category');
      const created = await prisma.providerCategory.create({
        data: {
          slug: data.slug,
          name: data.name,
          description: data.description ?? null,
        },
      });
      return toDomain(created);
    } catch (error) {
      logger.error({ err: error, slug: data.slug }, 'Failed to create provider category');
      throw error;
    }
  },

  /** Update a category */
  async update(
    id: string,
    data: { name?: string; description?: string },
  ): Promise<ProviderCategory> {
    try {
      logger.info({ id }, 'Updating provider category');
      const updated = await prisma.providerCategory.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description ?? undefined,
        },
      });
      return toDomain(updated);
    } catch (error) {
      logger.error({ err: error, id }, 'Failed to update provider category');
      throw error;
    }
  },

  /** Delete a category */
  async delete(id: string): Promise<void> {
    try {
      logger.warn({ id }, 'Deleting provider category');
      await prisma.providerCategory.delete({ where: { id } });
    } catch (error) {
      logger.error({ err: error, id }, 'Failed to delete provider category');
      throw error;
    }
  },

  /** Upsert category (create if not exists, update if exists) */
  async upsert(
    slug: string,
    data: { name: string; description?: string },
  ): Promise<ProviderCategory> {
    try {
      logger.info({ slug }, 'Upserting provider category');
      const upserted = await prisma.providerCategory.upsert({
        where: { slug },
        create: {
          slug,
          name: data.name,
          description: data.description ?? null,
        },
        update: {
          name: data.name,
          description: data.description ?? null,
        },
      });
      return toDomain(upserted);
    } catch (error) {
      logger.error({ err: error, slug }, 'Failed to upsert provider category');
      throw error;
    }
  },

  /** Seed default categories from doc/api-references/ directory */
  async seedFromDirectories(): Promise<number> {
    try {
      logger.info({ dir: API_REFERENCES_DIR }, 'Seeding categories from directories');
      const entries = await readdir(API_REFERENCES_DIR, { withFileTypes: true });
      const candidates = [] as Array<{
        slug: string;
        name: string;
        description: string | null;
      }>;

      for (const entry of entries) {
        if (!entry.isDirectory()) {
          continue;
        }

        const readmePath = path.join(API_REFERENCES_DIR, entry.name, 'README.md');
        try {
          await stat(readmePath);
        } catch {
          logger.debug({ slug: entry.name }, 'Skipping category without README');
          continue;
        }

        candidates.push({
          slug: entry.name,
          name: toTitleCase(entry.name),
          description: null,
        });
      }

      const createdCount = await prisma.$transaction(async (tx) => {
        let created = 0;

        for (const candidate of candidates) {
          const existing = await tx.providerCategory.findUnique({
            where: { slug: candidate.slug },
          });

          if (existing) {
            logger.debug({ slug: candidate.slug }, 'Category already exists');
            continue;
          }

          await tx.providerCategory.create({ data: candidate });
          created += 1;
        }

        return created;
      });

      logger.info({ createdCount }, 'Category seed completed');
      return createdCount;
    } catch (error) {
      logger.error({ err: error }, 'Failed to seed categories from directories');
      throw error;
    }
  },

  /** Get category health summary (counts of healthy/degraded/dead providers) */
  async getCategoryHealthSummary(slug: string): Promise<{
    totalProviders: number;
    healthyProviders: number;
    degradedProviders: number;
    deadProviders: number;
  }> {
    try {
      logger.debug({ slug }, 'Getting category health summary');
      const [totalProviders, healthyProviders, degradedProviders, deadProviders] =
        await prisma.$transaction([
          prisma.providerConnection.count({
            where: { category: { slug } },
          }),
          prisma.providerConnection.count({
            where: {
              category: { slug },
              healthStatus: ProviderHealthStatus.HEALTHY,
            },
          }),
          prisma.providerConnection.count({
            where: {
              category: { slug },
              healthStatus: ProviderHealthStatus.DEGRADED,
            },
          }),
          prisma.providerConnection.count({
            where: { category: { slug }, healthStatus: ProviderHealthStatus.DEAD },
          }),
        ]);

      return {
        totalProviders,
        healthyProviders,
        degradedProviders,
        deadProviders,
      };
    } catch (error) {
      logger.error({ err: error, slug }, 'Failed to get category health summary');
      throw error;
    }
  },
};
