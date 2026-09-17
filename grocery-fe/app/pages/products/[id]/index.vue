<script setup lang="ts">
import { computed, ref } from 'vue';
import { PackageX, CircleAlert } from 'lucide-vue-next'

import type { UpdateProductDto } from '~/types/product';
import type {
  ProductVariant,
  UpdateProductVariantDto,
} from '~/types/product-variant';
import type { CreateProductVariantDto } from '~/types/product-variant';

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
});

const { categories, fetchCategories } = useCategory();

const {
  product,
  loading,
  fetchProduct,
  updateProduct,
  createVariant,
  updateVariant,
  deleteVariant,
} = useProduct();

const { isAdmin } = usePermission();
const toast = useToast();

const categoryOptions = computed(() => [
  ...categories.value.map((category) => ({
    label: category.name,
    value: category.id,
  })),
]);

const variantModalTitle = computed(() => {
  if (editingVariant.value && isAdmin.value) {
    return 'Edit Varian'
  }
  if (isAdmin.value) {
    return 'Tambah varian'
  }
  return 'Varian'

});

type ProductDetailState = 'loading' | 'success' | 'not-found' | 'error';

const state = ref<ProductDetailState>('loading');
const errorMessage = ref('Unable to load product.');
const saving = ref(false);

const showVariantModal = ref(false);

const editingVariant = ref<ProductVariant | null>(null);

const showDeleteModal = ref(false);

const deletingVariant = ref<ProductVariant | null>(null);

const variantLoading = ref(false);

const deletingLoading = ref(false);

const route = useRoute();

const productId = computed(() => String(route.params.id));

async function loadProduct() {
  state.value = 'loading';

  try {
    await fetchProduct(productId.value);
    if (!product.value) {
      state.value = 'not-found';
      return;
    }
    state.value = 'success';
  } catch (error: any) {
    console.error(error);
    toast.error('Gagal memuat data produk');
    if (error?.statusCode === 404) {
      state.value = 'not-found';
      return;
    }
    state.value = 'error';
  }
}

async function loadCategories() {
  try {
    await fetchCategories(1, 100, '', true);
  } catch (error) {
    console.error(error);
    toast.error('Gagal memuat data produk');
  }
}

const variants = computed(() => product.value?.variants ?? []);

function goBack() {
  navigateTo('/products');
}

function addVariant() {
  editingVariant.value = null;
  showVariantModal.value = true;
}

function editVariant(variant: ProductVariant) {
  editingVariant.value = variant;
  showVariantModal.value = true;
}

function closeVariantModal() {
  showVariantModal.value = false;
  editingVariant.value = null;
}

function confirmDeleteVariant(variant: ProductVariant) {
  deletingVariant.value = variant;
  showDeleteModal.value = true;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  deletingVariant.value = null;
}

async function handleUpdateProduct(payload: UpdateProductDto) {
  saving.value = true;

  try {
    await updateProduct(productId.value, payload);
    toast.success('Berhasil update produk');

    await loadProduct();
  } catch (error) {
    console.error(error);

    toast.error('Gagal update produk');
  } finally {
    saving.value = false;
  }
}

async function handleVariantCreate(payload: CreateProductVariantDto) {
  variantLoading.value = true;

  try {
    await createVariant(productId.value, payload);

    showVariantModal.value = false;
    editingVariant.value = null;
    toast.success('Berhasil membuat varian');

    await loadProduct();
  } catch (error) {
    console.error(error);

    toast.error('Gagal membuat varian');
  } finally {
    variantLoading.value = false;
  }
}

async function handleVariantUpdate(payload: UpdateProductVariantDto) {
  variantLoading.value = true;

  try {
    if (!editingVariant.value) {
      return;
    }

    await updateVariant(productId.value, editingVariant.value.id, payload);

    showVariantModal.value = false;
    editingVariant.value = null;
    toast.success('Berhasil update varian');

    await loadProduct();
  } catch (error) {
    console.error(error);

    toast.error('Gagal update varian');
  } finally {
    variantLoading.value = false;
  }
}

async function confirmDelete() {
  if (!deletingVariant.value) {
    return;
  }

  deletingLoading.value = true;

  try {
    await deleteVariant(productId.value, deletingVariant.value.id);

    showDeleteModal.value = false;
    deletingVariant.value = null;
    toast.success(`Berhasil menghapus varian`);

    await loadProduct();
  } catch (error) {
    console.error(error);

    toast.error(`Gagal menghapus varian`);
  } finally {
    deletingLoading.value = false;
  }
}

