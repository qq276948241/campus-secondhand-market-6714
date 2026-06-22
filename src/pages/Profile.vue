<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Heart, Package, Settings, HelpCircle, ChevronRight, Trash2, ShoppingBag, Eye } from 'lucide-vue-next';
import Header from '@/components/Header.vue';
import BottomNav from '@/components/BottomNav.vue';
import { currentUser, mockProducts } from '@/data/mock';
import { getMyProducts, removeMyProduct, getMyFavorites, toggleFavorite, formatPrice, formatDate } from '@/utils/storage';
import type { Product } from '@/types';

const route = useRoute();
const router = useRouter();
const activeTab = ref('publish');
const myProducts = ref<Product[]>([]);
const favoriteProducts = ref<Product[]>([]);

const loadData = () => {
  myProducts.value = getMyProducts();
  
  const favIds = getMyFavorites();
  const allProducts = [...getMyProducts(), ...mockProducts];
  favoriteProducts.value = favIds
    .map(id => allProducts.find(p => p.id === id))
    .filter((p): p is Product => p !== undefined);
};

const handleTabChange = (tab: string) => {
  activeTab.value = tab;
  router.replace({ query: { tab } });
};

const handleDeleteProduct = (productId: string) => {
  if (confirm('确定要删除这个商品吗？')) {
    removeMyProduct(productId);
    loadData();
  }
};

const handleRemoveFavorite = (productId: string) => {
  toggleFavorite(productId);
  loadData();
};

const goToDetail = (productId: string) => {
  router.push(`/product/${productId}`);
};

const goToPublish = () => {
  router.push('/publish');
};

onMounted(() => {
  if (route.query.tab === 'favorite') {
    activeTab.value = 'favorite';
  }
  loadData();
});

