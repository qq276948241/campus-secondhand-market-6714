<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'

const route = useRoute()
const showNav = computed(() => {
  return !route.path.startsWith('/product')
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <main class="flex-1 pb-20 lg:pb-0">
      <router-view />
    </main>
    <NavBar v-if="showNav" />
  </div>
</template>
