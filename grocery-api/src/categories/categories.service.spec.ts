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

import { CategoriesService } from './categories.service.js';

describe('CategoriesService', () => {
  let service: CategoriesService;

  const prismaMock = {
    category: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          CategoriesService,

          {
            provide: PrismaService,
            useValue: prismaMock,
          },
        ],
      }).compile();

    service =
      module.get<CategoriesService>(
        CategoriesService,
      );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create category', async () => {
      prismaMock.category.findFirst.mockResolvedValue(
        null,
      );

      const category = {
        id: 'category-1',
        name: 'Minuman',
        slug: 'minuman',
        isActive: true,
      };

      prismaMock.category.create.mockResolvedValue(
        category,
      );

      const result =
        await service.create({
          name: 'Minuman',
        });

      expect(result).toEqual(
        category,
      );

      expect(
        prismaMock.category.create,
      ).toHaveBeenCalledWith({
        data: {
          name: 'Minuman',
          slug: 'minuman',
        },
      });
    });

    it('should reject duplicate category', async () => {
      prismaMock.category.findFirst.mockResolvedValue(
        {
          id: 'category-1',
          name: 'Minuman',
          slug: 'minuman',
        },
      );

      await expect(
        service.create({
          name: 'Minuman',
        }),
      ).rejects.toBeInstanceOf(
        ConflictException,
      );

      expect(
        prismaMock.category.create,
      ).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return category', async () => {
      const category = {
        id: 'category-1',
        name: 'Minuman',
      };

      prismaMock.category.findUnique.mockResolvedValue(
        category,
      );

      const result =
        await service.findById(
          'category-1',
        );

      expect(result).toEqual(
        category,
      );
    });

    it('should throw when category does not exist', async () => {
      prismaMock.category.findUnique.mockResolvedValue(
        null,
      );

      await expect(
        service.findById(
          'invalid-id',
        ),
      ).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should deactivate category', async () => {
      prismaMock.category.findUnique.mockResolvedValue(
        {
          id: 'category-1',
          name: 'Minuman',
          isActive: true,
        },
      );

      prismaMock.category.update.mockResolvedValue(
        {
          id: 'category-1',
          isActive: false,
        },
      );

      const result =
        await service.remove(
          'category-1',
        );

      expect(result).toEqual({
        message:
          'Category deactivated successfully',
        isActive: false
      });

      expect(
        prismaMock.category.update,
      ).toHaveBeenCalledWith({
        where: {
          id: 'category-1',
        },
        data: {
          isActive: false,
        },
      });
    });
  });
});