watch(() => route.query.tab, (newTab) => {
  if (newTab === 'favorite') {
    activeTab.value = 'favorite';
  } else {
    activeTab.value = 'publish';
  }
  loadData();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="hidden md:block">
      <Header />
    </div>

    <main class="md:pt-20 pb-24 md:pb-8">
      <div class="bg-gradient-to-b from-primary-500 to-primary-400 pt-8 pb-16 px-4 md:rounded-b-3xl md:mx-4 md:mt-4">
        <div class="max-w-4xl mx-auto">
          <div class="flex items-center gap-4">
            <img
              :src="currentUser.avatar"
              :alt="currentUser.name"
              class="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white/30 shadow-lg"
            />
            <div class="text-white">
              <h1 class="text-xl md:text-2xl font-bold">{{ currentUser.name }}</h1>
              <p class="text-white/80 text-sm mt-1">校园认证用户</p>
            </div>
            <button class="ml-auto p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
              <Settings class="w-5 h-5 text-white" />
            </button>
          </div>

          <div class="flex gap-8 mt-6 text-white">
            <div class="text-center">
              <div class="text-2xl font-bold">{{ myProducts.length }}</div>
              <div class="text-sm text-white/80">我的发布</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold">{{ favoriteProducts.length }}</div>
              <div class="text-sm text-white/80">我的收藏</div>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 -mt-8">
        <div class="bg-white rounded-card shadow-card overflow-hidden">
          <div class="flex border-b border-gray-100">
            <button
              @click="handleTabChange('publish')"
              class="flex-1 py-4 text-center font-medium transition-colors relative"
              :class="activeTab === 'publish' ? 'text-primary-500' : 'text-gray-500'"
            >
              <Package class="w-5 h-5 inline-block mr-2 -mt-0.5" />
              我的发布
              <div
                v-if="activeTab === 'publish'"
                class="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary-500 rounded-full"
              />
            </button>
            <button
              @click="handleTabChange('favorite')"
              class="flex-1 py-4 text-center font-medium transition-colors relative"
              :class="activeTab === 'favorite' ? 'text-primary-500' : 'text-gray-500'"
            >
              <Heart class="w-5 h-5 inline-block mr-2 -mt-0.5" />
              我的收藏
              <div
                v-if="activeTab === 'favorite'"
                class="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary-500 rounded-full"
              />
            </button>
          </div>

          <div v-if="activeTab === 'publish'">
            <div v-if="myProducts.length > 0" class="divide-y divide-gray-100">
              <div
                v-for="product in myProducts"
                :key="product.id"
                class="p-4 flex gap-4 hover:bg-gray-50 transition-colors cursor-pointer"
                @click="goToDetail(product.id)"
              >
                <div class="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    :src="product.images[0]"
                    :alt="product.title"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-medium text-gray-800 line-clamp-2 mb-1">
                    {{ product.title }}
                  </h3>
                  <div class="text-lg font-bold text-primary-500 mb-1">
                    {{ formatPrice(product.price) }}
                  </div>
                  <div class="flex items-center gap-3 text-xs text-gray-400">
                    <span class="flex items-center gap-1">
                      <Eye class="w-3 h-3" />
                      {{ product.views }}
                    </span>
                    <span>{{ formatDate(product.createdAt) }}</span>
                  </div>
                </div>
                <button
                  @click.stop="handleDeleteProduct(product.id)"
                  class="self-center p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 class="w-5 h-5" />
                </button>
              </div>
            </div>

            <div v-else class="py-16 text-center">
              <div class="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Package class="w-10 h-10 text-gray-300" />
              </div>
              <p class="text-gray-500 mb-2">还没有发布商品</p>
              <p class="text-sm text-gray-400 mb-4">闲置好物卖出去，赚点零花钱~</p>
              <button
                @click="goToPublish"
                class="px-6 py-2 bg-primary-500 text-white text-sm font-medium rounded-full hover:bg-primary-600 transition-colors"
              >
                去发布
              </button>
            </div>
          </div>

          <div v-else>
            <div v-if="favoriteProducts.length > 0" class="divide-y divide-gray-100">
              <div
                v-for="product in favoriteProducts"
                :key="product.id"
                class="p-4 flex gap-4 hover:bg-gray-50 transition-colors cursor-pointer"
                @click="goToDetail(product.id)"
              >
                <div class="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    :src="product.images[0]"
                    :alt="product.title"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-medium text-gray-800 line-clamp-2 mb-1">
                    {{ product.title }}
                  </h3>
                  <div class="text-lg font-bold text-primary-500 mb-1">
                    {{ formatPrice(product.price) }}
                  </div>
                  <div class="flex items-center gap-2 text-xs text-gray-400">
                    <img
                      :src="product.seller.avatar"
                      :alt="product.seller.name"
                      class="w-4 h-4 rounded-full"
                    />
                    <span class="max-w-20 truncate">{{ product.seller.name }}</span>
                  </div>
                </div>
                <button
                  @click.stop="handleRemoveFavorite(product.id)"
                  class="self-center p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Heart class="w-5 h-5 fill-current" />
                </button>
              </div>
            </div>

            <div v-else class="py-16 text-center">
              <div class="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Heart class="w-10 h-10 text-gray-300" />
              </div>
              <p class="text-gray-500 mb-2">还没有收藏商品</p>
              <p class="text-sm text-gray-400">逛逛首页，发现好东西吧~</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-card shadow-card mt-4 overflow-hidden">
          <button class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div class="flex items-center gap-3">
              <HelpCircle class="w-5 h-5 text-gray-400" />
              <span class="text-gray-700">帮助与反馈</span>
            </div>
            <ChevronRight class="w-5 h-5 text-gray-300" />
          </button>
          <div class="h-px bg-gray-100" />
          <button class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div class="flex items-center gap-3">
              <Settings class="w-5 h-5 text-gray-400" />
              <span class="text-gray-700">设置</span>
            </div>
            <ChevronRight class="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </div>
    </main>

    <BottomNav />
  </div>
</template>
