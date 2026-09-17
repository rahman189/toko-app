<script setup lang="ts">
import { ref } from 'vue';

import type {
  CreateProductVariantDto,
  ProductVariant,
  UpdateProductVariantDto,
} from '~/types/product-variant';

const props = withDefaults(
  defineProps<{
    initialValue?: Partial<ProductVariant>;
    loading?: boolean;
  }>(),
  {
    initialValue: () => ({}),
    loading: false,
  },
);
const { isAdmin } = usePermission();

const emit = defineEmits<{
  create: [payload: CreateProductVariantDto];
  update: [payload: UpdateProductVariantDto];
  cancel: [];
}>();

const form = ref<CreateProductVariantDto>({
  variantName: props.initialValue.variantName ?? '',
  sku: props.initialValue.sku ?? '',
  barcode: props.initialValue.barcode ?? '',
  costPrice: props.initialValue.costPrice ?? 0,
  price: props.initialValue.price ?? 0,
  isActive: props.initialValue.isActive ?? true,
});

const errors = ref<Record<string, string>>({});

function validate() {
  errors.value = {};

  if (!form.value.variantName.trim()) {
    errors.value.name = 'Nama varian wajib diisi.';
  }

  if (!form.value.sku.trim()) {
    errors.value.sku = 'SKU wajib diisi.';
  }

  if (form.value.costPrice < 0) {
    errors.value.costPrice = 'Harga modal tidak boleh kurang dari 0.';
  }

  if (form.value.price < 0) {
    errors.value.price = 'Harga jual tidak boleh kurang dari 0.';
  }

  if (form.value.price > 0 && form.value.costPrice > form.value.price) {
    errors.value.sellingPrice =
      'Harga jual tidak boleh lebih rendah dari harga modal.';
  }

  return Object.keys(errors.value).length === 0;
}

function handleSubmit() {
  if (!validate()) {
    return;
  }

  typeof form.value.costPrice

  if (props.initialValue.id) {
    const payload: UpdateProductVariantDto = {
      variantName: form.value.variantName.trim(),
      barcode: form.value.barcode?.trim(),
      costPrice: Number(form.value.costPrice),
      price: Number(form.value.price),
      isActive: form.value.isActive,
    };

    emit('update', payload);
  } else {
    const payload: CreateProductVariantDto = {
      variantName: form.value.variantName.trim(),
      sku: form.value.sku.trim(),
      barcode: form.value.barcode?.trim(),
      costPrice: Number(form.value.costPrice),
      price: Number(form.value.price),
      isActive: form.value.isActive,
    };

    emit('create', payload);
  }
}
</script>

<template>
  <form class="space-y-5" @submit.prevent="handleSubmit">
    <div class="grid gap-5 sm:grid-cols-2">
      <BaseInput
        v-model="form.variantName"
        label="Nama Varian"
        placeholder="e.g. 250ml"
        required
        :error="errors.variantName"
        :disabled="!isAdmin"
      />

      <BaseInput
        v-model="form.sku"
        :disabled="!!props.initialValue.id || !isAdmin"
        label="SKU"
        placeholder="e.g. CC-250"
        required
        :error="errors.sku"
      />

      <BaseInput
        v-model="form.barcode"
        label="Barcode"
        placeholder="Optional"
        :disabled="!isAdmin"
      />

      <BaseInput
        v-model.number="form.costPrice"
        label="Harga Modal"
        type="number"
        min="0"
        :error="errors.costPrice"
        :disabled="!isAdmin"
      />

      <BaseInput
        v-model.number="form.price"
        label="Harga Jual"
        type="number"
        min="0"
        :error="errors.price"
        :disabled="!isAdmin"
      />

      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700">
          Status
        </label>

        <label class="flex items-center gap-3">
          <input
            v-model="form.isActive"
            type="checkbox"
            class="h-4 w-4 rounded border-gray-300"
            :disabled="!isAdmin"
          />

          <span class="text-sm text-gray-700"> Active </span>
        </label>
      </div>
    </div>

    <div class="flex justify-end gap-3 border-t border-gray-200 pt-5">
      <BaseButton type="button" variant="secondary" @click="emit('cancel')">
        Tutup
      </BaseButton>

      <BaseButton v-if="isAdmin" type="submit" variant="primary" :loading="loading">
        Simpan
      </BaseButton>
    </div>
  </form>
</template>
