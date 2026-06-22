import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'
import type { Favorite, Product } from '@/types'
import { storage } from '@/utils/storage'
import { generateId } from '@/utils/format'
import { useProductStore } from './product'

export const useFavoriteStore = defineStore('favorite', () => {
  const favorites = ref<Favorite[]>(storage.get('favorites', [] as Favorite[]))

  watch(
    favorites,
    (newVal) => {
      storage.set('favorites', newVal)
    },
    { deep: true }
  )

  const favoriteProducts = computed<Product[]>(() => {
    const productStore = useProductStore()
    return favorites.value
      .map((f) => productStore.getProductById(f.productId))
      .filter((p): p is Product => p !== undefined)
      .sort((a, b) => {
        const fa = favorites.value.find((f) => f.productId === a.id)
        const fb = favorites.value.find((f) => f.productId === b.id)
        if (!fa || !fb) return 0
        return new Date(fb.createdAt).getTime() - new Date(fa.createdAt).getTime()
      })
  })

  function isFavorite(productId: string, userId: string): boolean {
    return favorites.value.some((f) => f.productId === productId && f.userId === userId)
  }

  function toggleFavorite(productId: string, userId: string) {
    const index = favorites.value.findIndex((f) => f.productId === productId && f.userId === userId)
    if (index > -1) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.push({
        id: generateId(),
        productId,
        userId,
        createdAt: new Date().toISOString(),
      })
    }
  }

  function removeFavorite(productId: string, userId: string) {
    const index = favorites.value.findIndex((f) => f.productId === productId && f.userId === userId)
    if (index > -1) {
      favorites.value.splice(index, 1)
    }
  }

  return {
    favorites,
    favoriteProducts,
    isFavorite,
    toggleFavorite,
    removeFavorite,
  }
})
