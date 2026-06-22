<template>
  <div class="min-h-screen bg-gray-50 pb-24">
    <Header />
    <main class="max-w-4xl mx-auto pt-20 pb-8 px-4">
      <div class="bg-gradient-to-r from-primary-500 to-primary-400 rounded-card p-5 md:p-6 text-white mb-5">
        <div class="flex items-center gap-4">
          <img
            :src="user.avatar"
            :alt="user.name"
            class="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white/30 object-cover"
          />
          <div class="flex-1">
            <h1 class="text-xl md:text-2xl font-bold mb-1">{{ user.name }}</h1>
            <p class="text-sm text-white/80">校园二手交易平台用户</p>
            <div class="flex items-center gap-4 mt-2">
              <span class="flex items-center gap-1 text-sm">
                <Package class="w-4 h-4" />
                {{ myProducts.length }} 件发布
              </span>
              <span class="flex items-center gap-1 text-sm">
                <Heart class="w-4 h-4" />
                {{ favoriteProducts.length }} 件收藏
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-card overflow-hidden">
        <div class="flex border-b border-gray-100">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            class="flex-1 h-12 text-sm font-medium transition-colors relative"
            :class="activeTab === tab.key ? 'text-primary-500' : 'text-gray-500 hover:text-gray-700'"
          >
            {{ tab.label }}
            <span
              v-if="activeTab === tab.key"
              class="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-primary-500 rounded-full"
            />
          </button>
        </div>

        <div v-if="activeTab === 'publish'" class="p-4">
          <div v-if="myProducts.length === 0" class="py-16 text-center">
            <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
              <Package class="w-8 h-8 text-gray-400" />
            </div>
            <p class="text-gray-500 mb-1">还没有发布商品</p>
            <router-link
              to="/publish"
              class="inline-block mt-3 px-5 h-9 rounded-full bg-primary-500 text-white text-sm hover:bg-primary-600 transition-colors"
            >
              去发布
            </router-link>
          </div>
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <div v-for="product in myProducts" :key="product.id" class="relative">
              <ProductCard :product="product" />
              <button
                @click="handleDelete(product)"
                class="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'favorite'" class="p-4">
          <div v-if="favoriteProducts.length === 0" class="py-16 text-center">
            <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
              <Heart class="w-8 h-8 text-gray-400" />
            </div>
            <p class="text-gray-500 mb-1">还没有收藏商品</p>
            <router-link
              to="/"
              class="inline-block mt-3 px-5 h-9 rounded-full bg-primary-500 text-white text-sm hover:bg-primary-600 transition-colors"
            >
              去逛逛
            </router-link>
          </div>
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <div v-for="product in favoriteProducts" :key="product.id" class="relative">
              <ProductCard :product="product" />
              <button
                @click="handleUnfavorite(product.id)"
                class="absolute top-2 right-2 w-7 h-7 rounded-full bg-primary-500 text-white flex items-center justify-center"
              >
                <Heart class="w-4 h-4 fill-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="showDeleteConfirm = false"
    >
      <div class="w-[85%] max-w-sm bg-white rounded-2xl p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">确认删除</h3>
        <p class="text-sm text-gray-500 mb-5">确定要删除这件商品吗？删除后无法恢复。</p>
        <div class="flex gap-3">
          <button
            @click="showDeleteConfirm = false"
            class="flex-1 h-10 rounded-full border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            @click="confirmDelete"
            class="flex-1 h-10 rounded-full bg-red-500 text-white text-sm hover:bg-red-600 transition-colors"
          >
            删除
          </button>
        </div>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Package, Heart, Trash2 } from 'lucide-vue-next'
import Header from '@/components/Header.vue'
import BottomNav from '@/components/BottomNav.vue'
import ProductCard from '@/components/ProductCard.vue'
import { mockProducts, currentUser } from '@/data/mock'
import {
  getMyProducts, removeMyProduct,
  getMyFavorites, removeFavorite
} from '@/utils/storage'
import type { Product } from '@/types'

const user = currentUser
const activeTab = ref<'publish' | 'favorite'>('publish')
const showDeleteConfirm = ref(false)
const productToDelete = ref<Product | null>(null)
const refreshKey = ref(0)

const tabs = [
  { key: 'publish' as const, label: '我的发布' },
  { key: 'favorite' as const, label: '我的收藏' }
]

const myProducts = computed<Product[]>(() => {
  refreshKey.value
  return getMyProducts().map(p => ({ ...p, isMyPublish: true }))
})

const favoriteProducts = computed<Product[]>(() => {
  refreshKey.value
  const favoriteIds = getMyFavorites()
  const allProducts: Product[] = [...getMyProducts(), ...mockProducts]
  return allProducts.filter(p => favoriteIds.includes(p.id))
})

function handleDelete(product: Product) {
  productToDelete.value = product
  showDeleteConfirm.value = true
}

function confirmDelete() {
  if (productToDelete.value) {
    removeMyProduct(productToDelete.value.id)
    removeFavorite(productToDelete.value.id)
    refreshKey.value++
  }
  showDeleteConfirm.value = false
  productToDelete.value = null
}

function handleUnfavorite(productId: string) {
  removeFavorite(productId)
  refreshKey.value++
}
</script>
