export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface ApiErrorResponse {
  statusCode?: number
  message?: string | string[]
  error?: string
}

export type SortOrder = 'asc' | 'desc'

export interface SortParams {
  sortBy?: string
  sortOrder?: SortOrder
}