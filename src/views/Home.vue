<template>
  <div class="home-page">
    <SearchBar v-model="searchValue" @search="handleSearch" />
    
    <CategoryBar :selected="store.state.selectedCategory" @change="handleCategoryChange" />
    
    <div class="content">
      <div class="section-header">
        <h2 class="section-title">
          <span class="title-icon">🔥</span>
          {{ currentCategoryName }}
        </h2>
        <span class="count-badge">共 {{ store.filteredProducts.length }} 件</span>
      </div>

      <div v-if="store.filteredProducts.length > 0" class="product-grid">
        <ProductCard 
          v-for="product in store.filteredProducts" 
          :key="product.id" 
          :product="product"
        />
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">🔍</div>
        <div class="empty-text">没有找到相关商品</div>
        <div class="empty-desc">换个关键词或分类试试吧</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SearchBar from '../components/SearchBar.vue'
import CategoryBar from '../components/CategoryBar.vue'
import ProductCard from '../components/ProductCard.vue'
import { useStore, categories } from '../store'

const store = useStore()
const searchValue = ref(store.state.searchKeyword)

const currentCategoryName = computed(() => {
  const cat = categories.find(c => c.id === store.state.selectedCategory)
  return cat ? cat.name + '好物' : '全部好物'
})

const handleSearch = (val) => {
  store.setSearchKeyword(val)
}

const handleCategoryChange = (id) => {
  store.setCategory(id)
}
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  background: #fff8f2;
}

.content {
  padding: 4px 12px 20px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 4px 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 6px;

  .title-icon {
    font-size: 18px;
  }
}

.count-badge {
  font-size: 12px;
  color: #999;
  background: #fff;
  padding: 4px 12px;
  border-radius: 12px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
</style>
