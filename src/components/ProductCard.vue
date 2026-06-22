<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Heart } from 'lucide-vue-next'
import type { Product } from '@/types'
import { formatPrice, formatDate } from '@/utils/format'
import { useFavoriteStore } from '@/stores/favorite'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const props = defineProps<{
  product: Product
  showDelete?: boolean
}>()

const emit = defineEmits<{
  delete: [id: string]
}>()

const router = useRouter()
const favoriteStore = useFavoriteStore()
const userStore = useUserStore()
const { currentUser } = storeToRefs(userStore)

function goToDetail() {
  router.push(`/detail/${props.product.id}`)
}

function handleFavorite(event: Event) {
  event.stopPropagation()
  favoriteStore.toggleFavorite(props.product.id, currentUser.value.id)
}

function handleDelete(event: Event) {
  event.stopPropagation()
  emit('delete', props.product.id)
}

const isFavorited = () => favoriteStore.isFavorite(props.product.id, currentUser.value.id)
</script>

<template>
  <div class="card cursor-pointer group" @click="goToDetail">
    <div class="relative aspect-square overflow-hidden bg-gray-100">
      <img
        :src="product.images[0]"
        :alt="product.title"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div class="absolute top-2 right-2 flex gap-2">
        <button
          v-if="showDelete"
          class="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center transition-colors hover:bg-red-500"
          @click="handleDelete"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
        <button
          class="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center transition-all active:scale-90"
          :class="isFavorited() ? 'text-primary' : 'text-gray-400'"
          @click="handleFavorite"
        >
          <Heart :size="16" :fill="isFavorited() ? 'currentColor' : 'none'" />
        </button>
      </div>
      <div class="absolute bottom-2 left-2">
        <span class="px-2 py-0.5 bg-white/90 backdrop-blur rounded-full text-xs text-gray-500">
          {{ product.category }}
        </span>
      </div>
    </div>
    <div class="p-3">
      <h3 class="text-sm font-medium text-gray-800 line-clamp-2 h-10 leading-5 mb-2">
        {{ product.title }}
      </h3>
      <div class="flex items-end justify-between">
        <span class="text-lg font-bold text-primary">
          {{ formatPrice(product.price) }}
        </span>
        <span class="text-xs text-gray-400">
          {{ formatDate(product.createdAt) }}
        </span>
      </div>
    </div>
  </div>
</template>
