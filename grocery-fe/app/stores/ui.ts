import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', () => {
  const sidebarOpen = ref(true)
  const mobileSidebarOpen = ref(false)

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function openMobileSidebar() {
    mobileSidebarOpen.value = true
  }

  function closeMobileSidebar() {
    mobileSidebarOpen.value = false
  }

  return {
    sidebarOpen,
    mobileSidebarOpen,
    toggleSidebar,
    openMobileSidebar,
    closeMobileSidebar,
  }
})