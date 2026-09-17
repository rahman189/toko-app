enum ROLE {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF'
}

export function usePermission() {
  const authStore = useAuthStore()

  const isAdmin = computed(() => {
    return authStore.user?.role === ROLE.ADMIN
  })

  const isStaff = computed(() => {
    return authStore.user?.role === ROLE.STAFF
  })

  function hasRole(role: string) {
    return authStore.user?.role === role
  }

  return {
    isAdmin,
    isStaff,
    hasRole,
  }
}