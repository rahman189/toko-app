<script setup lang="ts">
import { Eye, Pencil, Trash2 } from 'lucide-vue-next';
import type { SortOrder } from '~/types/api';

import type { Product, ProductSortBy } from '~/types/product';

defineProps<{
  products: Product[];
  page: number;
  limit: number;
  loading?: boolean;
  sortBy: ProductSortBy
  sortOrder: SortOrder
}>();

const { isAdmin } = usePermission();

const emit = defineEmits<{
  delete: [product: Product];
  sort: [column: ProductSortBy]
}>();

function viewProduct(product: Product) {
  navigateTo(`/products/${product.id}`);
}
</script>

<template>
  <BaseTableSkeleton v-if="loading" :rows="1" :columns="isAdmin ? 6 : 5" />
  <div class="overflow-x-auto">
    <table class="w-full text-left text-sm">
      <thead
        class="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500"
      >
        <tr>
          <th class="px-6 py-4 w-3 text-center">No</th>
          <th class="px-6 py-4">
            <BaseTableSort
              column="name"
              :sort-by="sortBy"
              :sort-order="sortOrder"
              @sort="emit('sort', 'name')"
            >
              Produk
            </BaseTableSort>
          </th>

          <th class="px-6 py-4">Kategori</th>

          <th class="px-6 py-4">Varian</th>

          <th class="px-6 py-4">Status</th>

          <th class="px-6 py-4 text-right">Aksi</th>
        </tr>
      </thead>

      <tbody class="divide-y divide-gray-200 bg-white">
        <tr
          v-for="(item, index) in products"
          :key="item.id"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-3 w-3 text-center text-gray-500">
            {{ (page - 1) * limit + index + 1 }}
          </td>
          <td class="px-6 py-3">
            <div class="font-medium text-gray-900">
              {{ item.name }}
            </div>

            <div v-if="item.description" class="mt-1 text-sm text-gray-500">
              {{ item.description }}
            </div>
          </td>

          <td class="px-6 py-3 text-sm text-gray-600">
            {{ item.category?.name ?? '-' }}
          </td>

          <td class="px-6 py-3 text-sm text-gray-600">
            {{ item.variants?.length ?? 0 }}
          </td>

          <td class="px-6 py-3">
            <BaseBadge :variant="item.isActive ? 'success' : 'danger'">
              {{ item.isActive ? 'Active' : 'Inactive' }}
            </BaseBadge>
          </td>

          <td class="px-6 py-3 text-right">
            <div class="flex justify-end gap-1">
              <BaseButton variant="ghost" @click="viewProduct(item)">
                <Pencil v-if="isAdmin" class="h-4 w-4" />
                <Eye v-else class="h-4 w-4" />
              </BaseButton>
              <BaseButton v-if="isAdmin && item.isActive" variant="danger" @click="emit('delete', item)">
                <Trash2 class="h-4 w-4" />
              </BaseButton>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
