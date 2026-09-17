<script setup lang="ts">
import {
  CheckCircle2,
  CircleAlert,
  Info,
  TriangleAlert,
  X,
} from 'lucide-vue-next'

const toast = useToast()

const typeConfig = {
  success: {
    icon: CheckCircle2,
    container:
      'border-green-200 bg-green-50 text-green-800',
    iconClass: 'text-green-600',
  },

  error: {
    icon: CircleAlert,
    container:
      'border-red-200 bg-red-50 text-red-800',
    iconClass: 'text-red-600',
  },

  warning: {
    icon: TriangleAlert,
    container:
      'border-yellow-200 bg-yellow-50 text-yellow-800',
    iconClass: 'text-yellow-600',
  },

  info: {
    icon: Info,
    container:
      'border-blue-200 bg-blue-50 text-blue-800',
    iconClass: 'text-blue-600',
  },
} as const

</script>

<template>
  <div
    class="pointer-events-none fixed right-4 top-4 z-[9999] flex w-full max-w-sm flex-col gap-3"
  >
    <TransitionGroup
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-x-4 opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="translate-x-4 opacity-0"
    >
      <div
        v-for="item in toast.toasts.value"
        :key="item.id"
        class="pointer-events-auto relative flex items-start gap-3 rounded-lg border p-4 shadow-lg"
        :class="typeConfig[item.type].container"
      >
        <component
          :is="typeConfig[item.type].icon"
          class="mt-0.5 h-5 w-5 shrink-0"
          :class="typeConfig[item.type].iconClass"
          aria-hidden="true"
        />

        <div class="min-w-0 flex-1">
          <p
            v-if="item.title"
            class="text-sm font-semibold"
          >
            {{ item.title }}
          </p>

          <p class="mt-0.5 text-sm">
            {{ item.message }}
          </p>
        </div>

        <button
          type="button"
          class="shrink-0 rounded-md p-1 opacity-60 transition hover:bg-black/5 hover:opacity-100"
          aria-label="Close notification"
          @click="toast.remove(item.id)"
        >
          <X class="h-4 w-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>