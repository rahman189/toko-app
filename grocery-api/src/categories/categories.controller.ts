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

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { UserRole } from '../generated/prisma/enums.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

import { CategoriesService } from './categories.service.js';

import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { CategoryQueryDto } from './dto/category-query.dto.js';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get categories',
  })
  findAll(
    @Query() query: CategoryQueryDto,
  ) {
    return this.categoriesService.findAll(
      query,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get category by ID',
  })
  findById(
    @Param('id') id: string,
  ) {
    return this.categoriesService.findById(
      id,
    );
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(
    UserRole.ADMIN,
    UserRole.STAFF,
  )
  @ApiOperation({
    summary: 'Create category',
  })
  create(
    @Body() dto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(
      dto,
    );
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(
    UserRole.ADMIN,
    UserRole.STAFF,
  )
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(
      id,
      dto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(UserRole.ADMIN)
  remove(
    @Param('id') id: string,
  ) {
    return this.categoriesService.remove(
      id,
    );
  }
}