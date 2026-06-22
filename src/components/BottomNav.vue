<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 md:hidden">
    <div class="flex items-center justify-around h-16">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-colors"
        :class="isActive(item.path) ? 'text-primary-500' : 'text-gray-500'"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span class="text-xs">{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Home, PlusCircle, User } from 'lucide-vue-next'

const route = useRoute()

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/publish', label: '发布', icon: PlusCircle },
  { path: '/profile', label: '我的', icon: User }
]

function isActive(path: string): boolean {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>
