<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProducts } from '@/composables/useProducts'
import { useFavorites } from '@/composables/useFavorites'
import { ArrowLeft, Heart, MessageCircle, Phone, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const { getProductById, getCategoryById, getUserById } = useProducts()
const { isFavorited, toggleFavorite } = useFavorites()

const productId = computed(() => Number(route.params.id))
const product = computed(() => getProductById(productId.value))
const category = computed(() => product.value ? getCategoryById(product.value.categoryId) : undefined)
const seller = computed(() => product.value ? getUserById(product.value.sellerId) : undefined)
const favorited = computed(() => isFavorited(productId.value))

const currentImageIndex = ref(0)
const touchStartX = ref(0)
let autoPlayTimer: ReturnType<typeof setInterval> | null = null

function nextImage() {
  if (!product.value) return
  currentImageIndex.value = (currentImageIndex.value + 1) % product.value.images.length
}

function prevImage() {
  if (!product.value) return
  currentImageIndex.value = (currentImageIndex.value - 1 + product.value.images.length) % product.value.images.length
}

function goToImage(index: number) {
  currentImageIndex.value = index
}

function handleTouchStart(e: TouchEvent) {
  touchStartX.value = e.touches[0].clientX
}

function handleTouchEnd(e: TouchEvent) {
  const diff = touchStartX.value - e.changedTouches[0].clientX
  if (Math.abs(diff) > 50) {
    if (diff > 0) nextImage()
    else prevImage()
  }
}

function startAutoPlay() {
  stopAutoPlay()
  autoPlayTimer = setInterval(nextImage, 4000)
}

function stopAutoPlay() {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

function goBack() {
  router.back()
}

function formatPrice(price: number): string {
  return price.toFixed(0)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function copyContact(value: string) {
  navigator.clipboard.writeText(value).then(() => {
    alert('已复制: ' + value)
  }).catch(() => {
    const input = document.createElement('input')
    input.value = value
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    alert('已复制: ' + value)
  })
}

onMounted(() => {
  if (product.value && product.value.images.length > 1) {
    startAutoPlay()
  }
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<template>
  <div v-if="product" class="min-h-screen bg-gray-50 pb-24">
    <div class="sticky top-0 z-50 bg-white/80 backdrop-blur-lg">
      <div class="container flex items-center justify-between h-12">
        <button
          class="p-2 -ml-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
          @click="goBack"
        >
          <ArrowLeft :size="22" />
        </button>
        <span class="text-sm font-medium text-gray-600">商品详情</span>
        <button
          class="p-2 -mr-2 rounded-xl transition-colors"
          :class="favorited ? 'text-brand-500' : 'text-gray-400 hover:bg-gray-100'"
          @click="toggleFavorite(productId)"
        >
          <Heart :size="22" :fill="favorited ? 'currentColor' : 'none'" />
        </button>
      </div>
    </div>

    <div
      class="relative overflow-hidden bg-white"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    >
      <div
        class="flex transition-transform duration-300 ease-out"
        :style="{ transform: `translateX(-${currentImageIndex * 100}%)` }"
      >
        <div
          v-for="(img, idx) in product.images"
          :key="idx"
          class="w-full flex-shrink-0"
        >
          <img :src="img" :alt="product.title" class="w-full aspect-square object-cover" />
        </div>
      </div>

      <button
        v-if="product.images.length > 1"
        class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:bg-white transition-colors"
        @click="prevImage"
      >
        <ChevronLeft :size="18" />
      </button>
      <button
        v-if="product.images.length > 1"
        class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:bg-white transition-colors"
        @click="nextImage"
      >
        <ChevronRight :size="18" />
      </button>

      <div
        v-if="product.images.length > 1"
        class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5"
      >
        <button
          v-for="(_, idx) in product.images"
          :key="idx"
          class="w-2 h-2 rounded-full transition-all duration-200"
          :class="currentImageIndex === idx ? 'bg-brand-500 w-5' : 'bg-white/70'"
          @click="goToImage(idx)"
        />
      </div>
    </div>

    <div class="container py-4 space-y-3">
      <div class="bg-white rounded-2xl p-4">
        <div class="flex items-baseline gap-3 mb-2">
          <span class="text-brand-500 font-bold text-2xl">¥{{ formatPrice(product.price) }}</span>
          <span v-if="product.originalPrice" class="text-gray-400 text-sm line-through">
            原价 ¥{{ formatPrice(product.originalPrice) }}
          </span>
        </div>
        <h1 class="text-lg font-bold text-gray-800 mb-3">{{ product.title }}</h1>
        <div class="flex items-center gap-2 flex-wrap">
          <span class="badge-brand">{{ product.condition }}</span>
          <span v-if="category" class="badge-gray">{{ category.name }}</span>
          <span v-if="product.isSold" class="badge bg-red-50 text-red-500">已售出</span>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4">
        <h2 class="text-sm font-bold text-gray-700 mb-2">商品描述</h2>
        <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{{ product.description }}</p>
        <div class="mt-3 pt-3 border-t border-gray-50">
          <span class="text-xs text-gray-400">发布于 {{ formatDate(product.createdAt) }}</span>
        </div>
      </div>

      <div v-if="seller" class="bg-white rounded-2xl p-4">
        <h2 class="text-sm font-bold text-gray-700 mb-3">卖家信息</h2>
        <div class="flex items-center gap-3 mb-3">
          <img :src="seller.avatar" :alt="seller.nickname" class="w-11 h-11 rounded-full object-cover" />
          <div>
            <p class="font-medium text-gray-800">{{ seller.nickname }}</p>
            <p class="text-xs text-gray-400">校园认证用户</p>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <button
            v-if="seller.wechat"
            class="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100 transition-colors"
            @click="copyContact(seller.wechat)"
          >
            <MessageCircle :size="16" />
            <span>微信: {{ seller.wechat }}</span>
            <span class="ml-auto text-[10px] text-green-500">点击复制</span>
          </button>
          <button
            v-if="seller.phone"
            class="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors"
            @click="copyContact(seller.phone)"
          >
            <Phone :size="16" />
            <span>手机: {{ seller.phone }}</span>
            <span class="ml-auto text-[10px] text-blue-500">点击复制</span>
          </button>
        </div>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 safe-area-inset">
      <div class="container flex items-center gap-3 py-3">
        <button
          class="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border-2 transition-colors"
          :class="favorited
            ? 'border-brand-500 text-brand-500 bg-brand-50'
            : 'border-gray-200 text-gray-500 hover:border-brand-300'"
          @click="toggleFavorite(productId)"
        >
          <Heart :size="18" :fill="favorited ? 'currentColor' : 'none'" />
          <span class="text-sm font-medium">{{ favorited ? '已收藏' : '收藏' }}</span>
        </button>
        <button
          v-if="seller"
          class="flex-1 btn-primary flex items-center justify-center gap-2"
          @click="copyContact(seller.wechat || seller.phone)"
        >
          <MessageCircle :size="18" />
          <span>联系卖家</span>
        </button>
      </div>
    </div>
  </div>

  <div v-else class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <p class="text-gray-400 mb-4">商品不存在或已下架</p>
      <button class="btn-primary" @click="router.push({ name: 'home' })">返回首页</button>
    </div>
  </div>
</template>

<style scoped>
.safe-area-inset {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
