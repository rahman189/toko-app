<script setup lang="ts">
const uiStore = useUiStore()
</script>

<template>
  <Teleport to="body">
    <Transition name="mobile-menu">
      <div
        v-if="uiStore.mobileSidebarOpen"
        class="
          fixed inset-0 z-50
          lg:hidden
        "
      >

        <!-- Overlay -->
        <div
          class="
            absolute inset-0
            bg-black/40
          "
          @click="uiStore.closeMobileSidebar"
        />

        <!-- Drawer -->
        <aside
          class="
            relative z-10
            h-full
            w-72
            bg-white
            shadow-xl
          "
        >
          <LayoutSidebar />
        </aside>

      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.2s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}
</style>