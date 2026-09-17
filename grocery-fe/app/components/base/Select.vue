<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

export interface SelectOption {
  label: string
  value: string | number | boolean
  disabled?: boolean
}

interface Props {
  modelValue?: string | number | boolean | null
  options: SelectOption[]
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  id?: string
  name?: string
}

const props = withDefaults(
  defineProps<Props>(),
  {
    modelValue: null,
    placeholder: 'Pilih opsi',
    disabled: false,
    required: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [
    value: string | number | boolean | null,
  ]
  change: [
    value: string | number | boolean | null,
  ]
}>()

const generatedId = useId()

const selectId = computed(
  () => props.id ?? generatedId,
)

function getValue(
  value: string,
): string | number | boolean {
  const option = props.options.find(
    option => String(option.value) === value,
  )

  return option?.value ?? value
}

function handleChange(event: Event) {
  const value = (
    event.target as HTMLSelectElement
  ).value

  const parsedValue = getValue(value)

  emit('update:modelValue', parsedValue)
  emit('change', parsedValue)
}
</script>

<template>
  <div class="w-full">
    <!-- Label -->
    <label
      v-if="label"
      :for="selectId"
      class="mb-1.5 block text-sm font-medium text-gray-700"
    >
      {{ label }}

      <span
        v-if="required"
        class="ml-0.5 text-red-500"
        aria-hidden="true"
      >
        *
      </span>
    </label>

    <!-- Select -->
    <div class="relative">
      <select
        :id="selectId"
        :name="name"
        :value="
          modelValue === null ||
          modelValue === undefined
            ? ''
            : String(modelValue)
        "
        :disabled="disabled"
        :required="required"
        :aria-invalid="Boolean(error)"
        :aria-describedby="
          error
            ? `${selectId}-error`
            : hint
              ? `${selectId}-hint`
              : undefined
        "
        class="h-10 w-full appearance-none rounded-lg border bg-white px-3 pr-10 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
        :class="
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
            : 'border-gray-300 focus:border-gray-500 focus:ring-gray-100'
        "
        @change="handleChange"
      >
        <!-- Placeholder -->
        <option
          value=""
          disabled
        >
          {{ placeholder }}
        </option>

        <!-- Options -->
        <option
          v-for="option in options"
          :key="String(option.value)"
          :value="String(option.value)"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>

      <!-- Chevron -->
      <ChevronDown
        class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        aria-hidden="true"
      />
    </div>

    <!-- Hint -->
    <p
      v-if="hint && !error"
      :id="`${selectId}-hint`"
      class="mt-1.5 text-xs text-gray-500"
    >
      {{ hint }}
    </p>

    <!-- Error -->
    <p
      v-if="error"
      :id="`${selectId}-error`"
      class="mt-1.5 text-xs text-red-600"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>