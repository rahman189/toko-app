<script setup lang="ts">
import { Pencil, Trash2, Eye } from 'lucide-vue-next';

import type { ProductVariant } from '~/types/product-variant';

defineProps<{
  productVariants: ProductVariant[];
  loading?: boolean;
}>();

const { isAdmin } = usePermission();

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

const emit = defineEmits<{
  delete: [productVariant: ProductVariant];
  view: [productVariant: ProductVariant];
}>();
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full text-left text-sm">
      <thead
        class="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500"
      >
        <tr>
          <th class="px-6 py-4 w-3 text-center">No</th>
          <th class="px-6 py-4">Varian</th>

          <th class="px-6 py-4">Barcode</th>

          <th class="px-6 py-4">Harga Modal</th>

          <th class="px-6 py-4">Harga Jual</th>

          <th class="px-6 py-4">Status</th>

          <th class="px-6 py-4 text-right">Aksi</th>
        </tr>
      </thead>

      <tbody class="divide-y divide-gray-200 bg-white">
        <tr
          v-for="(item, index) in productVariants"
          :key="item.id"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-3 w-3 text-center text-gray-500">
            {{ index + 1 }}
          </td>
          <td class="px-6 py-3">
            <div class="font-medium text-gray-900">
              {{ item.variantName }}
            </div>

            <div v-if="item.sku" class="mt-1 text-sm text-gray-500">
              {{ item.sku }}
            </div>
          </td>

          <td class="px-6 py-3 text-sm text-gray-600">
            {{ item.barcode || '-' }}
          </td>

          <td class="px-6 py-3 text-sm text-gray-600">
            {{ formatCurrency(item.costPrice) }}
          </td>

          <td class="px-6 py-3 text-sm text-gray-600">
            {{ formatCurrency(item.price) }}
          </td>

          <td class="px-6 py-3">
            <BaseBadge :variant="item.isActive ? 'success' : 'danger'">
              {{ item.isActive ? 'Active' : 'Inactive' }}
            </BaseBadge>
          </td>

          <td class="px-6 py-3 text-right">
            <div class="flex justify-end gap-1">
              <BaseButton variant="ghost" @click="emit('view', item)">
                <Pencil v-if="isAdmin" class="h-4 w-4" />
                <Eye v-else class="h-4 w-4" />
              </BaseButton>
              <BaseButton
                v-if="isAdmin && item.isActive"
                variant="danger"
                @click="emit('delete', item)"
              >
                <Trash2 class="h-4 w-4" />
              </BaseButton>
            </div>
          </td>
        </tr>
        <tr v-if="productVariants.length === 0">
          <td colspan="6" class="px-6 py-12 text-center text-sm text-gray-500">
            Tidak ada varian.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
