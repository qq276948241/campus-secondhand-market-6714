import { ref, computed } from 'vue'
import { initialFavorites, products as mockProducts } from '@/mock/data'
import type { Favorite, Product } from '@/types'

const favorites = ref<Favorite[]>([...initialFavorites])

export function useFavorites() {
  const favoriteList = computed(() => favorites.value)

  function isFavorited(productId: number): boolean {
    return favorites.value.some((f) => f.productId === productId)
  }

  function toggleFavorite(productId: number) {
    const idx = favorites.value.findIndex((f) => f.productId === productId)
    if (idx !== -1) {
      favorites.value.splice(idx, 1)
    } else {
      favorites.value.push({
        id: Math.max(0, ...favorites.value.map((f) => f.id)) + 1,
        userId: 1,
        productId,
        createdAt: new Date().toISOString(),
      })
    }
  }

  function getFavoriteProducts(): Product[] {
    return favorites.value
      .map((f) => mockProducts.find((p) => p.id === f.productId))
      .filter((p): p is Product => p !== undefined)
  }

  return {
    favoriteList,
    isFavorited,
    toggleFavorite,
    getFavoriteProducts,
  }
}
