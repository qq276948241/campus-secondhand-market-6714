<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Home, PlusCircle, User } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();

const isActive = (path: string) => {
  return route.path === path;
};

const navItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/publish', icon: PlusCircle, label: '发布' },
  { path: '/profile', icon: User, label: '我的' },
];
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 md:hidden">
    <div class="flex items-center justify-around h-16">
      <button
        v-for="item in navItems"
        :key="item.path"
        @click="router.push(item.path)"
        class="flex flex-col items-center justify-center flex-1 h-full"
      >
        <component
          :is="item.icon"
          class="w-6 h-6 transition-colors"
          :class="isActive(item.path) ? 'text-primary-500' : 'text-gray-400'"
        />
        <span
          class="text-xs mt-1 transition-colors"
          :class="isActive(item.path) ? 'text-primary-500 font-medium' : 'text-gray-500'"
        >
          {{ item.label }}
        </span>
      </button>
    </div>
  </nav>
</template>
