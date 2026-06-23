<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Product } from '@/types'
import { useProducts } from '@/composables/useProducts'
import { MapPin } from 'lucide-vue-next'

const props = defineProps<{
  product: Product
}>()

const router = useRouter()
const { getCategoryById, getUserById } = useProducts()

const category = getCategoryById(props.product.categoryId)
const seller = getUserById(props.product.sellerId)

function goToDetail() {
  router.push({ name: 'product', params: { id: props.product.id } })
}

function formatPrice(price: number): string {
  return price.toFixed(0)
}

function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}
</script>

<template>
  <div
    class="card cursor-pointer group"
    @click="goToDetail"
  >
    <div class="relative overflow-hidden aspect-[4/3]">
      <img
        :src="product.images[0]"
        :alt="product.title"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div
        v-if="product.isSold"
        class="absolute inset-0 bg-black/40 flex items-center justify-center"
      >
        <span class="text-white font-bold text-lg">已售出</span>
      </div>
      <span
        v-if="category"
        class="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-gray-700 text-[11px] px-2 py-0.5 rounded-lg font-medium"
      >
        {{ category.name }}
      </span>
    </div>
    <div class="p-3">
      <h3 class="text-sm font-medium text-gray-800 line-clamp-2 leading-snug mb-2">
        {{ product.title }}
      </h3>
      <div class="flex items-baseline gap-2 mb-2">
        <span class="text-brand-500 font-bold text-lg">¥{{ formatPrice(product.price) }}</span>
        <span v-if="product.originalPrice" class="text-gray-400 text-xs line-through">
          ¥{{ formatPrice(product.originalPrice) }}
        </span>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1">
          <span class="badge-brand text-[10px]">{{ product.condition }}</span>
        </div>
        <span class="text-gray-400 text-[10px]">{{ timeAgo(product.createdAt) }}</span>
      </div>
    </div>
  </div>
</template>
