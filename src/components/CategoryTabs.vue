<script setup lang="ts">
import { useCategories } from '@/composables/useCategories';

const emit = defineEmits<{
  (e: 'change', categoryId: string): void;
}>();

const { allCategories, activeCategoryId, iconMap, setActiveCategory } = useCategories();

const handleChange = (categoryId: string) => {
  setActiveCategory(categoryId);
  emit('change', categoryId);
};
</script>

<template>
  <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
    <button
      v-for="cat in allCategories"
      :key="cat.id"
      @click="handleChange(cat.id)"
      class="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all"
      :class="activeCategoryId === cat.id
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
