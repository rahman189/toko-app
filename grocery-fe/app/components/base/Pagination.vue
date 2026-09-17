<script setup lang="ts">

interface Props {
  currentPage: number
  totalPages: number
  pageSize?: number
  pageSizeOptions?: number[]
}

const props = withDefaults(
  defineProps<Props>(),
  {
    pageSizeOptions: () => [10, 25, 50],
  },
)


const emit = defineEmits<{
  'update:currentPage': [page: number]
  'update:pageSize': [pageSize: number]
}>()


function goToPage(page: number) {
  if (
    page < 1 ||
    page > props.totalPages ||
    page === props.currentPage
  ) {
    return
  }

  emit('update:currentPage', page)
}

function updatePageSize(event: Event) {
  const pageSize = Number(
    (event.target as HTMLSelectElement).value,
  )

  emit('update:pageSize', pageSize)
}
</script>

<template>
  <div
    v-if="totalPages > 1 || pageSizeOptions?.length"
    class="
      flex
      items-center
      justify-between
      border-t
      border-gray-200
      px-4 py-3
      sm:px-6
    "
  >
    <div class="flex items-center gap-3">
      <p class="text-xs text-gray-500">
        Page {{ currentPage }} of {{ totalPages }}
      </p>

      <label
        v-if="pageSizeOptions?.length"
        class="flex items-center gap-2 text-xs text-gray-500"
      >
        Rows per page
        <select
          :value="pageSize"
          class="rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm text-gray-600"
          @change="updatePageSize"
        >
          <option
            v-for="option in pageSizeOptions"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </select>
      </label>
    </div>

    <div class="flex items-center gap-1">
      <button
        type="button"
        class="
          rounded-lg
          border border-gray-200
          px-3 py-1.5
          text-sm
          text-gray-600
          hover:bg-gray-50
          disabled:opacity-40
        "
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        Previous
      </button>

      <button
        v-for="page in totalPages"
        :key="page"
        type="button"
        class="
          h-8 w-8
          rounded-lg
          text-sm
        "
        :class="
          page === currentPage
            ? 'bg-primary-600 text-white'
            : 'text-gray-600 hover:bg-gray-100'
        "
        @click="goToPage(page)"
      >
        {{ page }}
      </button>

      <button
        type="button"
        class="
          rounded-lg
          border border-gray-200
          px-3 py-1.5
          text-sm
          text-gray-600
          hover:bg-gray-50
          disabled:opacity-40
        "
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>
