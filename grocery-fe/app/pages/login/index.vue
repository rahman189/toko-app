<script setup lang="ts">
definePageMeta({
  middleware: 'guest',
})
import { ref } from 'vue'

import type { LoginDto } from '~/types/auth'

const { login } = useAuth()
const authStore = useAuthStore()

const loading = ref(false)
const errorMessage = ref('')

const form = ref<LoginDto>({
  email: '',
  password: '',
})

async function handleSubmit() {
  errorMessage.value = ''

  if (!form.value.email || !form.value.password) {
    errorMessage.value =
      'Email and password are required.'

    return
  }

  loading.value = true

  try {
    const response = await login(form.value)

    authStore.setAuth(
      response.accessToken,
      response.user,
    )

    await navigateTo('/products')
  } catch (error: any) {
    console.error(error)

    errorMessage.value =
      error?.data?.message ??
      'Invalid email or password.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gray-50 px-4"
  >
    <div class="w-full max-w-md">
      <div
        class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div class="mb-8 text-center">
          <h1 class="text-2xl font-semibold text-gray-900">
            Toko App
          </h1>

          <p class="mt-2 text-sm text-gray-500">
            Silakan masuk menggunakan akun
          </p>
        </div>

        <div
          v-if="errorMessage"
          class="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {{ errorMessage }}
        </div>

        <form
          class="space-y-5"
          @submit.prevent="handleSubmit"
        >
          <BaseInput
            v-model="form.email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            required
          />

          <BaseInput
            v-model="form.password"
            label="Kata Sandi"
            type="password"
            placeholder="••••••••"
            required
          />

          <BaseButton
            type="submit"
            variant="primary"
            class="w-full"
            :loading="loading"
          >
            Masuk
          </BaseButton>
        </form>

        <p class="mt-6 text-center text-sm text-gray-500">
          Tidak punya akun?

          <NuxtLink
            to="/register"
            class="font-medium text-primary-600 hover:text-primary-700"
          >
            Daftar
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>