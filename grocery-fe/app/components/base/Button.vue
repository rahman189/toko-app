<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
    loading?: boolean
    disabled?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    loading: false,
    disabled: false,
  },
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="
      inline-flex
      items-center
      justify-center
      gap-2
      rounded-lg
      px-4 py-2.5
      text-sm
      font-medium
      transition
      disabled:cursor-not-allowed
      disabled:opacity-50
    "
    :class="{
      'bg-primary-600 text-white hover:bg-primary-700':
        variant === 'primary',

      'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50':
        variant === 'secondary',

      'bg-danger-600 text-white hover:bg-danger-700':
        variant === 'danger',

      'text-gray-600 hover:bg-gray-100':
        variant === 'ghost',
    }"
  >
    <svg
      v-if="loading"
      class="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />

      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>

    <slot />
  </button>
</template>