<script setup lang="ts">
import { ref } from 'vue';
import { Grid3X3, Smartphone, BookOpen, Shirt, Home, Dumbbell, Cookie, MoreHorizontal } from 'lucide-vue-next';

defineProps<{
  categories: Array<{ id: string; name: string; icon: string }>;
  activeCategory: string;
}>();

const emit = defineEmits<{
  (e: 'change', categoryId: string): void;
}>();

const iconMap: Record<string, any> = {
  'grid': Grid3X3,
  'smartphone': Smartphone,
  'book-open': BookOpen,
  'shirt': Shirt,
  'home': Home,
  'dumbbell': Dumbbell,
  'cookie': Cookie,
  'more-horizontal': MoreHorizontal,
};
</script>

<template>
  <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
    <button
      v-for="cat in categories"
      :key="cat.id"
      @click="emit('change', cat.id)"
      class="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all"
      :class="activeCategory === cat.id 
        ? 'bg-primary-500 text-white shadow-md' 
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
    >
      <component :is="iconMap[cat.icon]" class="w-4 h-4" />
      {{ cat.name }}
    </button>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
