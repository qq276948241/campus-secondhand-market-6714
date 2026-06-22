<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ArrowLeft, Heart, Share2, Shield } from 'lucide-vue-next'
import ImageCarousel from '@/components/ImageCarousel.vue'
import SellerCard from '@/components/SellerCard.vue'
import { useProductStore } from '@/stores/product'
import { useFavoriteStore } from '@/stores/favorite'
import { useUserStore } from '@/stores/user'
import { formatPrice, formatDate } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const favoriteStore = useFavoriteStore()
const userStore = useUserStore()
const { currentUser } = storeToRefs(userStore)

const productId = computed(() => route.params.id as string)
const product = computed(() => productStore.getProductById(productId.value))
const isFavorited = computed(() =>
  product.value ? favoriteStore.isFavorite(product.value.id, currentUser.value.id) : false
)

function goBack() {
  router.back()
}

function toggleFavorite() {
  if (product.value) {
    favoriteStore.toggleFavorite(product.value.id, currentUser.value.id)
  }
}

function handleShare() {
  if (product.value) {
    if (navigator.share) {
      navigator.share({
        title: product.value.title,
        text: product.value.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('链接已复制到剪贴板')
    }
  }
}

function handleContact() {
  if (product.value) {
    alert(`卖家联系方式：${product.value.contact}\n\n（实际项目中可接入微信/短信等功能）`)
  }
}
</script>

<template>
  <div v-if="product" class="min-h-screen bg-gray-50 pb-24">
    <header class="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div class="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <button
          class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-all active:scale-95"
          @click="goBack"
        >
          <ArrowLeft :size="20" />
        </button>
        <div class="flex items-center gap-2">
          <button
            class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-all active:scale-95"
            @click="handleShare"
          >
            <Share2 :size="20" />
          </button>
          <button
            class="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
            :class="isFavorited ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'"
            @click="toggleFavorite"
          >
            <Heart :size="20" :fill="isFavorited ? 'currentColor' : 'none'" />
          </button>
        </div>
      </div>
    </header>

    <main class="pt-14">
      <ImageCarousel :images="product.images" height="375px" />

      <div class="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div class="bg-white rounded-card p-5 shadow-card">
          <div class="flex items-start justify-between gap-4 mb-3">
            <h1 class="text-xl font-bold text-gray-800 flex-1">
              {{ product.title }}
            </h1>
            <span class="text-2xl font-bold text-primary whitespace-nowrap">
              {{ formatPrice(product.price) }}
            </span>
          </div>
          <div class="flex items-center gap-3 flex-wrap">
            <span class="px-3 py-1 bg-primary-50 text-primary rounded-full text-sm">
              {{ product.category }}
            </span>
            <span class="text-sm text-gray-400">
              {{ formatDate(product.createdAt) }}
            </span>
          </div>
        </div>

        <div class="bg-white rounded-card p-5 shadow-card">
          <h3 class="font-medium text-gray-800 mb-3">商品描述</h3>
          <p class="text-gray-600 leading-relaxed whitespace-pre-wrap">
            {{ product.description }}
          </p>
        </div>

        <SellerCard
          :avatar="product.sellerAvatar"
          :name="product.sellerName"
          :contact="product.contact"
          :created-at="product.createdAt"
        />

        <div class="flex items-center gap-2 p-4 bg-blue-50 rounded-card text-blue-600 text-sm">
          <Shield :size="18" class="flex-shrink-0" />
          <span>温馨提示：请优先选择校园当面交易，注意保护个人隐私和财产安全</span>
        </div>
      </div>
    </main>

    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 md:hidden">
      <div class="flex items-center h-16 px-4 gap-3">
        <button
          class="flex-1 btn-outline"
          @click="toggleFavorite"
        >
          <span class="flex items-center justify-center gap-2">
            <Heart :size="18" :fill="isFavorited ? 'currentColor' : 'none'" />
            {{ isFavorited ? '已收藏' : '收藏' }}
          </span>
        </button>
        <button
          class="flex-1 btn-primary"
          @click="handleContact"
        >
          联系卖家
        </button>
      </div>
    </div>

    <div class="hidden md:flex fixed bottom-6 right-6 gap-3 z-40">
      <button
        class="btn-outline"
        @click="toggleFavorite"
      >
        <span class="flex items-center gap-2">
          <Heart :size="18" :fill="isFavorited ? 'currentColor' : 'none'" />
          {{ isFavorited ? '已收藏' : '收藏' }}
        </span>
      </button>
      <button
        class="btn-primary"
        @click="handleContact"
      >
        联系卖家
      </button>
    </div>
  </div>

  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-center text-gray-400">
      <p>商品不存在或已被删除</p>
      <button class="mt-4 text-primary" @click="router.push('/')">返回首页</button>
    </div>
  </div>
</template>
