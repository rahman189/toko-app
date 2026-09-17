<script setup lang="ts">
defineProps<{
  modelValue: boolean
  title: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="
          fixed inset-0 z-50
          flex items-center justify-center
          p-4
        "
      >
        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-black/40"
          @click="close"
        />

        <!-- Modal -->
        <div
          class="
            relative z-10
            w-full max-w-lg
            overflow-hidden
            rounded-xl
            bg-white
            shadow-xl
          "
        >
          <!-- Header -->
          <div
            class="
              flex items-center
              justify-between
              border-b
              border-gray-200
              px-5 py-4
            "
          >
            <h2
              class="
                text-lg
                font-semibold
                text-gray-900
              "
            >
              {{ title }}
            </h2>

            <button
              type="button"
              class="
                rounded-lg
                p-1.5
                text-gray-400
                hover:bg-gray-100
                hover:text-gray-600
              "
              @click="close"
            >
              ✕
            </button>
          </div>

          <!-- Content -->
          <div class="p-5">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>