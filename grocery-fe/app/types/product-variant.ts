import type { Product } from './product'

export interface ProductVariant {
  id: string
  productId: string
  variantName: string
  sku: string
  barcode?: string | null
  costPrice: number
  price: number
  attributes?: Record<string, unknown>
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateProductVariantDto {
  variantName: string
  sku: string
  barcode?: string
  costPrice: number
  price: number
  attributes?: Record<string, unknown>
  isActive: boolean
}

export interface UpdateProductVariantDto {
  variantName: string
  barcode?: string
  costPrice: number
  price: number
  attributes?: Record<string, unknown>
  isActive: boolean
}