<script setup lang="ts">
import {
  Package,
  FolderTree,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-vue-next'

const uiStore = useUiStore()

const menus = [
  {
    label: 'Categories',
    path: '/categories',
    icon: FolderTree,
  },
  {
    label: 'Products',
    path: '/products',
    icon: Package,
  },
]
</script>

<template>
  <div class="flex h-full flex-col">
    <div
      class="
        flex h-16 shrink-0
        items-center
        border-b border-gray-200
        px-4
      "
    >
      <div class="flex items-center gap-3">
        <div
          class="
            flex h-9 w-9 shrink-0
            items-center justify-center
            rounded-lg
            bg-primary-600
            text-sm font-bold text-white
          "
        >
          TA
        </div>

        <span
          v-if="uiStore.sidebarOpen"
          class="text-lg font-bold text-gray-900"
        >
          Toko App
        </span>
      </div>
    </div>

    <nav class="flex-1 space-y-1 overflow-y-auto p-3">

      <NuxtLink
        v-for="menu in menus"
        :key="menu.path"
        :to="menu.path"
        class="
          group
          flex items-center gap-3
          rounded-lg
          px-3 py-2.5
          text-sm font-medium
          text-gray-600
          transition
          hover:bg-gray-100
          hover:text-gray-900
        "
        active-class="bg-primary-50 text-primary-600"
      >
        <component
          :is="menu.icon"
          class="
            h-5 w-5
            shrink-0
          "
        />

        <span
          v-if="uiStore.sidebarOpen"
          class="truncate"
        >
          {{ menu.label }}
        </span>
      </NuxtLink>

    </nav>
    <div class="border-t border-gray-200 p-3">
      <button
        type="button"
        class="
          flex w-full
          items-center
          justify-center
          gap-2
          rounded-lg
          px-3 py-2
          text-sm
          text-gray-500
          transition
          hover:bg-gray-100
          hover:text-gray-900
        "
        @click="uiStore.toggleSidebar"
      >
        <PanelLeftClose
          v-if="uiStore.sidebarOpen"
          class="h-5 w-5"
        />

        <PanelLeftOpen
          v-else
          class="h-5 w-5"
        />

        <span v-if="uiStore.sidebarOpen">
          Minimalis Sidebar
        </span>
      </button>
    </div>
  </div>
</template>