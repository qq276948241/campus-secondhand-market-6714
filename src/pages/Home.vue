<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Flame } from 'lucide-vue-next'
import SearchBar from '@/components/SearchBar.vue'
import CategoryTabs from '@/components/CategoryTabs.vue'
import ProductCard from '@/components/ProductCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { useProductStore } from '@/stores/product'
import type { ProductCategory } from '@/types'

const productStore = useProductStore()
const { filteredProducts, searchKeyword, selectedCategory } = storeToRefs(productStore)
const { setSearchKeyword, setCategory } = productStore

function handleSearch(keyword: string) {
  setSearchKeyword(keyword)
}

function handleCategoryChange(category: ProductCategory) {
  setCategory(category)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="sticky top-0 z-40 bg-white border-b border-gray-100">
      <div class="max-w-6xl mx-auto px-4 py-3">
        <div class="flex items-center gap-3 mb-3">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center">
              <Flame :size="22" class="text-white" />
            </div>
            <div>
              <h1 class="text-lg font-bold text-gray-800">校园二手街</h1>
              <p class="text-xs text-gray-400">同学闲置 · 靠谱交易</p>
            </div>
          </div>
        </div>
        <SearchBar
          :model-value="searchKeyword"
          placeholder="搜索心仪好物"
          @update:model-value="handleSearch"
          @search="handleSearch"
        />
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 py-4">
      <div class="mb-4">
        <CategoryTabs
          :model-value="selectedCategory"
          @update:model-value="handleCategoryChange"
        />
      </div>

      <div v-if="filteredProducts.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </div>

      <EmptyState v-else type="products" />
    </main>
  </div>
</template>
