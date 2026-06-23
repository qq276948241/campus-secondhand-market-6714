<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Home, PlusCircle, User } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const currentRoute = computed(() => route.name as string)

function navigateTo(name: string) {
  router.push({ name })
}

const navItems = [
  { name: 'home', label: '首页', icon: Home },
  { name: 'publish', label: '发布', icon: PlusCircle },
  { name: 'profile', label: '我的', icon: User },
]
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-gray-100 safe-area-inset">
    <div class="flex items-center justify-around h-16">
      <button
        v-for="item in navItems"
        :key="item.name"
        class="flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-colors duration-200"
        :class="currentRoute === item.name ? 'text-brand-500' : 'text-gray-400'"
        @click="navigateTo(item.name)"
      >
        <component :is="item.icon" :size="22" :stroke-width="currentRoute === item.name ? 2.5 : 1.8" />
        <span class="text-[10px] font-medium">{{ item.label }}</span>
      </button>
    </div>
  </nav>

  <nav class="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
    <div class="container flex items-center justify-between h-16">
      <router-link to="/" class="flex items-center gap-2">
        <div class="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
          <span class="text-white text-sm font-bold">二</span>
        </div>
        <span class="text-lg font-bold text-gray-800">校园二手集市</span>
      </router-link>
      <div class="flex items-center gap-1">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="{ name: item.name }"
          class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200"
          :class="currentRoute === item.name
            ? 'bg-brand-50 text-brand-600'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'"
        >
          <component :is="item.icon" :size="18" />
          <span>{{ item.label }}</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.safe-area-inset {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
