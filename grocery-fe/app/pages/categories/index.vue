<script setup lang="ts">
import { Plus, Search } from 'lucide-vue-next';
import type { SelectOption } from '~/components/base/Select.vue';
import type { SortOrder } from '~/types/api';

import type { Category, CategorySortBy } from '~/types/category';

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
});

const {
  categories,
  meta,
  loading,
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = useCategory();

const { isAdmin } = usePermission();

const toast = useToast();

const showForm = ref(false);

const showDelete = ref(false);

const editingCategory = ref<Category | null>(null);

const deletingCategory = ref<Category | null>(null);

const saving = ref(false);

const deleting = ref(false);

const route = useRoute();
const router = useRouter();

const currentPage = ref(Number(route.query.page) || 1);

const pageSize = ref(Number(route.query.limit) || 10);

const search = ref(
  typeof route.query.search === 'string' ? route.query.search : '',
);

const sortBy = ref<CategorySortBy>(
  route.query.sortBy === 'name' ? route.query.sortBy
    : 'name',
);

const sortOrder = ref<SortOrder>(
  route.query.sortOrder === 'asc' ? 'asc' : 'desc',
);

const statusOptions = ref<SelectOption[]>([
  {
    label: 'All Status',
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

async function loadCategories() {
  const isActive =
    status.value === 'all' ? undefined : status.value === 'active';

  try {
    await fetchCategories(
      currentPage.value,
      pageSize.value,
      search.value,
      isActive,
      sortBy.value,
      sortOrder.value,
    );
    updateQuery();
  } catch (error) {
    console.error(error);
    toast.error('Gagal memuat data kategori');
  }
}

function handleSort(column: CategorySortBy) {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = column;
    sortOrder.value = 'asc';
  }

  currentPage.value = 1;
  loadCategories();
}

function handleSearch() {
  currentPage.value = 1;

  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(() => {
    loadCategories();
  }, 400);
}

function handlePageChange(page: number) {
  currentPage.value = page;

  loadCategories();
}

function handlePageSizeChange(limit: number) {
  pageSize.value = limit;
  currentPage.value = 1;

  loadCategories();
}

let searchTimeout: ReturnType<typeof setTimeout> | undefined;

function openCreate() {
  editingCategory.value = null;
  showForm.value = true;
}

function openEdit(category: Category) {
  editingCategory.value = category;
  showForm.value = true;
}

function openDelete(category: Category) {
  deletingCategory.value = category;
  showDelete.value = true;
}

function closeForm() {
  showForm.value = false;
  editingCategory.value = null;
}

async function handleSave(payload: {
  name: string;
  description: string;
  isActive: boolean;
}) {
  saving.value = true;

  try {
    if (editingCategory.value) {
      await updateCategory(editingCategory.value.id, payload);
    } else {
      await createCategory(payload);
    }

    showForm.value = false;
    editingCategory.value = null;
    toast.success(
      `Berhasil ${editingCategory.value ? 'update' : 'membuat'} kategori`,
    );

    await loadCategories();
  } catch (error) {
    console.error(error);

    toast.error(
      `Gagal ${editingCategory.value ? 'update' : 'membuat'} kategori`,
    );
  } finally {
    saving.value = false;
  }
}

async function confirmDelete() {
  if (!deletingCategory.value) {
    return;
  }

  deleting.value = true;

  try {
    await deleteCategory(deletingCategory.value.id);

    showDelete.value = false;
    deletingCategory.value = null;

    /*
     * Jika halaman terakhir menjadi kosong
     * setelah delete, mundur satu page.
     */
    if (categories.value.length === 1 && currentPage.value > 1) {
      currentPage.value--;
    }
    toast.success(`Berhasil menghapus kategori`);

    await loadCategories();
  } catch (error) {
    console.error(error);

    toast.error(`Gagal menghapus kategori`);
  } finally {
    deleting.value = false;
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

onMounted(() => {
  loadCategories();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">
          Kategori
        </h1>

        <p class="mt-1 text-sm text-gray-500">Kelola kategori produk.</p>
      </div>

      <BaseButton v-if="isAdmin" @click="openCreate">
        <Plus class="h-4 w-4" />
        Tambah Kategori
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
          placeholder="Cari kategori..."
          class="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          @input="handleSearch"
        />
      </div>

      <div class="w-full sm:w-40">
        <BaseSelect
          v-model="status"
          :options="statusOptions"
          @change="handleSearch"
          placeholder="Select status"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <CategoryTable
        :categories="categories"
        :page="meta.page"
        :limit="meta.limit"
        :loading="loading"
        :sort-by="sortBy"
        :sort-order="sortOrder"
        @sort="handleSort"
        @edit="openEdit"
        @delete="openDelete"
      />

      <div v-if="categories.length === 0" class="p-10 text-center">
        <p class="text-sm text-gray-500">Tidak ada category ditemukan.</p>
      </div>

      <BasePagination
        v-model:current-page="currentPage"
        :total-pages="meta.totalPages"
        :page-size="pageSize"
        @update:current-page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </div>

    <!-- Create / Edit -->
    <BaseModal
      v-model="showForm"
      :title="editingCategory ? 'Edit Category' : 'Tambah Category'"
    >
      <CategoryForm
        :initial-data="editingCategory || undefined"
        :loading="loading"
        @submit="handleSave"
        @cancel="closeForm"
      />
    </BaseModal>

    <!-- Delete Confirmation -->
    <BaseModal v-model="showDelete" title="Delete Category">
      <div class="space-y-5">
        <p class="text-sm text-gray-600">
          Apakah Anda yakin ingin menghapus kategori
          <strong class="text-gray-900">
            {{ deletingCategory?.name }} </strong
          >?
        </p>

        <div class="flex justify-end gap-2 border-t border-gray-100 pt-4">
          <BaseButton variant="secondary" @click="showDelete = false">
            Cancel
          </BaseButton>

          <BaseButton
            variant="danger"
            :loading="loading"
            @click="confirmDelete"
          >
            Delete
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
