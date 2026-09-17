<script setup lang="ts">
import { Eye, EyeOff } from 'lucide-vue-next';

interface Props {
  modelValue?: string | number | null;
  type?: 'text' | 'email' | 'password' | 'number' | 'url';
  label?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  autocomplete?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  readonly: false,
  required: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
}>();

const generatedId = useId();

const inputId = computed(() => props.id ?? generatedId);

const showPassword = ref(false);

const inputType = computed(() => {
  if (props.type !== 'password') {
    return props.type;
  }

  return showPassword.value ? 'text' : 'password';
});

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;

  emit('update:modelValue', target.value);
}
</script>

<template>
  <div class="w-full">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      class="mb-1.5 block text-sm font-medium text-gray-700"
    >
      {{ label }}

      <span v-if="required" class="ml-0.5 text-red-500" aria-hidden="true">
        *
      </span>
    </label>

    <!-- Input -->
    <div class="relative">
      <input
        :id="inputId"
        :name="name"
        :type="inputType"
        :value="modelValue ?? ''"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :aria-invalid="Boolean(error)"
        :aria-describedby="
          error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
        "
        class="h-10 w-full rounded-lg border bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 disabled:opacity-70 read-only:bg-gray-50"
        :class="{
          'border-red-300 focus:border-red-500 focus:ring-red-100': error,
          'border-gray-300 focus:border-gray-500 focus:ring-gray-100': !error,
          'pr-10': type === 'password',
        }"
        @input="handleInput"
      />

      <!-- Password toggle -->
      <button
        v-if="type === 'password'"
        type="button"
        :disabled="disabled"
        class="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
        @click="showPassword = !showPassword"
      >
        <EyeOff v-if="showPassword" class="h-4 w-4" />

        <Eye v-else class="h-4 w-4" />
      </button>
    </div>

    <!-- Hint -->
    <p
      v-if="hint && !error"
      :id="`${inputId}-hint`"
      class="mt-1.5 text-xs text-gray-500"
    >
      {{ hint }}
    </p>

    <!-- Error -->
    <p
      v-if="error"
      :id="`${inputId}-error`"
      class="mt-1.5 text-xs text-red-600"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>