onMounted(() => {
  loadProduct();
  loadCategories();
});
</script>

<template>
  <section class="space-y-6">
    <div
      v-if="state === 'loading'"
      class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div class="animate-pulse space-y-6">
        <div class="h-7 w-48 rounded bg-gray-200" />

        <div class="space-y-3">
          <div class="h-4 w-72 rounded bg-gray-200" />
          <div class="h-4 w-56 rounded bg-gray-200" />
          <div class="h-4 w-64 rounded bg-gray-200" />
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div
      v-else-if="state === 'not-found'"
      class="flex min-h-[500px] items-center justify-center rounded-xl border border-gray-200 bg-white px-6 shadow-sm"
    >
      <div class="max-w-md text-center">
        <div
          class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100"
        >
          <PackageX class="h-8 w-8 text-gray-400" />
        </div>

        <h1 class="mt-5 text-xl font-semibold text-gray-900">
          Produk tidak ditemukan
        </h1>

        <p class="mt-2 text-sm leading-6 text-gray-500">
          Produk yang kamu cari tidak ada atau sudah dihapus dari sistem.
        </p>

        <div class="mt-6">
          <BaseButton @click="navigateTo('/products')">
            Kembali ke halaman produk
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div
      v-else-if="state === 'error'"
      class="flex min-h-[500px] items-center justify-center rounded-xl border border-gray-200 bg-white px-6 shadow-sm"
    >
      <div class="max-w-md text-center">
        <div
          class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50"
        >
          <CircleAlert class="h-8 w-8 text-red-500" />
        </div>

        <h1 class="mt-5 text-xl font-semibold text-gray-900">
          Gagal memuat produk
        </h1>

        <p class="mt-2 text-sm leading-6 text-gray-500">
          {{ errorMessage }}
        </p>

        <div class="mt-6 flex justify-center gap-3">
          <BaseButton variant="secondary" @click="navigateTo('/products')">
            Kembali ke halaman produk
          </BaseButton>

          <BaseButton @click="loadProduct"> Try Again </BaseButton>
        </div>
      </div>
    </div>

    <!-- Product -->
    <template v-else-if="state === 'success'">
      <div
        class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
      >
        <div>
          <button
            type="button"
            class="mb-1 text-sm text-gray-500 hover:text-gray-900"
            @click="goBack"
          >
            ← Kembali ke list produk
          </button>

          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-semibold text-gray-900">
              {{ product?.name }}
            </h1>

            <BaseBadge :variant="product?.isActive ? 'success' : 'danger'">
              {{ product?.isActive ? 'Active' : 'Inactive' }}
            </BaseBadge>
          </div>

          <p class="mt-1 text-sm text-gray-500">
            {{ product?.category?.name ?? '-' }}
          </p>
        </div>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-6">
        <ProductForm
          :loading="loading"
          :initial-value="product"
          :categories="categoryOptions"
          @submit="handleUpdateProduct"
          :show-back-button="false"
          :view-mode="!isAdmin"
        />
      </div>

      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div
          class="flex flex-col gap-3 border-b border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h2 class="font-semibold text-gray-900">Produk Varian</h2>

            <p class="mt-1 text-sm text-gray-500">
              Atur SKU, harga, and stok informasi.
            </p>
          </div>

          <BaseButton v-if="isAdmin" variant="primary" @click="addVariant">
            Tambah Varian
          </BaseButton>
        </div>

        <ProductVariantTable
          :product-variants="variants"
          @delete="confirmDeleteVariant"
          @view="editVariant"
        />
      </div>

      <BaseModal v-model="showDeleteModal" title="Delete Category">
        <div class="space-y-5">
          <p class="text-sm text-gray-600">
            Apakah Anda yakin ingin menghapus produk varian
            <strong class="text-gray-900">
              {{ deletingVariant?.variantName }} </strong
            >?
          </p>

          <div class="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <BaseButton variant="secondary" @click="showDeleteModal = false">
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

      <BaseModal
        v-model="showVariantModal"
        :title="variantModalTitle"
      >
        <ProductVariantForm
          :initial-value="editingVariant ?? undefined"
          :loading="variantLoading"
          @create="handleVariantCreate"
          @update="handleVariantUpdate"
          @cancel="closeVariantModal"
        />
      </BaseModal>
    </template>
  </section>
</template>
