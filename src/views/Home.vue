<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  mockProducts,
  categories,
  sortOptions,
  parseCreatedAt,
  type Product,
  type SortType
} from '../data'

const router = useRouter()
const products = ref<Product[]>(mockProducts)
const searchText = ref('')
const activeCategory = ref('all')
const minPrice = ref<string>('')
const maxPrice = ref<string>('')
const sortType = ref<SortType>('default')

const priceRangeInvalid = computed(() => {
  const lo = Number(minPrice.value)
  const hi = Number(maxPrice.value)
  if (!minPrice.value || !maxPrice.value) return false
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return false
  return lo > hi
})

const filteredProducts = computed(() => {
  const lo = minPrice.value === '' ? NaN : Number(minPrice.value)
  const hi = maxPrice.value === '' ? NaN : Number(maxPrice.value)

  let list = products.value.filter(p => {
    const matchCategory = activeCategory.value === 'all' || p.category === activeCategory.value
    const matchSearch = !searchText.value ||
      p.title.toLowerCase().includes(searchText.value.toLowerCase()) ||
      p.description.toLowerCase().includes(searchText.value.toLowerCase())

    let matchPrice = true
    if (Number.isFinite(lo) && p.price < lo) matchPrice = false
    if (Number.isFinite(hi) && p.price > hi) matchPrice = false
    if (Number.isFinite(lo) && Number.isFinite(hi) && lo > hi) matchPrice = false

    return matchCategory && matchSearch && matchPrice
  })

  const sorted = [...list]
  switch (sortType.value) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price || a.id - b.id)
      break
    case 'date-desc':
      sorted.sort((a, b) => parseCreatedAt(b.createdAt) - parseCreatedAt(a.createdAt) || b.id - a.id)
      break
    default:
      sorted.sort((a, b) => {
        const scoreA = a.views * 10 + (a.collected ? 50 : 0) + a.id
        const scoreB = b.views * 10 + (b.collected ? 50 : 0) + b.id
        return scoreB - scoreA
      })
  }

  return sorted
})

const activeFilterCount = computed(() => {
  let n = 0
  if (activeCategory.value !== 'all') n++
  if (minPrice.value !== '' || maxPrice.value !== '') n++
  if (sortType.value !== 'default') n++
  if (searchText.value) n++
  return n
})

const resetFilters = () => {
  activeCategory.value = 'all'
  minPrice.value = ''
  maxPrice.value = ''
  sortType.value = 'default'
}

const quickPrices: Array<{ label: string; min: number; max: number } | { label: string; min: number; max: null } | { label: string; min: null; max: number }> = [
  { label: '50以内', min: null as any, max: 50 },
  { label: '50-200', min: 50, max: 200 },
  { label: '200-1000', min: 200, max: 1000 },
  { label: '1000以上', min: 1000, max: null as any }
]

const applyQuickPrice = (qp: { min: number | null; max: number | null }) => {
  minPrice.value = qp.min === null ? '' : String(qp.min)
  maxPrice.value = qp.max === null ? '' : String(qp.max)
}

