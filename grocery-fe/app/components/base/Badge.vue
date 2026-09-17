<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'success' | 'warning' | 'danger' | 'gray'
  }>(),
  {
    variant: 'gray',
  },
)
</script>

<template>
  <span
    class="
      inline-flex
      rounded-full
      px-2.5 py-1
      text-xs
      font-medium
    "
    :class="{
      'bg-success-50 text-success-600':
        variant === 'success',

      'bg-warning-50 text-warning-500':
        variant === 'warning',

      'bg-danger-50 text-danger-600':
        variant === 'danger',

      'bg-gray-100 text-gray-600':
        variant === 'gray',
    }"
  >
    <slot />
  </span>
</template>