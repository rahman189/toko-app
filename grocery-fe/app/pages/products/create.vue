<script setup lang="ts">
import type { CreateProductDto } from '~/types/product';

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'admin'],
});

const { categories, fetchCategories } = useCategory();

const { loading, createProduct } = useProduct();
const toast = useToast();

const categoryOptions = computed(() => [
  ...categories.value.map((category) => ({
    label: category.name,
    value: category.id,
  })),
]);
const saving = ref(false);

async function handleSave(payload: CreateProductDto) {
  saving.value = true;

  try {
    const product = await createProduct(payload);
    toast.success('Berhasil membuat produk lanjut ke halaman tambah varian');
    navigateTo(`/products/${product.id}`);
  } catch (error) {
    console.error(error);

    toast.error('Gagal membuat} kategori');
  } finally {
    saving.value = false;
  }
}

function handleCancel() {
  navigateTo('/products');
}

async function loadCategories() {
  try {
    await fetchCategories(1, 100, '', true);
  } catch (error) {
    console.error(error);
    toast.error('Gagal memuat data kategori');
  }
}

onMounted(() => {
  loadCategories();
});
</script>

<template>
  <section class="space-y-6">
    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
    >
      <div>
        <button
          type="button"
          class="mb-1 text-sm text-gray-500 hover:text-gray-900"
          @click="handleCancel"
        >
          ← Kembali
        </button>

        <h1 class="text-2xl font-semibold text-gray-900">Tambah Produk</h1>

        <p class="mt-1 text-sm text-gray-500">Tambah produk baru.</p>
      </div>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white p-6">
      <ProductForm
        :loading="loading"
        :categories="categoryOptions"
        @submit="handleSave"
        @cancel="handleCancel"
      />
    </div>
  </section>
</template>
