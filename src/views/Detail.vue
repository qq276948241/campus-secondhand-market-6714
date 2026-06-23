<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mockProducts, categories, type Product } from '../data'

const route = useRoute()
const router = useRouter()

const currentIndex = ref(0)
const showContact = ref(false)
const touchStartX = ref(0)

const product = computed<Product | undefined>(() => {
  const id = Number(route.params.id)
  return mockProducts.find(p => p.id === id)
})

const categoryName = computed(() => {
  if (!product.value) return ''
  const cat = categories.find(c => c.id === product.value!.category)
  return cat ? cat.name : ''
})

const goBack = () => {
  router.back()
}

const toggleCollect = () => {
  if (product.value) {
    product.value.collected = !product.value.collected
  }
}

const prevImage = () => {
  if (!product.value) return
  currentIndex.value = currentIndex.value === 0
    ? product.value.images.length - 1
    : currentIndex.value - 1
}

const nextImage = () => {
  if (!product.value) return
  currentIndex.value = (currentIndex.value + 1) % product.value.images.length
}

const onTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX
}

const onTouchEnd = (e: TouchEvent) => {
  if (!product.value) return
  const deltaX = e.changedTouches[0].clientX - touchStartX.value
  if (deltaX > 50) prevImage()
  else if (deltaX < -50) nextImage()
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (diff === 0) return '今天'
  if (diff === 1) return '昨天'
  if (diff < 7) return `${diff}天前`
  return dateStr
}

const handleShare = () => {
  window.alert('分享功能开发中')
}

const handleConsult = () => {
  window.alert('请直接联系卖家')
}

const copyText = (text: string) => {
  const cleanText = text.replace(/\*/g, '')
  if (window.navigator.clipboard) {
    window.navigator.clipboard.writeText(cleanText)
    window.alert('已复制到剪贴板')
  }
}

onMounted(() => {
  currentIndex.value = 0
})
</script>

<template>
  <div v-if="product" class="detail">
    <header class="detail-header">
      <button class="back-btn" @click="goBack">
        <span>←</span>
      </button>
      <span class="header-title">商品详情</span>
      <button class="share-btn" @click="handleShare">
        <span>📤</span>
      </button>
    </header>

    <section
      class="image-slider"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
    >
      <div
        class="slider-track"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div v-for="(img, idx) in product.images" :key="idx" class="slide-item">
          <img :src="img" :alt="`${product.title}-${idx + 1}`" class="slide-image" />
        </div>
      </div>
      <div class="slider-dots">
        <span
          v-for="(_, idx) in product.images"
          :key="idx"
          class="dot"
          :class="{ active: idx === currentIndex }"
        ></span>
      </div>
      <div class="slider-counter">
        {{ currentIndex + 1 }} / {{ product.images.length }}
      </div>
      <button v-if="product.images.length > 1" class="slider-arrow prev" @click="prevImage">‹</button>
      <button v-if="product.images.length > 1" class="slider-arrow next" @click="nextImage">›</button>
    </section>

    <section class="price-card card">
      <div class="price-row">
        <span class="price detail-price">{{ product.price }}</span>
        <span v-if="product.originalPrice" class="price-original detail-original">
          原价 ¥{{ product.originalPrice }}
        </span>
        <span v-if="product.originalPrice" class="discount-badge">
          省 ¥{{ product.originalPrice - product.price }}
        </span>
      </div>
      <h1 class="detail-title">{{ product.title }}</h1>
      <div class="meta-row">
        <span class="tag">{{ categoryName }}</span>
        <span class="meta-item">📅 {{ formatDate(product.createdAt) }}</span>
        <span class="meta-item">👀 {{ product.views }}次浏览</span>
      </div>
    </section>

    <section class="desc-card card">
      <h3 class="card-heading">商品描述</h3>
      <p class="desc-text">{{ product.description }}</p>
    </section>

    <section class="seller-card card">
      <h3 class="card-heading">卖家信息</h3>
      <div class="seller-info">
        <div class="seller-avatar-wrap">
          <span class="avatar-emoji">{{ product.seller.avatar }}</span>
        </div>
        <div class="seller-detail">
          <div class="seller-name">{{ product.seller.name }}</div>
          <div class="seller-college">🎓 {{ product.seller.college }}</div>
        </div>
      </div>

      <div v-if="showContact" class="contact-list">
        <div class="contact-item">
          <span class="contact-icon">📱</span>
          <span class="contact-label">手机号</span>
          <span class="contact-value">{{ product.seller.phone }}</span>
          <button class="copy-btn" @click="copyText(product.seller.phone)">复制</button>
        </div>
        <div v-if="product.seller.wechat" class="contact-item">
          <span class="contact-icon">💬</span>
          <span class="contact-label">微信号</span>
          <span class="contact-value">{{ product.seller.wechat }}</span>
          <button class="copy-btn" @click="copyText(product.seller.wechat!)">复制</button>
        </div>
      </div>
      <button v-else class="show-contact-btn" @click="showContact = true">
        查看联系方式
      </button>
    </section>

    <div class="bottom-bar safe-bottom">
      <button class="bar-btn bar-collect" @click="toggleCollect">
        <span class="bar-icon">{{ product.collected ? '❤️' : '🤍' }}</span>
        <span class="bar-label">{{ product.collected ? '已收藏' : '收藏' }}</span>
      </button>
      <button class="bar-btn bar-cart" @click="handleConsult">
        <span class="bar-icon">💬</span>
        <span class="bar-label">咨询卖家</span>
      </button>
      <button class="bar-btn bar-buy" @click="showContact = true">
        <span class="bar-icon">📞</span>
        <span class="bar-label">联系购买</span>
      </button>
    </div>
  </div>

  <div v-else class="detail empty-page">
    <span class="empty-icon">😕</span>
    <p class="empty-text">商品不存在或已下架</p>
    <button class="btn btn-primary" style="margin-top: 20px" @click="goBack">返回首页</button>
  </div>
