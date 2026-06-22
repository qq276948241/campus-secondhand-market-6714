<script setup lang="ts">
import { CATEGORIES, type ProductCategory } from '@/types'

const props = defineProps<{
  modelValue: ProductCategory
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ProductCategory]
}>()

function selectCategory(category: ProductCategory) {
  emit('update:modelValue', category)
}
</script>

<template>
  <div class="overflow-x-auto hide-scrollbar -mx-4 px-4">
    <div class="flex gap-2 py-1 min-w-max">
      <button
        v-for="category in CATEGORIES"
        :key="category"
        class="tag whitespace-nowrap"
        :class="modelValue === category ? 'tag-active' : 'tag-inactive'"
        @click="selectCategory(category)"
      >
        {{ category }}
      </button>
    </div>
  </div>
</template>
