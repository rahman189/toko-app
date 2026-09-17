import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export enum ProductSortBy {
  NAME = 'name',
  CREATED_AT = 'createdAt',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class ProductQueryDto {
  @ApiPropertyOptional({
    example: 'aqua',
    description:
      'Search product name, brand, variant name, SKU, or barcode',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim()
      : value,
  )
  search?: string;

  @ApiPropertyOptional({
    example: 'uuid',
    description: 'Filter by category',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    example: 'Aqua',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim()
      : value,
  )
  brand?: string;

  @ApiPropertyOptional({
    example: 3000,
    description: 'Minimum variant price',
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    example: 10000,
    description: 'Maximum variant price',
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    example: true,
    description:
      'Only products that have at least one variant in stock',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;

    return value;
  })
  @IsBoolean()
  inStock?: boolean;

  @ApiPropertyOptional({
    example: true,
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;

    return value;
  })
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    enum: ProductSortBy,
    default: ProductSortBy.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(ProductSortBy)
  sortBy?: ProductSortBy;

  @ApiPropertyOptional({
    enum: SortOrder,
    default: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;

  @ApiPropertyOptional({
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    example: 20,
    default: 20,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}