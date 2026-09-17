import type { SortOrder } from '~/types/api'
import type {
  Category,
  CategoryListResponse,
  CategorySortBy,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '~/types/category'

export function useCategory() {
  const api = useApi()

  const categories = ref<Category[]>([])

  const meta = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  const loading = ref(false)

  async function fetchCategories(
    page = 1,
    limit = 10,
    search = '',
    isActive?: boolean,
    sortBy: CategorySortBy = 'name',
    sortOrder: SortOrder = 'asc',
  ) {
    loading.value = true

    try {
      const response =
        await api<CategoryListResponse>(
          '/categories',
          {
            query: {
              page,
              limit,
              search: search || undefined,
              isActive,
              sortBy,
              sortOrder,
            },
          },
        )

      categories.value = response.data
      meta.value = response.meta

      return response
    } finally {
      loading.value = false
    }
  }

  async function createCategory(
    payload: CreateCategoryDto,
  ) {
    return await api<Category>(
      '/categories',
      {
        method: 'POST',
        body: payload,
      },
    )
  }

  async function updateCategory(
    id: string,
    payload: UpdateCategoryDto,
  ) {
    return await api<Category>(
      `/categories/${id}`,
      {
        method: 'PATCH',
        body: payload,
      },
    )
  }

  async function deleteCategory(id: string) {
    return await api(
      `/categories/${id}`,
      {
        method: 'DELETE',
      },
    )
  }

  return {
    categories,
    meta,
    loading,

    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}