</template>

<style scoped>
.detail {
  min-height: 100vh;
  padding-bottom: 88px;
}

.detail-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--border);
}

.header-title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
}

.share-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background: var(--primary-bg);
  color: var(--primary);
}

.image-slider {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: #1a1a1a;
  overflow: hidden;
}

.slider-track {
  display: flex;
  height: 100%;
  transition: transform 0.35s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.slide-item {
  flex-shrink: 0;
  width: 100%;
  height: 100%;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slider-dots {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transition: all 0.2s;
}

.dot.active {
  width: 20px;
  border-radius: 3px;
  background: var(--primary);
}

.slider-counter {
  position: absolute;
  bottom: 14px;
  right: 14px;
  padding: 4px 10px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 12px;
  border-radius: 20px;
}

.slider-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  font-size: 24px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider-arrow.prev { left: 10px; }
.slider-arrow.next { right: 10px; }

.card {
  margin: 12px;
  padding: 16px;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
}

.detail-price {
  font-size: 30px;
  font-weight: 800;
}

.detail-original {
  font-size: 14px;
}

.discount-badge {
  padding: 3px 10px;
  background: linear-gradient(135deg, #ff4d4f, #ff7a2d);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  border-radius: 20px;
}

.detail-title {
  margin-top: 10px;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.45;
  color: var(--text);
}

.meta-row {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 13px;
  color: var(--text-secondary);
}

.card-heading {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-heading::before {
  content: '';
  width: 3px;
  height: 16px;
  background: var(--primary);
  border-radius: 2px;
}

.desc-text {
  font-size: 14px;
  line-height: 1.8;
  color: #555;
  white-space: pre-wrap;
}

.seller-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.seller-avatar-wrap {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-bg), #ffe4d0);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-emoji {
  font-size: 28px;
}

.seller-detail {
  flex: 1;
  min-width: 0;
}

.seller-name {
  font-size: 16px;
  font-weight: 600;
}

.seller-college {
  margin-top: 4px;
  font-size: 13px;
  color: var(--text-secondary);
}

.show-contact-btn {
  margin-top: 16px;
  width: 100%;
  padding: 14px;
  background: var(--primary-bg);
  color: var(--primary);
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s;
}

.show-contact-btn:active {
  background: #ffe4d0;
}

.contact-list {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: var(--bg);
  border-radius: var(--radius-md);
}

.contact-icon {
  font-size: 18px;
}

.contact-label {
  font-size: 13px;
  color: var(--text-secondary);
  width: 56px;
}

.contact-value {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  font-family: 'SF Mono', Monaco, monospace;
  letter-spacing: 0.5px;
}

.copy-btn {
  padding: 5px 12px;
  background: var(--primary);
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  border-radius: 6px;
}

.copy-btn:active {
  opacity: 0.8;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 10px 12px;
  gap: 10px;
  border-top: 1px solid var(--border);
  z-index: 100;
}

.bar-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 6px 12px;
  border-radius: var(--radius-md);
  transition: all 0.2s;
}

.bar-icon {
  font-size: 20px;
}

.bar-label {
  font-size: 11px;
  color: var(--text-secondary);
}

.bar-collect:active,
.bar-cart:active {
  background: var(--bg);
}

.bar-buy {
  flex: 1;
  flex-direction: row;
  padding: 14px 20px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
  color: #fff;
  box-shadow: var(--shadow-md);
  gap: 6px;
}

.bar-buy .bar-label {
  color: #fff;
  font-size: 15px;
  font-weight: 700;
}

.bar-buy:active {
  transform: scale(0.98);
}

.empty-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 40vh;
}
</style>
