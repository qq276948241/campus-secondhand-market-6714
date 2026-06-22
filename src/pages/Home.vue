<template>
  <div class="min-h-screen bg-gray-50">
    <Header v-model:modelValue="searchKeyword" show-search />
    <main class="max-w-6xl mx-auto px-4 pt-20 pb-24 md:pb-8">
      <div class="py-4">
        <CategoryTabs v-model="selectedCategory" />
      </div>

      <div v-if="filteredProducts.length === 0" class="py-20 text-center">
        <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <PackageSearch class="w-10 h-10 text-gray-400" />
        </div>
        <p class="text-gray-500">暂无相关商品</p>
        <p class="text-sm text-gray-400 mt-1">换个关键词试试吧</p>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </main>
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PackageSearch } from 'lucide-vue-next'
import Header from '@/components/Header.vue'
import BottomNav from '@/components/BottomNav.vue'
import CategoryTabs from '@/components/CategoryTabs.vue'
import ProductCard from '@/components/ProductCard.vue'
import { mockProducts } from '@/data/mock'
import { getMyProducts } from '@/utils/storage'
import type { Product } from '@/types'

const searchKeyword = ref('')
const selectedCategory = ref('all')

const allProducts = computed<Product[]>(() => {
  const myProducts = getMyProducts().map(p => ({ ...p, isMyPublish: true }))
  return [...myProducts, ...mockProducts]
})

const filteredProducts = computed(() => {
  let result = allProducts.value

  if (selectedCategory.value !== 'all') {
    result = result.filter(p => p.category === selectedCategory.value)
  }

  const keyword = searchKeyword.value.trim().toLowerCase()
  if (keyword) {
    result = result.filter(p =>
      p.title.toLowerCase().includes(keyword) ||
      p.description.toLowerCase().includes(keyword)
    )
  }

  return result
})
</script>
