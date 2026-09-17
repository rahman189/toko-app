import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client.js';

import { PrismaService } from '../prisma/prisma.service.js';

import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

import { CreateProductVariantDto } from './dto/create-product-variant.dto.js';

import { UpdateProductVariantDto } from './dto/update-product-variant.dto.js';
import { createPaginationMeta } from '../common/pagination/pagination.js';

import {
  ProductQueryDto,
  ProductSortBy,
  SortOrder,
} from './dto/product-query.dto.js';

@Injectable()
export class ProductsService {
  findVariantByBarcode(arg0: string) {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ProductQueryDto) {
    const page = Math.max(query.page ?? 1, 1);

    const limit = Math.min(Math.max(query.limit ?? 20, 1), 100);

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    /**
     * Active filter
     */
    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    /**
     * Category filter
     */
    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    /**
     * Search
     *
     * Search:
     * - product name
     * - variant name
     * - SKU
     * - barcode
     */
    if (query.search) {
      where.OR = [
        {
          name: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          variants: {
            some: {
              variantName: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          variants: {
            some: {
              sku: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          variants: {
            some: {
              barcode: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
          },
        },
      ];
    }
    
    const variantFilters: Prisma.ProductVariantWhereInput = {};

    const priceFilter = {
      ...(query.minPrice !== undefined
        ? {
            gte: query.minPrice,
          }
        : {}),

      ...(query.maxPrice !== undefined
        ? {
            lte: query.maxPrice,
          }
        : {}),
    };

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      variantFilters.price = priceFilter;
    }

    if (query.inStock !== undefined) {
      variantFilters.stock = query.inStock
        ? {
            gt: 0,
          }
        : {
            equals: 0,
          };
    }

    if (Object.keys(variantFilters).length > 0) {
      where.variants = {
        some: variantFilters,
      };
    }

    /**
     * Sorting
     */
    const sortBy = query.sortBy ?? ProductSortBy.CREATED_AT;

    const sortOrder = query.sortOrder ?? SortOrder.DESC;

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sortBy === ProductSortBy.NAME
        ? {
            name: sortOrder,
          }
        : {
            createdAt: sortOrder,
          };

    /**
     * Execute query concurrently
     */
    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,

        skip,
        take: limit,

        orderBy,

        select: {
          id: true,
          name: true,
          description: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,

          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },

          variants: {
            where: {
              isActive: true,
            },

            orderBy: {
              price: 'asc',
            },

            select: {
              id: true,
              variantName: true,
              sku: true,
              barcode: true,
              price: true,
              stock: true,
              attributes: true,
              isActive: true,
            },
          },
        },
      }),

      this.prisma.product.count({
        where,
      }),
    ]);

    return {
      data,

      meta: createPaginationMeta(page, limit, total),
    };
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },

      include: {
        category: true,

        variants: {
          where: {
            isActive: true,
          },

          orderBy: {
            price: 'asc',
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findVariantBySku(sku: string) {
    const variant = await this.prisma.productVariant.findUnique({
      where: {
        sku,
      },

      select: {
        id: true,
        variantName: true,
        sku: true,
        barcode: true,
        price: true,
        stock: true,
        attributes: true,
        isActive: true,

        product: {
          select: {
            id: true,
            name: true,
            isActive: true,
          },
        },
      },
    });

    if (!variant) {
      throw new NotFoundException('Product variant not found');
    }

    return variant;
  }

  async create(dto: CreateProductDto) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: dto.categoryId,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (!category.isActive) {
      throw new ConflictException('Category is inactive');
    }

    return this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        categoryId: dto.categoryId,
        isActive: dto.isActive
      },

      include: {
        category: true,
        variants: true,
      },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: {
          id: dto.categoryId,
        },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      if (!category.isActive) {
        throw new ConflictException('Category is inactive');
      }
    }

    return this.prisma.product.update({
      where: {
        id,
      },

      data: {
        ...(dto.name !== undefined
          ? {
              name: dto.name,
            }
          : {}),

        ...(dto.description !== undefined
          ? {
              description: dto.description,
            }
          : {}),

        ...(dto.categoryId !== undefined
          ? {
              categoryId: dto.categoryId,
            }
          : {}),

        ...(dto.isActive !== undefined
          ? {
              isActive: dto.isActive,
            }
          : {}),
      },

      include: {
        category: true,
        variants: true,
      },
    });
  }

  async remove(id: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.product.update({
      where: {
        id,
      },

      data: {
        isActive: false,
      },
    });

    await this.prisma.productVariant.updateMany({
      where: {
        productId: id,
      },

      data: {
        isActive: false,
      },
    });

    return {
      message: 'Product deactivated successfully',
    };
  }

  async createVariant(productId: string, dto: CreateProductVariantDto) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existingSku = await this.prisma.productVariant.findUnique({
      where: {
        sku: dto.sku,
      },
    });

    if (existingSku) {
      throw new ConflictException('SKU already exists');
    }

    if (dto.barcode) {
      const existingBarcode = await this.prisma.productVariant.findUnique({
        where: {
          barcode: dto.barcode,
        },
      });

      if (existingBarcode) {
        throw new ConflictException('Barcode already exists');
      }
    }

    return this.prisma.productVariant.create({
      data: {
        productId,

        variantName: dto.variantName,

        sku: dto.sku,

        barcode: dto.barcode,

        price: dto.price,

        costPrice: dto.costPrice,

        stock: dto.stock ?? 0,

        attributes: dto.attributes as Prisma.InputJsonValue,
      },
    });
  }

  async updateVariant(variantId: string, dto: UpdateProductVariantDto) {
    const variant = await this.prisma.productVariant.findUnique({
      where: {
        id: variantId,
      },
    });

    if (!variant) {
      throw new NotFoundException('Product variant not found');
    }

    if (dto.barcode) {
      const existingBarcode = await this.prisma.productVariant.findFirst({
        where: {
          barcode: dto.barcode,

          NOT: {
            id: variantId,
          },
        },
      });

      if (existingBarcode) {
        throw new ConflictException('Barcode already exists');
      }
    }

    return this.prisma.productVariant.update({
      where: {
        id: variantId,
      },

      data: {
        ...(dto.variantName !== undefined
          ? {
              variantName: dto.variantName,
            }
          : {}),

        ...(dto.barcode !== undefined
          ? {
              barcode: dto.barcode,
            }
          : {}),

        ...(dto.price !== undefined
          ? {
              price: dto.price,
            }
          : {}),

        ...(dto.costPrice !== undefined
          ? {
              costPrice: dto.costPrice,
            }
          : {}),

        ...(dto.stock !== undefined
          ? {
              stock: dto.stock,
            }
          : {}),

        ...(dto.attributes !== undefined
          ? {
              attributes: dto.attributes as Prisma.InputJsonValue,
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

  async removeVariant(variantId: string) {
    const variant = await this.prisma.productVariant.findUnique({
      where: {
        id: variantId,
      },
    });

    if (!variant) {
      throw new NotFoundException('Product variant not found');
    }

    await this.prisma.productVariant.update({
      where: {
        id: variantId,
      },

      data: {
        isActive: false,
      },
    });

    return {
      message: 'Product variant deactivated successfully',
    };
  }
}
