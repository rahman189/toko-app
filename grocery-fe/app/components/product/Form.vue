<script setup lang="ts">
import { ref } from 'vue';
import type { SelectOption } from '~/components/base/Select.vue';

interface ProductFormValue {
  name: string;
  description?: string;
  categoryId: string;
  isActive?: boolean
  // next phase
  // imageUrl: string
}

const props = withDefaults(
  defineProps<{
    initialValue?: Partial<ProductFormValue>;
    loading?: boolean;
    categories: SelectOption[];
    showBackButton?: boolean;
    viewMode?: boolean
  }>(),
  {
    initialValue: () => ({
      name: '',
      description: '',
      categoryId: '',
      isActive: false,
    }),
    loading: false,
    showBackButton: true
  },
);

const emit = defineEmits<{
  submit: [value: ProductFormValue];
  cancel: [];
}>();

const errors = ref<Record<string, string>>({});

function validate() {
  errors.value = {};

  if (!props.initialValue.name?.trim()) {
    errors.value.name = 'Nama produk wajib diisi.';
  }

  if (!props.initialValue.categoryId) {
    errors.value.categoryId = 'Kategori wajib diisi.';
  }

  return Object.keys(errors.value).length === 0;
}

function handleSubmit() {
  if (!validate()) {
    return;
  }

  emit('submit', {
    name: props.initialValue.name?.trim() || '',
    description: props.initialValue.description?.trim(),
    categoryId: props.initialValue.categoryId || '',
    // next phase
    // imageUrl: form.value.imageUrl.trim(),
  });
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <div class="grid gap-6 md:grid-cols-2">
      <BaseInput
        v-model="props.initialValue.name"
        label="Nama Produk"
        placeholder="e.g. Coca Cola"
        required
        :error="errors.name"
        :disabled="viewMode"
      />

      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700">
          Kategori
          <span class="text-red-500">*</span>
        </label>

        <BaseSelect
          v-model="props.initialValue.categoryId"
          :options="categories"
          :error="errors.categoryId"
          placeholder="Pilih kategori"
          :disabled="viewMode"
        />
      </div>
    </div>

    <div>
      <label class="mb-1.5 block text-sm font-medium text-gray-700">
        Deskripsi
      </label>

      <textarea
        v-model="props.initialValue.description"
        rows="4"
        placeholder="Product description..."
        class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        :disabled="viewMode"
      />
    </div>
    <label class="flex cursor-pointer items-center gap-3">
      <input
        v-model="props.initialValue.isActive"
        type="checkbox"
        class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        :disabled="viewMode"
      />

      <span class="text-sm text-gray-700"> Active </span>
    </label>

    <!-- next phase -->

    <!-- <BaseInput
      v-model="form.imageUrl"
      label="Image URL"
      placeholder="https://..."
    /> -->

    <div v-if="!viewMode" class="flex justify-end gap-3 border-t border-gray-200 pt-6">
      <BaseButton v-if="showBackButton" type="button" variant="secondary" @click="emit('cancel')">
        Batal
      </BaseButton>

      <BaseButton type="submit" variant="primary" :loading="loading">
        Simpan Produk
      </BaseButton>
    </div>
  </form>
</template>
