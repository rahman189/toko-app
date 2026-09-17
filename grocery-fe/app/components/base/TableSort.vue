<script setup lang="ts">
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-vue-next';

type SortOrder = 'asc' | 'desc';

interface Props {
  column: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  sortable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  sortable: true,
});

const emit = defineEmits<{
  sort: [column: string];
}>();

const isActive = computed(() => {
  return props.sortBy === props.column;
});

function handleSort() {
  if (!props.sortable) {
    return;
  }

  emit('sort', props.column);
}
</script>

<template>
  <button
    v-if="sortable"
    type="button"
    class="inline-flex items-center gap-1 text-xs uppercase text-gray-500 transition hover:text-gray-900"
    @click="handleSort"
  >
    <slot />

    <ArrowUp v-if="isActive && sortOrder === 'asc'" class="size-3.5" />

    <ArrowDown v-else-if="isActive && sortOrder === 'desc'" class="size-3.5" />

    <ChevronsUpDown v-else class="size-3.5 text-gray-400" />
  </button>

  <span v-else>
    <slot />
  </span>
</template>
