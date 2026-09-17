export default defineNuxtRouteMiddleware(() => {
  const { isAdmin } = usePermission()

  if (!isAdmin.value) {
    return navigateTo('/forbidden')
  }
})