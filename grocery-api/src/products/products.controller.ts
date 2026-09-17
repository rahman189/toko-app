import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserRole } from '../generated/prisma/enums.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

import { ProductsService } from './products.service.js';

import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

import { CreateProductVariantDto } from './dto/create-product-variant.dto.js';

import { UpdateProductVariantDto } from './dto/update-product-variant.dto.js';

import { ProductQueryDto } from './dto/product-query.dto.js';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get products',
  })
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get product by ID',
  })
  findById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Get('variants/sku/:sku')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Find product variant by SKU',
  })
  findVariantBySku(@Param('sku') sku: string) {
    return this.productsService.findVariantBySku(sku);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({
    summary: 'Create product',
  })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Post(':productId/variants')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({
    summary: 'Create product variant',
  })
  createVariant(
    @Param('productId')
    productId: string,

    @Body()
    dto: CreateProductVariantDto,
  ) {
    return this.productsService.createVariant(productId, dto);
  }

  @Patch(':productId/variants/:variantId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({
    summary: 'Update product variant',
  })
  updateVariant(
    @Param('variantId')
    variantId: string,

    @Body()
    dto: UpdateProductVariantDto,
  ) {
    return this.productsService.updateVariant(variantId, dto);
  }

  @Delete('variants/:variantId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Deactivate product variant',
  })
  removeVariant(
    @Param('variantId')
    variantId: string,
  ) {
    return this.productsService.removeVariant(variantId);
  }
}
