<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Search, SlidersHorizontal } from 'lucide-vue-next';
import Header from '@/components/Header.vue';
import BottomNav from '@/components/BottomNav.vue';
import CategoryTabs from '@/components/CategoryTabs.vue';
import ProductCard from '@/components/ProductCard.vue';
import { categories, mockProducts } from '@/data/mock';
import { getMyProducts } from '@/utils/storage';
import type { Product } from '@/types';

const route = useRoute();
const activeCategory = ref('all');
const searchQuery = ref('');
const allProducts = ref<Product[]>([]);

const filteredProducts = computed(() => {
  let result = [...allProducts.value];
  
  if (activeCategory.value !== 'all') {
    result = result.filter(p => p.categoryId === activeCategory.value);
  }
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    result = result.filter(p => 
      p.title.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query)
    );
  }
  
  return result;
});

const handleCategoryChange = (catId: string) => {
  activeCategory.value = catId;
};

onMounted(() => {
  const myProducts = getMyProducts();
  allProducts.value = [...myProducts, ...mockProducts];
  
  if (route.query.search) {
    searchQuery.value = route.query.search as string;
  }
});

watch(() => route.query.search, (newVal) => {
  if (newVal) {
    searchQuery.value = newVal as string;
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    
    <main class="pt-20 pb-24 md:pb-8">
      <div class="container mx-auto px-4">
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h1 class="text-xl font-bold text-gray-800">
              发现好物
            </h1>
            <button class="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-500 transition-colors">
              <SlidersHorizontal class="w-4 h-4" />
              筛选
            </button>
          </div>
          
          <CategoryTabs 
            :categories="categories" 
            :active-category="activeCategory"
            @change="handleCategoryChange"
          />
        </div>

        <div v-if="filteredProducts.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <ProductCard 
            v-for="product in filteredProducts" 
            :key="product.id" 
            :product="product" 
          />
        </div>

        <div v-else class="py-20 text-center">
          <div class="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Search class="w-8 h-8 text-gray-300" />
          </div>
          <p class="text-gray-400">没有找到相关商品</p>
          <p class="text-sm text-gray-300 mt-1">换个关键词试试吧</p>
        </div>
      </div>
    </main>

    <BottomNav />
  </div>
</template>
