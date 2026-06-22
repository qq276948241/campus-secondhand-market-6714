<template>
  <div class="relative -mx-4 px-4">
    <div class="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="handleSelect(cat.id)"
        class="flex-shrink-0 flex items-center gap-1.5 h-9 px-4 rounded-full text-sm transition-all duration-200"
        :class="modelValue === cat.id
          ? 'bg-primary-500 text-white shadow-md shadow-primary-200'
          : 'bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-600'"
      >
        <component :is="iconMap[cat.icon]" class="w-4 h-4" />
        <span>{{ cat.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  LayoutGrid, Laptop, BookOpen, Shirt, Home, Dumbbell, MoreHorizontal
} from 'lucide-vue-next'
import type { Component } from 'vue'
import { categories } from '@/data/mock'

defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const iconMap: Record<string, Component> = {
  LayoutGrid,
  Laptop,
  BookOpen,
  Shirt,
  Home,
  Dumbbell,
  MoreHorizontal
}

function handleSelect(id: string) {
  emit('update:modelValue', id)
}
</script>
