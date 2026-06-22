<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Home, Search, PlusCircle, User } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const currentPath = computed(() => route.path)

const navItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/', icon: Search, label: '分类' },
  { path: '/publish', icon: PlusCircle, label: '发布', isCenter: true },
  { path: '/', icon: Home, label: '消息' },
  { path: '/profile', icon: User, label: '我的' },
]

function navigate(path: string, isCenter?: boolean) {
  if (isCenter) {
    router.push(path)
  } else if (path === '/') {
    router.push(path)
  } else {
    router.push(path)
  }
}
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 md:hidden safe-area-bottom">
    <div class="flex items-center h-16">
      <template v-for="(item, index) in navItems" :key="index">
        <div
          v-if="item.isCenter"
          class="flex-1 flex justify-center"
        >
          <button
            class="relative -top-5 w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95"
            @click="navigate(item.path, item.isCenter)"
          >
            <component :is="item.icon" :size="28" :stroke-width="2.5" />
          </button>
        </div>
        <button
          v-else
          class="flex-1 flex flex-col items-center justify-center gap-1 h-full transition-colors"
          :class="currentPath === item.path ? 'text-primary' : 'text-gray-400'"
          @click="navigate(item.path, item.isCenter)"
        >
          <component :is="item.icon" :size="22" />
          <span class="text-xs">{{ item.label }}</span>
        </button>
      </template>
    </div>
  </nav>
</template>
