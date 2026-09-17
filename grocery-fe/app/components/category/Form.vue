<script setup lang="ts">

interface CategoryForm {
  name: string
  description: string
  isActive: boolean
}

const props = withDefaults(
  defineProps<{
    initialData?: Partial<CategoryForm>
    loading?: boolean
  }>(),
  {
    initialData: undefined,
    loading: false,
  },
)

const emit = defineEmits<{
  submit: [data: CategoryForm]
  cancel: []
}>()

const form = reactive<CategoryForm>({
  name: props.initialData?.name ?? '',
  description: props.initialData?.description ?? '',
  isActive: props.initialData?.isActive ?? true,
})

const errors = reactive({
  name: '',
})

function validate() {
  errors.name = ''

  if (!form.name.trim()) {
    errors.name = 'Category name is required.'
  }

  return !errors.name
}

function submit() {
  if (!validate()) {
    return
  }

  emit('submit', {
    ...form,
    name: form.name.trim(),
    description: form.description.trim(),
  })
}
</script>

<template>
  <form
    class="space-y-5"
    @submit.prevent="submit"
  >
    <BaseInput
      v-model="form.name"
      label="Category Name"
      placeholder="e.g. Makanan"
      :error="errors.name"
      required
    />

    <div class="space-y-1.5">
      <label class="block text-sm font-medium text-gray-700">
        Description
      </label>

      <textarea
        v-model="form.description"
        rows="4"
        placeholder="Category description..."
        class="
          w-full
          resize-none
          rounded-lg
          border border-gray-200
          px-3 py-2.5
          text-sm
          outline-none
          placeholder:text-gray-400
          focus:border-primary-500
          focus:ring-2
          focus:ring-primary-100
        "
      />
    </div>

    <label
      class="
        flex
        cursor-pointer
        items-center
        gap-3
      "
    >
      <input
        v-model="form.isActive"
        type="checkbox"
        class="
          h-4 w-4
          rounded
          border-gray-300
          text-primary-600
          focus:ring-primary-500
        "
      />

      <span class="text-sm text-gray-700">
        Active
      </span>
    </label>

    <div
      class="
        flex
        justify-end
        gap-2
        border-t
        border-gray-100
        pt-4
      "
    >
      <BaseButton
        variant="secondary"
        @click="emit('cancel')"
      >
        Cancel
      </BaseButton>

      <BaseButton
        type="submit"
        :loading="loading"
      >
        Save
      </BaseButton>
    </div>
  </form>
</template>