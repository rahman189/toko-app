import type { SortOrder } from '~/types/api'
import type {
  Product,
  ProductListResponse,
  CreateProductDto,
  UpdateProductDto,
  ProductSortBy,
} from '~/types/product'

import type {
  ProductVariant,
  CreateProductVariantDto,
  UpdateProductVariantDto,
} from '~/types/product-variant'

export function useProduct() {
  const api = useApi()

  const products = ref<Product[]>([])
  const product = ref<Product>()

  const meta = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  const loading = ref(false)

  async function fetchProducts(
    page = 1,
    limit = 10,
    search = '',
    categoryId?: string,
    isActive?: boolean,
    sortBy: ProductSortBy = 'name',
    sortOrder: SortOrder = 'asc',
  ) {
    loading.value = true

    try {
      const response =
        await api<ProductListResponse>(
          '/products',
          {
            query: {
              page,
              limit,
              search: search || undefined,
              categoryId,
              isActive,
              sortBy,
              sortOrder,
            },
          },
        )

      products.value = response.data
      meta.value = response.meta

      return response
    } finally {
      loading.value = false
    }
  }

  async function fetchProduct(id: string) {
    loading.value = true

    try {
      product.value =
        await api<Product>(
          `/products/${id}`,
        )

      return product.value
    } finally {
      loading.value = false
    }
  }

  async function createProduct(
    payload: CreateProductDto,
  ) {
    return await api<Product>(
      '/products',
      {
        method: 'POST',
        body: payload,
      },
    )
  }

  async function updateProduct(
    id: string,
    payload: UpdateProductDto,
  ) {
    return await api<Product>(
      `/products/${id}`,
      {
        method: 'PATCH',
        body: payload,
      },
    )
  }

  async function deleteProduct(id: string) {
    return await api(
      `/products/${id}`,
      {
        method: 'DELETE',
      },
    )
  }

  async function createVariant(
    productId: string,
    payload: CreateProductVariantDto,
  ) {
    return await api<ProductVariant>(
      `/products/${productId}/variants`,
      {
        method: 'POST',
        body: payload,
      },
    )
  }

  async function updateVariant(
    productId: string,
    variantId: string,
    payload: UpdateProductVariantDto,
  ) {
    return await api<ProductVariant>(
      `/products/${productId}/variants/${variantId}`,
      {
        method: 'PATCH',
        body: payload,
      },
    )
  }

  async function deleteVariant(
    productId: string,
    variantId: string,
  ) {
    return await api(
      `/products/${productId}/variants/${variantId}`,
      {
        method: 'DELETE',
      },
    )
  }

  return {
    products,
    product,
    meta,
    loading,

    fetchProducts,
    fetchProduct,

    createProduct,
    updateProduct,
    deleteProduct,

    createVariant,
    updateVariant,
    deleteVariant,
  }
}