<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ChevronLeft, ChevronRight, Heart, Share2, Eye, MapPin, Clock, Phone, MessageCircle, ArrowLeft } from 'lucide-vue-next';
import Header from '@/components/Header.vue';
import BottomNav from '@/components/BottomNav.vue';
import { mockProducts } from '@/data/mock';
import { getMyProducts, isFavorite, toggleFavorite, formatPrice, formatDate } from '@/utils/storage';
import type { Product } from '@/types';

const route = useRoute();
const router = useRouter();
const product = ref<Product | null>(null);
const currentImageIndex = ref(0);
const favorite = ref(false);
const showContact = ref(false);

const currentImage = computed(() => {
  if (!product.value) return '';
  return product.value.images[currentImageIndex.value];
});

const prevImage = () => {
  if (!product.value) return;
  currentImageIndex.value = (currentImageIndex.value - 1 + product.value.images.length) % product.value.images.length;
};

const nextImage = () => {
  if (!product.value) return;
  currentImageIndex.value = (currentImageIndex.value + 1) % product.value.images.length;
};

const goToImage = (index: number) => {
  currentImageIndex.value = index;
};

const handleFavorite = () => {
  if (!product.value) return;
  favorite.value = toggleFavorite(product.value.id);
};

const handleContact = () => {
  showContact.value = !showContact.value;
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  const productId = route.params.id as string;
  const myProducts = getMyProducts();
  const allProducts = [...myProducts, ...mockProducts];
  product.value = allProducts.find(p => p.id === productId) || null;
  
  if (product.value) {
    favorite.value = isFavorite(product.value.id);
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-14 px-4 bg-white/80 backdrop-blur-sm md:hidden">
      <button @click="goBack" class="p-2 -ml-2 rounded-full hover:bg-gray-100">
        <ArrowLeft class="w-5 h-5 text-gray-700" />
      </button>
      <span class="font-medium text-gray-800">商品详情</span>
      <button class="p-2 -mr-2 rounded-full hover:bg-gray-100">
        <Share2 class="w-5 h-5 text-gray-700" />
      </button>
    </div>

    <div class="hidden md:block">
      <Header />
    </div>

    <main v-if="product" class="pt-14 md:pt-20 pb-24 md:pb-8">
      <div class="max-w-4xl mx-auto">
        <div class="relative bg-black aspect-square md:aspect-video md:rounded-card overflow-hidden">
          <img
            :src="currentImage"
            :alt="product.title"
            class="w-full h-full object-contain"
          />
          
          <button
            v-if="product.images.length > 1"
            @click="prevImage"
            class="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/30 hover:bg-black/50 rounded-full text-white transition-colors"
          >
            <ChevronLeft class="w-6 h-6" />
          </button>
          
          <button
            v-if="product.images.length > 1"
            @click="nextImage"
            class="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/30 hover:bg-black/50 rounded-full text-white transition-colors"
          >
            <ChevronRight class="w-6 h-6" />
          </button>

          <div v-if="product.images.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            <button
              v-for="(_, index) in product.images"
              :key="index"
              @click="goToImage(index)"
              class="w-2 h-2 rounded-full transition-all"
              :class="index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'"
            />
          </div>
        </div>

        <div class="bg-white p-4 md:p-6 md:mt-4 md:rounded-card md:shadow-card">
          <div class="flex items-baseline gap-2 mb-3">
            <span class="text-2xl md:text-3xl font-bold text-primary-500">
              {{ formatPrice(product.price) }}
            </span>
            <span v-if="product.originalPrice" class="text-sm text-gray-400 line-through">
              {{ formatPrice(product.originalPrice) }}
            </span>
            <span v-if="product.originalPrice" class="px-2 py-0.5 bg-primary-50 text-primary-500 text-xs font-medium rounded">
              省{{ formatPrice(product.originalPrice - product.price) }}
            </span>
          </div>

          <h1 class="text-lg md:text-xl font-semibold text-gray-800 mb-3">
            {{ product.title }}
          </h1>

          <div class="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
            <span class="flex items-center gap-1">
              <Eye class="w-4 h-4" />
              {{ product.views }} 次浏览
            </span>
            <span class="flex items-center gap-1">
              <Clock class="w-4 h-4" />
              {{ formatDate(product.createdAt) }}
            </span>
            <span v-if="product.location" class="flex items-center gap-1">
              <MapPin class="w-4 h-4" />
              {{ product.location }}
            </span>
            <span v-if="product.condition" class="px-2 py-0.5 bg-gray-100 rounded text-gray-600">
              {{ product.condition }}
            </span>
          </div>
        </div>

        <div class="bg-white p-4 md:p-6 md:mt-4 md:rounded-card md:shadow-card">
          <h2 class="font-semibold text-gray-800 mb-3">商品描述</h2>
          <p class="text-gray-600 leading-relaxed whitespace-pre-wrap">
            {{ product.description }}
          </p>
        </div>

        <div class="bg-white p-4 md:p-6 md:mt-4 md:rounded-card md:shadow-card">
          <h2 class="font-semibold text-gray-800 mb-4">卖家信息</h2>
          <div class="flex items-center gap-3">
            <img
              :src="product.seller.avatar"
              :alt="product.seller.name"
              class="w-12 h-12 rounded-full"
            />
            <div class="flex-1">
              <div class="font-medium text-gray-800">{{ product.seller.name }}</div>
              <div class="text-sm text-gray-500">校园认证卖家</div>
            </div>
            <button class="px-4 py-2 border border-primary-500 text-primary-500 rounded-full text-sm font-medium hover:bg-primary-50 transition-colors">
              查看主页
            </button>
          </div>

          <div v-if="showContact" class="mt-4 p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Phone class="w-4 h-4" />
              <span>电话：{{ product.seller.phone }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <MessageCircle class="w-4 h-4" />
              <span>微信：{{ product.seller.wechat }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-if="product" class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-4 md:hidden">
      <button
        @click="handleFavorite"
        class="flex flex-col items-center justify-center"
      >
        <Heart
          class="w-6 h-6 transition-colors"
          :class="favorite ? 'text-red-500 fill-red-500' : 'text-gray-400'"
        />
        <span class="text-xs text-gray-500 mt-0.5">收藏</span>
      </button>
      
      <button
        @click="handleContact"
        class="flex flex-col items-center justify-center"
      >
        <MessageCircle class="w-6 h-6 text-gray-400" />
        <span class="text-xs text-gray-500 mt-0.5">联系</span>
      </button>

      <button
        @click="handleContact"
        class="flex-1 h-12 bg-primary-500 text-white font-medium rounded-full hover:bg-primary-600 transition-colors"
      >
        立即联系
      </button>
    </div>

    <div v-if="product" class="hidden md:block fixed bottom-8 right-8 z-50">
      <div class="flex items-center gap-3">
        <button
          @click="handleFavorite"
          class="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <Heart
            class="w-5 h-5 transition-colors"
            :class="favorite ? 'text-red-500 fill-red-500' : 'text-gray-500'"
          />
        </button>
        <button
          @click="handleContact"
          class="px-8 h-12 bg-primary-500 text-white font-medium rounded-full hover:bg-primary-600 transition-colors shadow-lg"
        >
          联系卖家
        </button>
      </div>
    </div>

    <div class="md:hidden">
      <BottomNav />
    </div>
  </div>
</template>
