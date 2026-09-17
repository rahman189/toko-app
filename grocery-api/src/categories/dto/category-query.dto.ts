import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export enum CategorySortBy {
  NAME = 'name',
  CREATED_AT = 'createdAt',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class CategoryQueryDto {
  @ApiPropertyOptional({
    example: 'minum',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: true,
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
    enum: CategorySortBy,
    default: CategorySortBy.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(CategorySortBy)
  sortBy?: CategorySortBy;

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
  page?: number;

  @ApiPropertyOptional({
    example: 20,
    default: 20,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  limit?: number;
}