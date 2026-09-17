import type { PaginatedResponse } from "./api"

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreateCategoryDto {
  name: string
  description?: string
}

export interface UpdateCategoryDto {
  name: string
  description?: string
  isActive?: boolean
}

// for now let use name only

export type CategorySortBy =
  | 'name'
  | 'createdAt'

export type CategoryListResponse =
  PaginatedResponse<Category>