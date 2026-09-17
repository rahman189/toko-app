import { defineStore } from 'pinia'

import type { AuthUser } from '~/types/auth'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<AuthUser | null>(null)
    const accessToken = ref<string | null>(null)

    const isAuthenticated = computed(
      () => !!accessToken.value && !!user.value,
    )

    function setAuth(
      token: string,
      authUser: AuthUser,
    ) {
      accessToken.value = token
      user.value = authUser
    }

    function clearAuth() {
      accessToken.value = null
      user.value = null
    }

    return {
      user,
      accessToken,
      isAuthenticated,

      setAuth,
      clearAuth,
    }
  },
  {
    persist: {
      pick: [
        'accessToken',
        'user',
      ],
    },

  },
)