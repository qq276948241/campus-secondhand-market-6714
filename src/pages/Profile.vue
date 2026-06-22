<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { Package, Heart, Settings, LogOut } from 'lucide-vue-next'
import ProductCard from '@/components/ProductCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { useProductStore } from '@/stores/product'
import { useFavoriteStore } from '@/stores/favorite'
import { useUserStore } from '@/stores/user'

type TabType = 'publish' | 'favorite'

const router = useRouter()
const productStore = useProductStore()
const favoriteStore = useFavoriteStore()
const userStore = useUserStore()
const { currentUser } = storeToRefs(userStore)
const { favoriteProducts } = storeToRefs(favoriteStore)

const activeTab = ref<TabType>('publish')

const myProducts = computed(() => {
  return productStore.getProductsBySeller(currentUser.value.id)
})

const displayProducts = computed(() => {
  return activeTab.value === 'publish' ? myProducts.value : favoriteProducts.value
})

function setTab(tab: TabType) {
  activeTab.value = tab
}

function handleDeleteProduct(id: string) {
  if (confirm('确定要删除这个商品吗？')) {
    productStore.deleteProduct(id)
  }
}

function handleRemoveFavorite(id: string) {
  favoriteStore.removeFavorite(id, currentUser.value.id)
}

function handleCardDelete(id: string) {
  if (activeTab.value === 'publish') {
    handleDeleteProduct(id)
  } else {
    handleRemoveFavorite(id)
  }
}

function goToPublish() {
  router.push('/publish')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-gradient-to-br from-primary to-primary-600 text-white">
      <div class="max-w-4xl mx-auto px-4 pt-8 pb-16">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-xl font-bold">个人中心</h1>
          <button class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Settings :size="20" />
          </button>
        </div>

        <div class="flex items-center gap-4">
          <img
            :src="currentUser.avatar"
            :alt="currentUser.name"
            class="w-20 h-20 rounded-full bg-white/20 border-2 border-white/30"
          />
          <div class="flex-1">
            <h2 class="text-lg font-bold mb-1">{{ currentUser.name }}</h2>
            <p class="text-white/80 text-sm">联系方式：{{ currentUser.contact }}</p>
          </div>
          <button
            class="px-4 py-2 rounded-full bg-white/20 text-sm font-medium transition-all active:scale-95"
            @click="goToPublish"
          >
            发布商品
          </button>
        </div>

        <div class="flex gap-8 mt-8">
          <div class="text-center">
            <div class="text-2xl font-bold">{{ myProducts.length }}</div>
            <div class="text-white/80 text-sm mt-1">发布的商品</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold">{{ favoriteProducts.length }}</div>
            <div class="text-white/80 text-sm mt-1">收藏的商品</div>
          </div>
        </div>
      </div>
    </div>

    <main class="max-w-4xl mx-auto px-4 -mt-6">
      <div class="bg-white rounded-card shadow-card overflow-hidden">
        <div class="flex border-b border-gray-100">
          <button
            class="flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-colors"
            :class="activeTab === 'publish' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'"
            @click="setTab('publish')"
          >
            <Package :size="18" />
            我的发布
          </button>
          <button
            class="flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-colors"
            :class="activeTab === 'favorite' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'"
            @click="setTab('favorite')"
          >
            <Heart :size="18" />
            我的收藏
          </button>
        </div>

        <div class="p-4">
          <div
            v-if="displayProducts.length > 0"
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
          >
            <ProductCard
              v-for="product in displayProducts"
              :key="product.id"
              :product="product"
              :show-delete="true"
              @delete="handleCardDelete"
            />
          </div>

          <EmptyState v-else :type="activeTab === 'publish' ? 'publish' : 'favorites'" />

          <div v-if="displayProducts.length === 0 && activeTab === 'publish'" class="text-center pb-6">
            <button
              class="btn-primary mt-4"
              @click="goToPublish"
            >
              去发布商品
            </button>
          </div>
        </div>
      </div>

      <div class="mt-6 mb-8">
        <button
          class="w-full bg-white rounded-card p-4 text-gray-500 flex items-center justify-center gap-2 shadow-card transition-colors hover:text-gray-700"
        >
          <LogOut :size="18" />
          退出登录
        </button>
      </div>
    </main>
  </div>
</template>
