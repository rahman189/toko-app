import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Aqua',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({
    example: 'Air mineral dalam kemasan',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'category-uuid',
  })
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional({
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}