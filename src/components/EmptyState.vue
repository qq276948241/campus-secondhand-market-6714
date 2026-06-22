<script setup lang="ts">
import { Package, Heart, PlusCircle } from 'lucide-vue-next'

const props = defineProps<{
  type: 'products' | 'favorites' | 'publish'
}>()

const config = {
  products: {
    icon: Package,
    title: '暂无商品',
    description: '还没有符合条件的商品，换个关键词试试吧',
  },
  favorites: {
    icon: Heart,
    title: '暂无收藏',
    description: '看到心仪的商品，点击爱心收藏吧',
  },
  publish: {
    icon: PlusCircle,
    title: '暂无发布',
    description: '你还没有发布过商品，快去发布吧',
  },
}
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-8">
    <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
      <component :is="config[type].icon" :size="36" class="text-gray-300" />
    </div>
    <h3 class="text-lg font-medium text-gray-600 mb-2">{{ config[type].title }}</h3>
    <p class="text-sm text-gray-400 text-center">{{ config[type].description }}</p>
  </div>
</template>
