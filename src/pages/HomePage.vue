<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProducts } from '@/composables/useProducts'
import ProductCard from '@/components/ProductCard.vue'
import { Search, X, SlidersHorizontal } from 'lucide-vue-next'

const { categories, searchProducts } = useProducts()

const searchKeyword = ref('')
const selectedCategory = ref(0)
const showSearch = ref(false)

const filteredProducts = computed(() => {
  return searchProducts(searchKeyword.value, selectedCategory.value)
})

function selectCategory(id: number) {
  selectedCategory.value = id
}

function clearSearch() {
  searchKeyword.value = ''
}

function toggleSearch() {
  showSearch.value = !showSearch.value
  if (!showSearch.value) searchKeyword.value = ''
}
</script>

<template>
  <div class="min-h-screen lg:pt-16">
    <div class="sticky top-0 z-40 bg-white/80 backdrop-blur-lg lg:bg-white lg:backdrop-blur-none lg:border-b lg:border-gray-100">
      <div class="container py-3 lg:py-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2 lg:hidden">
            <div class="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
              <span class="text-white text-xs font-bold">二</span>
            </div>
            <span class="font-bold text-gray-800">校园二手集市</span>
          </div>
          <h1 class="hidden lg:block text-xl font-bold text-gray-800">发现好物</h1>
          <button
            class="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
            @click="toggleSearch"
          >
            <Search v-if="!showSearch" :size="20" />
            <X v-else :size="20" />
          </button>
        </div>

        <div v-if="showSearch" class="relative mb-3">
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索你想要的宝贝..."
            class="input-field pl-10 pr-8"
            autofocus
          />
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" :size="16" />
          <button
            v-if="searchKeyword"
            class="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:bg-gray-100"
            @click="clearSearch"
          >
            <X :size="14" />
          </button>
        </div>

        <div class="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
            :class="selectedCategory === cat.id
              ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/25'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            @click="selectCategory(cat.id)"
          >
            {{ cat.name }}
          </button>
        </div>
      </div>
    </div>

    <div class="container py-4">
      <div v-if="filteredProducts.length === 0" class="flex flex-col items-center justify-center py-20">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <SlidersHorizontal :size="24" class="text-gray-400" />
        </div>
        <p class="text-gray-400 text-sm">暂无相关商品</p>
      </div>
      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4"
      >
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
