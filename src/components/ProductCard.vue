<template>
  <router-link
    :to="`/product/${product.id}`"
    class="group block bg-white rounded-card shadow-card overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
  >
    <div class="relative aspect-square bg-gray-100 overflow-hidden">
      <img
        :src="product.images[0]"
        :alt="product.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div v-if="product.isMyPublish" class="absolute top-2 left-2 px-2 py-0.5 rounded bg-primary-500 text-white text-xs">
        我的
      </div>
    </div>
    <div class="p-3">
      <h3 class="text-sm text-gray-800 line-clamp-2 leading-snug min-h-[2.5rem] mb-2 group-hover:text-primary-600 transition-colors">
        {{ product.title }}
      </h3>
      <div class="flex items-end justify-between">
        <div class="flex items-baseline gap-0.5">
          <span class="text-xs text-primary-500">¥</span>
          <span class="text-lg font-bold text-primary-500">{{ product.price }}</span>
        </div>
        <div class="flex items-center gap-1 text-gray-400 text-xs">
          <Eye class="w-3 h-3" />
          <span>{{ product.views }}</span>
        </div>
      </div>
      <div class="mt-2 flex items-center gap-1.5">
        <img :src="product.seller.avatar" alt="seller" class="w-4 h-4 rounded-full object-cover" />
        <span class="text-xs text-gray-500 truncate">{{ product.seller.name }}</span>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { Eye } from 'lucide-vue-next'
import type { Product } from '@/types'

defineProps<{
  product: Product
}>()
</script>
