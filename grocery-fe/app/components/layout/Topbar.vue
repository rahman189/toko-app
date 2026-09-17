<script setup lang="ts">
import {
  Menu,
  Bell,
  ChevronDown,
  User,
  LogOut,
} from 'lucide-vue-next'

const uiStore = useUiStore()

const profileOpen = ref(false)
const authStore = useAuthStore()

function toggleProfile() {
  profileOpen.value = !profileOpen.value
}

async function handleLogout() {
  authStore.clearAuth()
  await navigateTo('/login')
}
</script>

<template>
  <header
    class="
      sticky top-0 z-30
      flex h-16
      items-center justify-between
      border-b border-gray-200
      bg-white/95
      px-4
      backdrop-blur
      sm:px-6
    "
  >
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="
          rounded-lg
          p-2
          text-gray-600
          hover:bg-gray-100
          lg:hidden
        "
        @click="uiStore.openMobileSidebar"
      >
        <Menu class="h-5 w-5" />
      </button>

      <div>
        <p class="text-sm font-semibold text-gray-900">
          Admin Panel
        </p>

        <p class="hidden text-xs text-gray-500 sm:block">
          Grocery Management
        </p>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <div class="relative">
        <button
          type="button"
          class="
            flex items-center
            gap-2
            rounded-lg
            px-2 py-1.5
            hover:bg-gray-100
          "
          @click="toggleProfile"
        >
          <div
            class="
              flex h-8 w-8
              items-center justify-center
              rounded-full
              bg-primary-100
              text-sm font-semibold
              text-primary-600
            "
          >
            A
          </div>

          <div class="hidden text-left md:block">
            <p class="text-sm font-medium text-gray-900">
              {{ authStore.user?.name }}
            </p>

            <p class="text-xs text-gray-500">
              {{ authStore.user?.role === 'ADMIN' ? 'Administrator' : 'Staff' }}
            </p>
          </div>

          <ChevronDown
            class="
              hidden h-4 w-4
              text-gray-500
              md:block
            "
          />
        </button>

        <div
          v-if="profileOpen"
          class="
            absolute right-0 mt-2
            w-48
            rounded-xl
            border border-gray-200
            bg-white
            p-1
            shadow-lg
          "
        >
          <!-- next phase, gak sempeet -->
          <!-- <NuxtLink
            to="/profile"
            class="
              flex items-center gap-2
              rounded-lg
              px-3 py-2
              text-sm
              text-gray-700
              hover:bg-gray-100
            "
            @click="profileOpen = false"
          >
            <User class="h-4 w-4" />
            Profile
          </NuxtLink> -->

          <button
            type="button"
            class="
              flex w-full
              items-center gap-2
              rounded-lg
              px-3 py-2
              text-left
              text-sm
              text-danger-600
              hover:bg-danger-50
            "
            @click="handleLogout"
          >
            <LogOut class="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

    </div>
  </header>
</template>