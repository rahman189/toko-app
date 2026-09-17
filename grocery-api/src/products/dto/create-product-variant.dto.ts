import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductVariantDto {
  @ApiProperty({
    example: 'Aqua 600ml',
  })
  @IsString()
  @IsNotEmpty()
  variantName: string;

  @ApiProperty({
    example: 'AQUA-600',
  })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiPropertyOptional({
    example: '8999999999999',
  })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiProperty({
    example: 5000,
  })
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    example: 3500,
  })
  @IsOptional()
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @Min(0)
  costPrice?: number;

  @ApiPropertyOptional({
    example: 100,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({
    example: {
      volume: '600ml',
      flavor: 'Original',
    },
  })
  @IsOptional()
  @IsObject()
  attributes?: Record<string, unknown>;

  @ApiPropertyOptional({
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