watch([minPrice, maxPrice], () => {
  if (minPrice.value !== '' && Number(minPrice.value) < 0) minPrice.value = '0'
  if (maxPrice.value !== '' && Number(maxPrice.value) < 0) maxPrice.value = '0'
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

    <section class="filter-bar container">
      <div class="filter-card">
        <div class="price-range">
          <div class="price-label">
            <span class="price-label-icon">💰</span>
            <span class="price-label-text">价格区间</span>
          </div>
          <div class="price-inputs">
            <div class="price-input-wrap">
              <span class="price-prefix">¥</span>
              <input
                v-model="minPrice"
                type="number"
                min="0"
                step="1"
                class="price-input"
                placeholder="最低价"
              />
            </div>
            <span class="price-divider">—</span>
            <div class="price-input-wrap">
              <span class="price-prefix">¥</span>
              <input
                v-model="maxPrice"
                type="number"
                min="0"
                step="1"
                class="price-input"
                placeholder="最高价"
              />
            </div>
          </div>
          <div v-if="priceRangeInvalid" class="price-error">
            ⚠️ 最低价不能大于最高价
          </div>
          <div class="quick-price-row">
            <button
              v-for="qp in quickPrices"
              :key="qp.label"
              class="quick-chip"
              :class="{
                active:
                  (qp.min === null ? minPrice === '' : String(qp.min) === minPrice) &&
                  (qp.max === null ? maxPrice === '' : String(qp.max) === maxPrice)
              }"
              @click="applyQuickPrice(qp as any)"
            >
              {{ qp.label }}
            </button>
          </div>
        </div>

        <div class="divider-row"></div>

        <div class="sort-row">
          <div class="sort-label">
            <span class="sort-label-icon">📊</span>
            <span>排序方式</span>
          </div>
          <div class="sort-chips">
            <button
              v-for="opt in sortOptions"
              :key="opt.id"
              class="sort-chip"
              :class="{ active: sortType === opt.id }"
              @click="sortType = opt.id"
            >
              <span class="sort-chip-icon">{{ opt.icon }}</span>
              <span>{{ opt.name }}</span>
            </button>
          </div>
        </div>

        <div v-if="activeFilterCount > 0" class="filter-footer">
          <span class="active-filter-tip">已启用 {{ activeFilterCount }} 个筛选条件</span>
          <button class="reset-btn" @click="resetFilters">
            🔄 重置
          </button>
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

.filter-bar {
  padding-top: 14px;
}

.filter-card {
  background: #fff;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 16px;
}

.price-label,
.sort-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 10px;
}

.price-label-icon,
.sort-label-icon {
  font-size: 16px;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}

.price-input-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--bg);
  border-radius: var(--radius-md);
  padding: 0 12px;
  transition: all 0.2s;
  border: 1.5px solid transparent;
}

.price-input-wrap:focus-within {
  background: #fff;
  border-color: var(--primary-light);
  box-shadow: 0 0 0 3px rgba(255, 122, 45, 0.12);
}

.price-prefix {
  color: var(--primary);
  font-weight: 700;
  font-size: 15px;
}

.price-input {
  flex: 1;
  padding: 12px 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  min-width: 0;
  -moz-appearance: textfield;
}

.price-input::-webkit-outer-spin-button,
.price-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.price-input::placeholder {
  color: var(--text-light);
  font-weight: 400;
}

.price-divider {
  color: var(--text-light);
  font-weight: 600;
  flex-shrink: 0;
}

.price-error {
  margin-top: 8px;
  padding: 6px 10px;
  background: #fff2f0;
  border: 1px solid #ffd4cd;
  border-radius: var(--radius-sm);
  color: #d32f2f;
  font-size: 12px;
  font-weight: 500;
}

.quick-price-row {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-chip {
  padding: 6px 14px;
  background: var(--bg);
  color: var(--text-secondary);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;
  border: 1.5px solid transparent;
}

.quick-chip:active {
  transform: scale(0.96);
}

.quick-chip.active {
  background: var(--primary-bg);
  color: var(--primary);
  border-color: var(--primary-light);
  font-weight: 600;
}

.divider-row {
  height: 1px;
  background: var(--border-light);
  margin: 16px 0;
}

.sort-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.sort-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  background: var(--bg);
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
  border: 1.5px solid transparent;
}

.sort-chip:active {
  transform: scale(0.97);
}

.sort-chip-icon {
  font-size: 14px;
}

.sort-chip.active {
  background: linear-gradient(135deg, var(--primary-bg) 0%, #ffe4d0 100%);
  color: var(--primary-dark);
  border-color: var(--primary-light);
  font-weight: 700;
  box-shadow: var(--shadow-sm);
}

.filter-footer {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px dashed var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.active-filter-tip {
  font-size: 12px;
  color: var(--primary-dark);
  font-weight: 500;
  background: var(--primary-bg);
  padding: 4px 10px;
  border-radius: 20px;
}

.reset-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: #fff;
  color: var(--text-secondary);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;
}

.reset-btn:active {
  background: var(--bg);
  color: var(--primary);
  border-color: var(--primary-light);
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
