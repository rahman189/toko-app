export function useApi() {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  return $fetch.create({
    baseURL: config.public.apiBaseUrl,

    onRequest({ options }) {
      const token = authStore.accessToken

      if (!token) {
        return
      }

      const headers = new Headers(options.headers)

      headers.set(
        'Authorization',
        `Bearer ${token}`,
      )

      options.headers = headers
    },

    async onResponseError({ response }) {
      console.error(
        `API Error [${response.status}]`,
        response._data,
      )

      if (response.status === 401) {
        authStore.clearAuth()

        await navigateTo('/login')
      }
    },
  })
}