<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockProducts, categories, type Product } from '../data'

const router = useRouter()
const products = ref<Product[]>(mockProducts)
const searchText = ref('')
const activeCategory = ref('all')

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchCategory = activeCategory.value === 'all' || p.category === activeCategory.value
    const matchSearch = !searchText.value ||
      p.title.toLowerCase().includes(searchText.value.toLowerCase()) ||
      p.description.toLowerCase().includes(searchText.value.toLowerCase())
    return matchCategory && matchSearch
  })
})

const goDetail = (id: number) => {
  router.push(`/detail/${id}`)
}

const toggleCollect = (e: Event, product: Product) => {
  e.stopPropagation()
  product.collected = !product.collected
}
</script>

<template>
  <div class="home">
    <header class="home-header">
      <div class="brand">
        <span class="brand-icon">🛒</span>
        <span class="brand-text">校园二手</span>
      </div>
      <div class="search-box" @click="() => {}">
        <span class="search-icon">🔍</span>
        <input
          v-model="searchText"
          class="search-input"
          type="text"
          placeholder="搜索你想要的商品..."
        />
      </div>
    </header>

    <section class="categories">
      <div class="categories-scroll">
        <div
          v-for="cat in categories"
          :key="cat.id"
          class="cat-item"
          :class="{ active: activeCategory === cat.id }"
          @click="activeCategory = cat.id"
        >
          <span class="cat-icon">{{ cat.icon }}</span>
          <span class="cat-name">{{ cat.name }}</span>
        </div>
      </div>
    </section>

    <section class="list-section container">
      <div class="section-header">
        <h2 class="section-title">
          <span class="title-dot"></span>
          {{ activeCategory === 'all' ? '全部商品' : categories.find(c => c.id === activeCategory)?.name }}
        </h2>
        <span class="section-count">共 {{ filteredProducts.length }} 件</span>
      </div>

      <div v-if="filteredProducts.length > 0" class="product-grid">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="product-card"
          @click="goDetail(product.id)"
        >
          <div class="card-image-wrap">
            <img :src="product.images[0]" :alt="product.title" class="card-image" />
            <button class="collect-btn" @click="(e) => toggleCollect(e, product)">
              <span class="collect-icon">{{ product.collected ? '❤️' : '🤍' }}</span>
            </button>
            <span v-if="product.originalPrice" class="discount-tag">
              {{ Math.round((1 - product.price / product.originalPrice) * 100) }}%OFF
            </span>
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ product.title }}</h3>
            <div class="card-price-row">
              <span class="price card-price">{{ product.price }}</span>
              <span v-if="product.originalPrice" class="price-original">{{ product.originalPrice }}</span>
            </div>
            <div class="card-footer">
              <div class="seller">
                <span class="seller-avatar">{{ product.seller.avatar }}</span>
                <span class="seller-name">{{ product.seller.name }}</span>
              </div>
              <span class="views">👀 {{ product.views }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty">
        <span class="empty-icon">📭</span>
        <p class="empty-text">没有找到相关商品</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
}

.home-header {
  background: linear-gradient(135deg, #ff7a2d 0%, #ff9a5c 100%);
  padding: 20px 16px 28px;
  color: #fff;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.brand-icon {
  font-size: 28px;
}

.brand-text {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 1px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 12px 18px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.search-icon {
  font-size: 16px;
  opacity: 0.6;
}

.search-input {
  flex: 1;
  font-size: 14px;
  color: #2d2a26;
}

.search-input::placeholder {
  color: #b5ada5;
}

.categories {
  margin-top: -16px;
  padding: 0 12px;
  position: relative;
  z-index: 10;
}

.categories-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 12px 4px;
  background: #fff;
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  white-space: nowrap;
}

.cat-item {
  flex-shrink: 0;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 14px;
  border-radius: 12px;
  transition: all 0.2s;
  cursor: pointer;
}

.cat-item:active {
  transform: scale(0.95);
}

.cat-icon {
  font-size: 24px;
}

.cat-name {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

.cat-item.active {
  background: var(--primary-bg);
}

.cat-item.active .cat-name {
  color: var(--primary);
  font-weight: 600;
}

.list-section {
  padding-top: 8px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
}

.title-dot {
  width: 4px;
  height: 18px;
  background: var(--primary);
  border-radius: 2px;
}

.section-count {
  font-size: 13px;
  color: var(--text-secondary);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

@media (min-width: 640px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
}

@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.product-card {
  background: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.2s;
}

.product-card:active {
  transform: scale(0.98);
}

.card-image-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: var(--bg);
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.collect-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  transition: transform 0.2s;
}

.collect-btn:active {
  transform: scale(0.9);
}

.collect-icon {
  font-size: 16px;
}

.discount-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 3px 8px;
  background: var(--primary);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  border-radius: 6px;
}

.card-content {
  padding: 12px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 40px;
}

.card-price-row {
  margin-top: 8px;
  display: flex;
  align-items: baseline;
}

.card-price {
  font-size: 18px;
}

.card-footer {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.seller {
  display: flex;
  align-items: center;
  gap: 4px;
  overflow: hidden;
}

.seller-avatar {
  font-size: 14px;
}

.seller-name {
  font-size: 12px;
  color: var(--text-secondary);
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.views {
  font-size: 12px;
  color: var(--text-light);
}
</style>
