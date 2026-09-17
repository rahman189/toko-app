<script setup lang="ts">
interface Props {
  rows?: number
  columns?: number
}

withDefaults(defineProps<Props>(), {
  rows: 5,
  columns: 5,
})
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full text-left text-sm">
      <thead>
        <tr class="border-b border-gray-200 bg-gray-50">
          <th
            v-for="column in columns"
            :key="column"
            class="px-4 py-3"
          >
            <div
              class="h-4 animate-pulse rounded bg-gray-200"
              :class="
                column === 1
                  ? 'w-10'
                  : 'w-24'
              "
            />
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="row in rows"
          :key="row"
          class="border-b border-gray-100 last:border-0"
        >
          <td
            v-for="column in columns"
            :key="column"
            class="px-4 py-4"
          >
            <div
              class="h-4 animate-pulse rounded bg-gray-200"
              :class="
                column === 1
                  ? 'w-8'
                  : column === columns
                    ? 'ml-auto w-20'
                    : 'w-32'
              "
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>