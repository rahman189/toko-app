import type { PaginatedResponse } from './api'
import type { Category } from './category'
import type { ProductVariant } from './product-variant'

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  categoryId: string
  category?: Category
  imageUrl?: string | null
  isActive: boolean
  variants?: ProductVariant[]
  createdAt: string
  updatedAt: string
}

export interface CreateProductDto {
  name: string
  description?: string
  categoryId: string
  imageUrl?: string
  isActive?: boolean
}

export interface UpdateProductDto {
  name: string
  description?: string
  categoryId: string
  imageUrl?: string
  isActive?: boolean
}

// for now let use name only

export type ProductSortBy =
  | 'name'
  | 'createdAt'

export type ProductListResponse =
  PaginatedResponse<Product>