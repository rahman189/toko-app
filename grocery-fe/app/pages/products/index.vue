<script setup lang="ts">
import { ref } from 'vue';
import { Plus, Search } from 'lucide-vue-next';

import type { SelectOption } from '~/components/base/Select.vue';

import type { Product, ProductSortBy } from '~/types/product';
import type { SortOrder } from '~/types/api';

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
});

const { products, meta, loading, fetchProducts, deleteProduct } = useProduct();

const { categories, fetchCategories } = useCategory();

const { isAdmin } = usePermission();

const toast = useToast();

const showDelete = ref(false);

const deletingProduct = ref<Product | null>(null);

const deleting = ref(false);

const categoryOptions = computed(() => [
  {
    label: 'Semua Kategori',
    value: 'all',
  },

  ...categories.value.map((category) => ({
    label: category.name,
    value: category.id,
  })),
]);

const route = useRoute();
const router = useRouter();

const currentPage = ref(Number(route.query.page) || 1);

const pageSize = ref(Number(route.query.limit) || 10);

const search = ref(
  typeof route.query.search === 'string' ? route.query.search : '',
);

const categoryId = ref(
  typeof route.query.categoryId === 'string' ? route.query.categoryId : 'all',
);

const sortBy = ref<ProductSortBy>(
  route.query.sortBy === 'name' ? route.query.sortBy
    : 'name',
);

const sortOrder = ref<SortOrder>(
  route.query.sortOrder === 'asc' ? 'asc' : 'desc',
);

const statusOptions = ref<SelectOption[]>([
  {
    label: 'Semua Status',
    value: 'all',
  },
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Inactive',
    value: 'inactive',
  },
]);

const status = ref<'all' | 'active' | 'inactive'>(
  route.query.status === 'active' || route.query.status === 'inactive'
    ? route.query.status
    : 'all',
);

async function loadProducts() {
  const isActive =
    status.value === 'all' ? undefined : status.value === 'active';
  const category = categoryId.value === 'all' ? undefined : categoryId.value;

  try {
    await fetchProducts(
      currentPage.value,
      pageSize.value,
      search.value,
      category,
      isActive,
      sortBy.value,
      sortOrder.value,
    );
    updateQuery();
  } catch (error) {
    console.error(error);
    toast.error('Gagal memuat data produk');
  }
}

// harusnya bikin component baru untuk fetchCategories munggunakan invinite scroll
async function loadCategories() {
  try {
    await fetchCategories(1, 100, '', true);
  } catch (error) {
    console.error(error);
    toast.error('Gagal memuat data produk');
  }
}

function handleSort(column: ProductSortBy) {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = column;
    sortOrder.value = 'asc';
  }

  currentPage.value = 1;
  loadProducts();
}

function handleSearch() {
  currentPage.value = 1;

  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(() => {
    loadProducts();
  }, 400);
}

function handlePageChange(page: number) {
  currentPage.value = page;

  loadProducts();
}

function handlePageSizeChange(limit: number) {
  pageSize.value = limit;
  currentPage.value = 1;

  loadProducts();
}

let searchTimeout: ReturnType<typeof setTimeout> | undefined;

function openDelete(product: Product) {
  deletingProduct.value = product;
  showDelete.value = true;
}

async function confirmDelete() {
  if (!deletingProduct.value) {
    return
  }

  deleting.value = true

  try {
    await deleteProduct(
      deletingProduct.value.id,
    )

    showDelete.value = false
    deletingProduct.value = null

    if (
      products.value.length === 1 &&
      currentPage.value > 1
    ) {
      currentPage.value--
    }
    toast.success(`Berhasil menghapus produk`)

    await loadProducts()
  } catch (error) {
    console.error(error)

    toast.error(`Gagal menghapus produk`)
  } finally {
    deleting.value = false
  }
}

async function updateQuery() {
  await router.replace({
    query: {
      ...(currentPage.value !== 1 && {
        page: currentPage.value,
      }),

      ...(pageSize.value !== 10 && {
        limit: pageSize.value,
      }),

      ...(search.value && {
        search: search.value,
      }),

      ...(categoryId.value !== 'all' && {
        categoryId: categoryId.value,
      }),

      ...(status.value !== 'all' && {
        status: status.value,
      }),

      ...(sortBy.value !== 'name' && {
        sortBy: sortBy.value,
      }),

      ...(sortOrder.value !== 'desc' && {
        sortOrder: sortOrder.value,
      }),
    },
  });
}

function goToCreate() {
  navigateTo('/products/create');
}

onMounted(() => {
  loadProducts();
  loadCategories();
});
</script>

<template>
  <section class="space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Produk</h1>

        <p class="mt-1 text-sm text-gray-500">
          Atur produk dan varian produk.
        </p>
      </div>

      <BaseButton v-if="isAdmin" @click="goToCreate">
        <Plus class="h-4 w-4" />
        Tambah Produk
      </BaseButton>
    </div>

    <!-- Search -->
    <div
      class="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-3 sm:flex-row"
    >
      <div class="relative max-w-md">
        <Search
          class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        />

        <input
          v-model="search"
          type="search"
          placeholder="Cari produk..."
          class="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          @input="handleSearch"
        />
      </div>
      <div class="w-full flex flex-col gap-3 sm:flex-row sm:w-100">
        <BaseSelect
          class="w-1/2"
          v-model="categoryId"
          :options="categoryOptions"
          placeholder="Pilih kategori"
          @change="handleSearch"
        />
        <BaseSelect
          class="w-1/2"
          v-model="status"
          :options="statusOptions"
          @change="handleSearch"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <ProductTable
        :products="products"
        :page="meta.page"
        :limit="meta.limit"
        :loading="loading"
        :sort-by="sortBy"
        :sort-order="sortOrder"
        @sort="handleSort"
        @delete="openDelete"
      />

      <div v-if="products.length === 0" class="p-10 text-center">
        <p class="text-sm text-gray-500">Tidak ada produk ditemukan.</p>
      </div>

      <BasePagination
        v-model:current-page="currentPage"
        :total-pages="meta.totalPages"
        :page-size="pageSize"
        @update:current-page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </div>

    <BaseModal
      v-model="showDelete"
      title="Hapus Produk"
    >
      <div class="space-y-5">

        <p class="text-sm text-gray-600">
          Apakah Anda yakin ingin menghapus
          produk
          <strong class="text-gray-900">
            {{ deletingProduct?.name }}
          </strong>?
        </p>

        <div
          class="
            flex
            justify-end
            gap-2
            border-t
            border-gray-100
            pt-4
          "
        >
          <BaseButton
            variant="secondary"
            @click="showDelete = false"
          >
            Batal
          </BaseButton>

          <BaseButton
            variant="danger"
            :loading="loading"
            @click="confirmDelete"
          >
            Hapus
          </BaseButton>
        </div>

      </div>
    </BaseModal>
  </section>
</template>
