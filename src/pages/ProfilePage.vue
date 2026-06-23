<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProducts } from '@/composables/useProducts'
import { useFavorites } from '@/composables/useFavorites'
import { currentUser } from '@/mock/data'
import ProductCard from '@/components/ProductCard.vue'
import { Package, Heart, Trash2, ToggleLeft, ToggleRight } from 'lucide-vue-next'

const router = useRouter()
const { getProductsBySeller, deleteProduct, toggleSoldStatus } = useProducts()
const { getFavoriteProducts, toggleFavorite } = useFavorites()

const activeTab = ref<'published' | 'favorites'>('published')

const myProducts = computed(() => getProductsBySeller(currentUser.id))
const favoriteProducts = computed(() => getFavoriteProducts())

function handleDelete(id: number) {
  if (confirm('确定要删除这个商品吗？')) {
    deleteProduct(id)
  }
}

function handleToggleSold(id: number) {
  toggleSoldStatus(id)
}

function handleUnfavorite(id: number) {
  toggleFavorite(id)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 lg:pt-16">
    <div class="bg-gradient-to-br from-brand-500 to-brand-600 text-white">
      <div class="container pt-12 pb-8 lg:pt-8">
        <div class="flex items-center gap-4">
          <img
            :src="currentUser.avatar"
            :alt="currentUser.nickname"
            class="w-16 h-16 rounded-2xl border-2 border-white/30 object-cover"
          />
          <div>
            <h1 class="text-xl font-bold">{{ currentUser.nickname }}</h1>
            <p class="text-white/70 text-sm mt-0.5">校园认证用户</p>
          </div>
        </div>
        <div class="flex gap-6 mt-5">
          <div class="text-center">
            <p class="text-2xl font-bold">{{ myProducts.length }}</p>
            <p class="text-white/60 text-xs mt-0.5">发布</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold">{{ favoriteProducts.length }}</p>
            <p class="text-white/60 text-xs mt-0.5">收藏</p>
          </div>
        </div>
      </div>
    </div>

    <div class="container -mt-4">
      <div class="bg-white rounded-2xl overflow-hidden">
        <div class="flex border-b border-gray-100">
          <button
            class="flex-1 py-3 text-sm font-medium relative transition-colors"
            :class="activeTab === 'published' ? 'text-brand-500' : 'text-gray-500'"
            @click="activeTab = 'published'"
          >
            <span class="flex items-center justify-center gap-1.5">
              <Package :size="16" />
              我的发布
            </span>
            <div
              v-if="activeTab === 'published'"
              class="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-brand-500 rounded-full"
            />
          </button>
          <button
            class="flex-1 py-3 text-sm font-medium relative transition-colors"
            :class="activeTab === 'favorites' ? 'text-brand-500' : 'text-gray-500'"
            @click="activeTab = 'favorites'"
          >
            <span class="flex items-center justify-center gap-1.5">
              <Heart :size="16" />
              我的收藏
            </span>
            <div
              v-if="activeTab === 'favorites'"
              class="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-brand-500 rounded-full"
            />
          </button>
        </div>

        <div v-if="activeTab === 'published'" class="p-4">
          <div v-if="myProducts.length === 0" class="text-center py-16">
            <Package :size="40" class="mx-auto text-gray-300 mb-3" />
            <p class="text-gray-400 text-sm mb-4">还没有发布商品</p>
            <button class="btn-primary text-sm" @click="router.push({ name: 'publish' })">
              去发布
            </button>
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="product in myProducts"
              :key="product.id"
              class="flex gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <img
                :src="product.images[0]"
                :alt="product.title"
                class="w-20 h-20 rounded-xl object-cover flex-shrink-0 cursor-pointer"
                @click="router.push({ name: 'product', params: { id: product.id } })"
              />
              <div class="flex-1 min-w-0">
                <h3
                  class="text-sm font-medium text-gray-800 line-clamp-1 cursor-pointer hover:text-brand-500"
                  @click="router.push({ name: 'product', params: { id: product.id } })"
                >
                  {{ product.title }}
                </h3>
                <p class="text-brand-500 font-bold mt-1">¥{{ product.price.toFixed(0) }}</p>
                <div class="flex items-center gap-1.5 mt-1">
                  <span v-if="product.isSold" class="badge bg-red-50 text-red-500 text-[10px]">已售出</span>
                  <span v-else class="badge-brand text-[10px]">{{ product.condition }}</span>
                </div>
                <div class="flex items-center gap-2 mt-2">
                  <button
                    class="flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors"
                    :class="product.isSold
                      ? 'text-green-600 bg-green-50 hover:bg-green-100'
                      : 'text-gray-500 bg-gray-50 hover:bg-gray-100'"
                    @click="handleToggleSold(product.id)"
                    :title="product.isSold ? '标记为在售' : '标记为已售'"
                  >
                    <ToggleRight v-if="product.isSold" :size="14" />
                    <ToggleLeft v-else :size="14" />
                    {{ product.isSold ? '在售' : '已售' }}
                  </button>
                  <button
                    class="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
                    @click="handleDelete(product.id)"
                  >
                    <Trash2 :size="14" />
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'favorites'" class="p-4">
          <div v-if="favoriteProducts.length === 0" class="text-center py-16">
            <Heart :size="40" class="mx-auto text-gray-300 mb-3" />
            <p class="text-gray-400 text-sm mb-4">还没有收藏商品</p>
            <button class="btn-primary text-sm" @click="router.push({ name: 'home' })">
              去逛逛
            </button>
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="product in favoriteProducts"
              :key="product.id"
              class="flex gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <img
                :src="product.images[0]"
                :alt="product.title"
                class="w-20 h-20 rounded-xl object-cover flex-shrink-0 cursor-pointer"
                @click="router.push({ name: 'product', params: { id: product.id } })"
              />
              <div class="flex-1 min-w-0">
                <h3
                  class="text-sm font-medium text-gray-800 line-clamp-1 cursor-pointer hover:text-brand-500"
                  @click="router.push({ name: 'product', params: { id: product.id } })"
                >
                  {{ product.title }}
                </h3>
                <p class="text-brand-500 font-bold mt-1">¥{{ product.price.toFixed(0) }}</p>
                <div class="flex items-center gap-1.5 mt-1">
                  <span v-if="product.isSold" class="badge bg-red-50 text-red-500 text-[10px]">已售出</span>
                  <span v-else class="badge-brand text-[10px]">{{ product.condition }}</span>
                </div>
                <div class="mt-2">
                  <button
                    class="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-gray-500 bg-gray-50 hover:bg-red-50 hover:text-red-500 transition-colors"
                    @click="handleUnfavorite(product.id)"
                  >
                    <Heart :size="14" fill="currentColor" />
                    取消收藏
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
