<script setup lang="ts">
import { Home, ShieldAlert } from 'lucide-vue-next';

definePageMeta({
  middleware: 'auth',
});

async function goHome() {
  await navigateTo('/products');
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-md text-center">
      <div class="mb-6 flex justify-center">
        <div
          class="flex h-16 w-16 items-center justify-center rounded-full bg-red-50"
        >
          <ShieldAlert class="h-8 w-8 text-red-500" />
        </div>
      </div>

      <p class="text-sm font-semibold uppercase tracking-wider text-red-500">
        Error 403
      </p>
      <h1 class="mt-2 text-2xl font-bold text-gray-900">Access Forbidden</h1>
      <p class="mt-3 text-sm leading-6 text-gray-500">
        Anda belum punya akses ke halaman ini. Jika anda merasa ini adalah
        sebuah kesalahan silakan hubungi Administrator
      </p>

      <!-- Actions -->
      <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <BaseButton @click="goHome">
          <Home class="mr-2 h-4 w-4" />
          Kembali ke halaman produk
        </BaseButton>
      </div>
    </div>
  </div>
</template>
