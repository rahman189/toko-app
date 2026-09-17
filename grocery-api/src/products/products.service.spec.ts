import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { PrismaService } from '../prisma/prisma.service.js';

import { ProductsService } from './products.service.js';

import {
  ProductSortBy,
  SortOrder,
} from './dto/product-query.dto.js';

describe('ProductsService', () => {
  let service: ProductsService;

  const prismaMock = {
    product: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },

    productVariant: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },

    category: {
      findUnique: vi.fn(),
    },
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          ProductsService,

          {
            provide: PrismaService,
            useValue: prismaMock,
          },
        ],
      }).compile();

    service =
      module.get<ProductsService>(
        ProductsService,
      );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const products = [
        {
          id: 'product-1',
          name: 'Aqua',
          brand: 'Aqua',
          description: 'Air mineral',
          isActive: true,

          category: {
            id: 'category-1',
            name: 'Minuman',
            slug: 'minuman',
          },

          variants: [
            {
              id: 'variant-1',
              variantName: 'Aqua 600ml',
              sku: 'AQUA-600',
              barcode: '899000000001',
              price: '5000',
              stock: 100,
              attributes: {
                volume: '600ml',
              },
              isActive: true,
            },
          ],
        },
      ];

      prismaMock.product.findMany.mockResolvedValue(
        products,
      );

      prismaMock.product.count.mockResolvedValue(
        1,
      );

      const result =
        await service.findAll({
          page: 1,
          limit: 20,
        });

      expect(result.data).toEqual(
        products,
      );

      expect(result.meta).toEqual({
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      });
    });

    it('should use default pagination', async () => {
      prismaMock.product.findMany.mockResolvedValue(
        [],
      );

      prismaMock.product.count.mockResolvedValue(
        0,
      );

      const result =
        await service.findAll({});

      expect(result.meta).toEqual({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      });

      expect(
        prismaMock.product.findMany,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 20,
        }),
      );
    });

    it('should calculate pagination offset', async () => {
      prismaMock.product.findMany.mockResolvedValue(
        [],
      );

      prismaMock.product.count.mockResolvedValue(
        45,
      );

      const result =
        await service.findAll({
          page: 2,
          limit: 20,
        });

      expect(
        prismaMock.product.findMany,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 20,
          take: 20,
        }),
      );

      expect(result.meta).toEqual({
        page: 2,
        limit: 20,
        total: 45,
        totalPages: 3,
      });
    });

    it('should build search filter', async () => {
      prismaMock.product.findMany.mockResolvedValue(
        [],
      );

      prismaMock.product.count.mockResolvedValue(
        0,
      );

      await service.findAll({
        search: 'aqua',
      });

      expect(
        prismaMock.product.findMany,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({
                name: {
                  contains: 'aqua',
                  mode: 'insensitive',
                },
              }),
            ]),
          }),
        }),
      );
    });

    it('should filter by category', async () => {
      prismaMock.product.findMany.mockResolvedValue(
        [],
      );

      prismaMock.product.count.mockResolvedValue(
        0,
      );

      await service.findAll({
        categoryId: 'category-1',
      });

      expect(
        prismaMock.product.findMany,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            categoryId: 'category-1',
          }),
        }),
      );
    });

    it('should filter variants by price range', async () => {
      prismaMock.product.findMany.mockResolvedValue(
        [],
      );

      prismaMock.product.count.mockResolvedValue(
        0,
      );

      await service.findAll({
        minPrice: 5000,
        maxPrice: 10000,
      });

      expect(
        prismaMock.product.findMany,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            variants: {
              some: {
                price: {
                  gte: 5000,
                  lte: 10000,
                },
              },
            },
          }),
        }),
      );
    });

    it('should filter products in stock', async () => {
      prismaMock.product.findMany.mockResolvedValue(
        [],
      );

      prismaMock.product.count.mockResolvedValue(
        0,
      );

      await service.findAll({
        inStock: true,
      });

      expect(
        prismaMock.product.findMany,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            variants: {
              some: {
                stock: {
                  gt: 0,
                },
              },
            },
          }),
        }),
      );
    });

    it('should combine price and stock filters', async () => {
      prismaMock.product.findMany.mockResolvedValue(
        [],
      );

      prismaMock.product.count.mockResolvedValue(
        0,
      );

      await service.findAll({
        minPrice: 5000,
        maxPrice: 10000,
        inStock: true,
      });

      expect(
        prismaMock.product.findMany,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            variants: {
              some: {
                price: {
                  gte: 5000,
                  lte: 10000,
                },
                stock: {
                  gt: 0,
                },
              },
            },
          }),
        }),
      );
    });

    it('should sort by name ascending', async () => {
      prismaMock.product.findMany.mockResolvedValue(
        [],
      );

      prismaMock.product.count.mockResolvedValue(
        0,
      );

      await service.findAll({
        sortBy: ProductSortBy.NAME,
        sortOrder: SortOrder.ASC,
      });

      expect(
        prismaMock.product.findMany,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: {
            name: 'asc',
          },
        }),
      );
    });
  });

  describe('findById', () => {
    it('should return product', async () => {
      const product = {
        id: 'product-1',
        name: 'Aqua',
      };

      prismaMock.product.findUnique.mockResolvedValue(
        product,
      );

      const result =
        await service.findById(
          'product-1',
        );

      expect(result).toEqual(product);
    });

    it('should throw NotFoundException', async () => {
      prismaMock.product.findUnique.mockResolvedValue(
        null,
      );

      await expect(
        service.findById('invalid-id'),
      ).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create product', async () => {
      prismaMock.category.findUnique.mockResolvedValue(
        {
          id: 'category-1',
          name: 'Minuman',
          isActive: true,
        },
      );

      const createdProduct = {
        id: 'product-1',
        name: 'Aqua',
        categoryId: 'category-1',
      };

      prismaMock.product.create.mockResolvedValue(
        createdProduct,
      );

      const result =
        await service.create({
          name: 'Aqua',
          categoryId: 'category-1',
        });

      expect(result).toEqual(
        createdProduct,
      );

      expect(
        prismaMock.product.create,
      ).toHaveBeenCalledTimes(1);
    });

    it('should reject unknown category', async () => {
      prismaMock.category.findUnique.mockResolvedValue(
        null,
      );

      await expect(
        service.create({
          name: 'Aqua',
          categoryId: 'category-1',
        }),
      ).rejects.toBeInstanceOf(
        NotFoundException,
      );

      expect(
        prismaMock.product.create,
      ).not.toHaveBeenCalled();
    });

    it('should reject inactive category', async () => {
      prismaMock.category.findUnique.mockResolvedValue(
        {
          id: 'category-1',
          name: 'Minuman',
          isActive: false,
        },
      );

      await expect(
        service.create({
          name: 'Aqua',
          categoryId: 'category-1',
        }),
      ).rejects.toBeInstanceOf(
        ConflictException,
      );
    });
  });

  describe('createVariant', () => {
    it('should reject duplicate SKU', async () => {
      prismaMock.product.findUnique.mockResolvedValue(
        {
          id: 'product-1',
          name: 'Aqua',
        },
      );

      prismaMock.productVariant.findUnique.mockResolvedValue(
        {
          id: 'variant-existing',
          sku: 'AQUA-600',
        },
      );

      await expect(
        service.createVariant(
          'product-1',
          {
            variantName: 'Aqua 600ml',
            sku: 'AQUA-600',
            price: 5000,
            stock: 100,
          },
        ),
      ).rejects.toBeInstanceOf(
        ConflictException,
      );

      expect(
        prismaMock.productVariant.create,
      ).not.toHaveBeenCalled();
    });
  });
});