<template>
  <div class="min-h-screen bg-gray-50 pb-24">
    <Header />
    <main v-if="product" class="max-w-4xl mx-auto pt-14 md:pt-16">
      <div class="relative bg-black">
        <div class="relative aspect-[4/3] md:aspect-[16/10] overflow-hidden">
          <img
            :src="product.images[currentImageIndex]"
            :alt="product.title"
            class="w-full h-full object-contain bg-gray-100"
          />
          <button
            v-if="product.images.length > 1"
            @click="prevImage"
            class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
          >
            <ChevronLeft class="w-6 h-6" />
          </button>
          <button
            v-if="product.images.length > 1"
            @click="nextImage"
            class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
          >
            <ChevronRight class="w-6 h-6" />
          </button>
        </div>
        <div v-if="product.images.length > 1" class="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          <button
            v-for="(_, index) in product.images"
            :key="index"
            @click="currentImageIndex = index"
            class="w-2 h-2 rounded-full transition-all"
            :class="currentImageIndex === index ? 'bg-white w-5' : 'bg-white/50'"
          />
        </div>
      </div>

      <div class="bg-white p-4 md:p-6">
        <div class="flex items-baseline gap-1 mb-3">
          <span class="text-primary-500 text-lg">¥</span>
          <span class="text-primary-500 text-3xl font-bold">{{ product.price }}</span>
        </div>
        <h1 class="text-lg md:text-xl font-semibold text-gray-800 leading-snug mb-3">
          {{ product.title }}
        </h1>
        <div class="flex items-center gap-4 text-sm text-gray-500">
          <span class="flex items-center gap-1">
            <Eye class="w-4 h-4" />
            浏览 {{ product.views }}
          </span>
          <span class="flex items-center gap-1">
            <Clock class="w-4 h-4" />
            {{ product.createdAt }}
          </span>
        </div>
      </div>

      <div class="bg-white mt-3 p-4 md:p-6">
        <h2 class="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <FileText class="w-4 h-4 text-primary-500" />
          商品描述
        </h2>
        <p class="text-gray-600 leading-relaxed whitespace-pre-wrap">
          {{ product.description }}
        </p>
      </div>

      <div class="bg-white mt-3 p-4 md:p-6">
        <h2 class="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <UserCircle class="w-4 h-4 text-primary-500" />
          卖家信息
        </h2>
        <div class="flex items-center gap-3">
          <img
            :src="product.seller.avatar"
            :alt="product.seller.name"
            class="w-12 h-12 rounded-full object-cover"
          />
          <div class="flex-1">
            <p class="font-medium text-gray-800">{{ product.seller.name }}</p>
            <p class="text-sm text-gray-500 mt-0.5">校园实名认证卖家</p>
          </div>
        </div>
      </div>
    </main>

    <div v-if="product" class="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 md:static md:border-0 md:mt-3 md:bg-white md:p-4 md:rounded-card">
      <div class="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3 md:px-6">
        <button
          @click="toggleFavorite"
          class="flex flex-col items-center gap-0.5 px-3 py-1.5 transition-colors"
          :class="favorite ? 'text-primary-500' : 'text-gray-500 hover:text-primary-500'"
        >
          <Heart :class="['w-6 h-6', favorite && 'fill-primary-500']" />
          <span class="text-xs">{{ favorite ? '已收藏' : '收藏' }}</span>
        </button>
        <a
          :href="`tel:${product.seller.phone}`"
          class="flex-1 h-11 md:h-12 rounded-full border-2 border-primary-500 text-primary-500 font-medium flex items-center justify-center gap-2 hover:bg-primary-50 transition-colors"
        >
          <Phone class="w-5 h-5" />
          <span>电话联系</span>
        </a>
        <button
          @click="showContact = true"
          class="flex-1 h-11 md:h-12 rounded-full bg-primary-500 text-white font-medium flex items-center justify-center gap-2 hover:bg-primary-600 transition-colors"
        >
          <MessageCircle class="w-5 h-5" />
          <span>联系卖家</span>
        </button>
      </div>
    </div>

    <div
      v-if="showContact && product"
      class="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50"
      @click.self="showContact = false"
    >
      <div class="w-full md:max-w-md bg-white rounded-t-2xl md:rounded-2xl p-6 animate-slide-up">
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-lg font-semibold">联系方式</h3>
          <button @click="showContact = false" class="p-1 text-gray-400 hover:text-gray-600">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <MessageCircle class="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p class="text-sm text-gray-500">微信号</p>
                <p class="font-medium text-gray-800">{{ product.seller.wechat }}</p>
              </div>
            </div>
            <button
              @click="copyText(product.seller.wechat)"
              class="px-3 py-1.5 text-sm text-primary-500 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors"
            >
              {{ copied ? '已复制' : '复制' }}
            </button>
          </div>
          <a
            :href="`tel:${product.seller.phone}`"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Phone class="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p class="text-sm text-gray-500">手机号</p>
                <p class="font-medium text-gray-800">{{ product.seller.phone }}</p>
              </div>
            </div>
            <span class="px-3 py-1.5 text-sm text-primary-500 bg-primary-50 rounded-full">拨打</span>
          </a>
        </div>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  ChevronLeft, ChevronRight, Eye, Clock, FileText, UserCircle,
  Heart, Phone, MessageCircle, X
} from 'lucide-vue-next'
import Header from '@/components/Header.vue'
import BottomNav from '@/components/BottomNav.vue'
import { mockProducts } from '@/data/mock'
import { getMyProducts, isFavorite, addFavorite, removeFavorite } from '@/utils/storage'
import type { Product } from '@/types'

const route = useRoute()
const currentImageIndex = ref(0)
const showContact = ref(false)
const copied = ref(false)
const favorite = ref(false)

const product = computed<Product | null>(() => {
  const id = route.params.id as string
  const myProducts = getMyProducts().map(p => ({ ...p, isMyPublish: true }))
  const all = [...myProducts, ...mockProducts]
  return all.find(p => p.id === id) || null
})

onMounted(() => {
  if (product.value) {
    favorite.value = isFavorite(product.value.id)
  }
})

function prevImage() {
  if (!product.value) return
  currentImageIndex.value = currentImageIndex.value === 0
    ? product.value.images.length - 1
    : currentImageIndex.value - 1
}

function nextImage() {
  if (!product.value) return
  currentImageIndex.value = currentImageIndex.value === product.value.images.length - 1
    ? 0
    : currentImageIndex.value + 1
}

function toggleFavorite() {
  if (!product.value) return
  if (favorite.value) {
    removeFavorite(product.value.id)
  } else {
    addFavorite(product.value.id)
  }
  favorite.value = !favorite.value
}

function copyText(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  })
}
</script>

<style scoped>
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
</style>
