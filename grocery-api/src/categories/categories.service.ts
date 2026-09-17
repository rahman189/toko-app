import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { CategoryQueryDto, CategorySortBy, SortOrder } from './dto/category-query.dto.js';
import { Prisma } from '../generated/prisma/client.js';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll(query: CategoryQueryDto) {
    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.min(
      Math.max(query.limit ?? 20, 1),
      100,
    );

    const skip = (page - 1) * limit;

    const where = {
      ...(query.search
        ? {
            name: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          }
        : {}),

      ...(query.isActive !== undefined
        ? {
            isActive: query.isActive,
          }
        : {}),
    };

    const sortBy = query.sortBy ?? CategorySortBy.CREATED_AT;
    const sortOrder = query.sortOrder ?? SortOrder.DESC;

    const orderBy: Prisma.CategoryOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const [data, total] =
      await Promise.all([
        this.prisma.category.findMany({
          where,
          skip,
          take: limit,
          orderBy,
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,

            _count: {
              select: {
                products: true,
              },
            },
          },
        }),

        this.prisma.category.count({
          where,
        }),
      ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const category =
      await this.prisma.category.findUnique({
        where: {
          id,
        },

        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
      });

    if (!category) {
      throw new NotFoundException(
        'Category not found',
      );
    }

    return category;
  }

  async create(dto: CreateCategoryDto) {
    const slug = this.generateSlug(dto.name);

    const existing =
      await this.prisma.category.findFirst({
        where: {
          OR: [
            {
              name: {
                equals: dto.name,
                mode: 'insensitive',
              },
            },
            {
              slug,
            },
          ],
        },
      });

    if (existing) {
      throw new ConflictException(
        'Category already exists',
      );
    }

    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description
      },
    });
  }

  async update(
    id: string,
    dto: UpdateCategoryDto,
  ) {
    const category =
      await this.prisma.category.findUnique({
        where: {
          id,
        },
      });

    if (!category) {
      throw new NotFoundException(
        'Category not found',
      );
    }

    let slug: string | undefined;

    if (
      dto.name &&
      dto.name !== category.name
    ) {
      slug = this.generateSlug(dto.name);

      const existing =
        await this.prisma.category.findFirst({
          where: {
            OR: [
              {
                name: {
                  equals: dto.name,
                  mode: 'insensitive',
                },
              },
              {
                slug,
              },
            ],
            NOT: {
              id,
            },
          },
        });

      if (existing) {
        throw new ConflictException(
          'Category already exists',
        );
      }
    }

    return this.prisma.category.update({
      where: {
        id,
      },

      data: {
        ...(dto.name
          ? {
              name: dto.name,
            }
          : {}),

        ...(slug
          ? {
              slug,
            }
          : {}),
        
        ...(dto.description
          ? {
              description: dto.description,
            }
          : {}),

        ...(dto.isActive !== undefined
          ? {
              isActive: dto.isActive,
            }
          : {}),
      },
    });
  }

  async remove(id: string) {
    const category =
      await this.prisma.category.findUnique({
        where: {
          id,
        },
      });

    if (!category) {
      throw new NotFoundException(
        'Category not found',
      );
    }

    await this.prisma.category.update({
      where: {
        id,
      },

      data: {
        isActive: false,
      },
    });

    return {
      message: 'Category deactivated successfully',
      isActive: false,
    };
  }

  private generateSlug(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}