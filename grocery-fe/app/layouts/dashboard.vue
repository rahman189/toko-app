<script setup lang="ts">
const uiStore = useUiStore()
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Desktop Sidebar -->
    <aside
      class="
        fixed inset-y-0 left-0 z-40
        hidden lg:flex
        flex-col
        border-r border-gray-200
        bg-white
        transition-all duration-300
      "
      :class="uiStore.sidebarOpen ? 'w-64' : 'w-20'"
    >
      <LayoutSidebar />
    </aside>

    <!-- Mobile Sidebar -->
    <LayoutMobileSidebar />

    <!-- Main Application -->
    <div
      class="
        min-h-screen
        transition-all duration-300
      "
      :class="
        uiStore.sidebarOpen
          ? 'lg:pl-64'
          : 'lg:pl-20'
      "
    >
      <LayoutTopbar />

      <main
        class="
          min-h-[calc(100vh-113px)]
          p-4
          sm:p-6
          lg:p-8
        "
      >
        <slot />
      </main>

      <LayoutAppFooter />
    </div>
  </div>
</template>