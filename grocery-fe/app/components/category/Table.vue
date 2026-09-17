<script setup lang="ts">
import { Pencil, Trash2 } from 'lucide-vue-next';
import type { SortOrder } from '~/types/api';

import type { Category, CategorySortBy } from '~/types/category';

defineProps<{
  categories: Category[];
  page: number;
  limit: number;
  loading?: boolean;
  sortBy: CategorySortBy
  sortOrder: SortOrder
}>();

const { isAdmin } = usePermission();

const emit = defineEmits<{
  edit: [category: Category];
  delete: [category: Category];
  sort: [column: CategorySortBy]
}>();
</script>

<template>
  <BaseTableSkeleton v-if="loading" :rows="5" :columns="isAdmin ? 6 : 5" />
  <div v-else class="overflow-x-auto">
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
              Nama
            </BaseTableSort>
          </th>

          <th class="px-6 py-4">Slug</th>

          <th class="px-6 py-4">Deskripsi</th>

          <th class="px-6 py-4">Status</th>

          <th v-if="isAdmin" class="px-6 py-4 text-right">Aksi</th>
        </tr>
      </thead>

      <tbody class="divide-y divide-gray-100">
        <tr
          v-for="(category, index) in categories"
          :key="category.id"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-3 w-3 text-center text-gray-500">
            {{ (page - 1) * limit + index + 1 }}
          </td>
          <td class="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
            {{ category.name }}
          </td>

          <td class="px-6 py-4 text-gray-500">
            {{ category.slug }}
          </td>

          <td class="max-w-xs truncate px-6 py-4 text-gray-500">
            {{ category.description || '-' }}
          </td>

          <td class="px-6 py-4">
            <BaseBadge :variant="category.isActive ? 'success' : 'gray'">
              {{ category.isActive ? 'Active' : 'Inactive' }}
            </BaseBadge>
          </td>

          <td v-if="isAdmin" class="px-6 py-4">
            <div class="flex justify-end gap-1">
              <BaseButton variant="ghost" @click="emit('edit', category)">
                <Pencil class="h-4 w-4" />
              </BaseButton>
              <BaseButton
                v-if="category.isActive"
                variant="danger"
                @click="emit('delete', category)"
              >
                <Trash2 class="h-4 w-4" />
              </BaseButton>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
