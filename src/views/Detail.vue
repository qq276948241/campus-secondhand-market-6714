<template>
  <div v-if="product" class="detail-page">
    <div class="nav-header">
      <button class="back-btn" @click="goBack">
        <span>←</span>
      </button>
      <h1 class="nav-title">商品详情</h1>
      <button class="share-btn" @click="onShare">
        <span>📤</span>
      </button>
    </div>

    <div class="swiper-wrap">
      <div class="swiper-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div 
          v-for="(img, idx) in product.images" 
          :key="idx" 
          class="swiper-slide"
        >
          <img :src="img" :alt="product.title" />
        </div>
      </div>
      <div class="swiper-indicators">
        <span
          v-for="(_, idx) in product.images"
          :key="idx"
          class="indicator"
          :class="{ active: idx === currentIndex }"
        ></span>
      </div>
      <div class="image-counter">{{ currentIndex + 1 }}/{{ product.images.length }}</div>
    </div>

    <div class="detail-body">
      <div class="price-section card">
        <div class="price-main">
          <span class="price-xl">{{ product.price }}</span>
          <span class="original-price">原价 ¥{{ product.originalPrice }}</span>
          <span v-if="discount > 0" class="discount-badge">省{{ discount }}折</span>
        </div>
        <h1 class="product-title">{{ product.title }}</h1>
        <div class="meta-row">
          <span class="meta-item">📍 {{ product.location }}</span>
          <span class="meta-item">👁 {{ product.viewCount }}次浏览</span>
          <span class="meta-item">🕐 {{ formatTime(product.publishTime) }}</span>
        </div>
      </div>

      <div class="section card">
        <h3 class="section-title">
          <span class="title-line"></span>
          商品描述
        </h3>
        <p class="description">{{ product.description }}</p>
      </div>

      <div class="seller-section card">
        <div class="seller-header">
          <img :src="product.seller.avatar" class="seller-avatar" alt="seller" />
          <div class="seller-info">
            <div class="seller-name">{{ product.seller.name }}</div>
            <div class="seller-tag">
              <span class="tag">{{ product.seller.college }}</span>
              <span class="tag">{{ product.seller.grade }}</span>
            </div>
          </div>
          <div 
            class="fav-btn"
            :class="{ active: isFav }"
            @click="toggleFav"
          >
            <span class="fav-icon">{{ isFav ? '❤️' : '🤍' }}</span>
            <span class="fav-text">{{ isFav ? '已收藏' : '收藏' }}</span>
          </div>
        </div>

        <div class="contact-list">
          <div class="contact-item" @click="copyText(product.seller.wechat)">
            <span class="contact-icon">💬</span>
            <div class="contact-text">
              <span class="contact-label">微信号</span>
              <span class="contact-value">{{ product.seller.wechat }}</span>
            </div>
            <span class="copy-btn">复制</span>
          </div>
          <div class="contact-item" @click="copyText(product.seller.phone)">
            <span class="contact-icon">📱</span>
            <div class="contact-text">
              <span class="contact-label">手机号</span>
              <span class="contact-value">{{ product.seller.phone }}</span>
            </div>
            <span class="copy-btn">复制</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-bar">
      <button class="contact-call-btn" @click="showToast('正在拨打电话...')">
        <span class="btn-icon">📞</span>
        <span>电话联系</span>
      </button>
      <button class="contact-wechat-btn" @click="copyText(product.seller.wechat)">
        <span class="btn-icon">💬</span>
        <span>微信联系</span>
      </button>
    </div>

    <div v-if="toastVisible" class="toast" :class="{ show: toastVisible }">
      {{ toastText }}
    </div>
  </div>

  <div v-else class="empty-state" style="padding-top: 100px;">
    <div class="empty-icon">📦</div>
    <div class="empty-text">商品不存在或已删除</div>
    <button class="btn-primary" style="margin-top: 20px;" @click="goBack">返回首页</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore, categories } from '../store'

const router = useRouter()
const route = useRoute()
const store = useStore()

const product = computed(() => store.getProductById(route.params.id))
const isFav = computed(() => store.isFavorite(route.params.id))

const currentIndex = ref(0)
const toastVisible = ref(false)
const toastText = ref('')
let startX = 0
let touchTimer = null

const discount = computed(() => {
  if (!product.value) return 0
  return 10 - Math.round((product.value.price / product.value.originalPrice) * 10)
})

onMounted(() => {
  if (product.value) {
    store.incrementView(route.params.id)
  }
  document.querySelector('.swiper-wrap')?.addEventListener('touchstart', onTouchStart)
  document.querySelector('.swiper-wrap')?.addEventListener('touchend', onTouchEnd)
})

onUnmounted(() => {
  document.querySelector('.swiper-wrap')?.removeEventListener('touchstart', onTouchStart)
  document.querySelector('.swiper-wrap')?.removeEventListener('touchend', onTouchEnd)
  if (touchTimer) clearInterval(touchTimer)
})

const onTouchStart = (e) => {
  startX = e.touches[0].clientX
}

const onTouchEnd = (e) => {
  const diff = startX - e.changedTouches[0].clientX
  if (Math.abs(diff) < 50) return
  if (diff > 0 && currentIndex.value < product.value.images.length - 1) {
    currentIndex.value++
  } else if (diff < 0 && currentIndex.value > 0) {
    currentIndex.value--
  }
}

const goBack = () => {
  router.back()
}

const toggleFav = () => {
  store.toggleFavorite(route.params.id)
  showToast(isFav.value ? '已加入收藏' : '已取消收藏')
}

const onShare = () => {
  showToast('分享链接已复制')
}

const copyText = (text) => {
  const input = document.createElement('input')
  input.value = text
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
  showToast('已复制到剪贴板')
}

const showToast = (text) => {
  toastText.value = text
  toastVisible.value = true
  setTimeout(() => {
    toastVisible.value = false
  }, 1800)
}

const formatTime = (time) => {
  const diff = Date.now() - time
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return '刚刚发布'
  if (mins < 60) return `${mins}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return new Date(time).toLocaleDateString()
}
</script>

<style lang="scss" scoped>
.detail-page {
  background: #fff8f2;
  min-height: 100vh;
  padding-bottom: 80px;
}

.nav-header {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);

  .back-btn, .share-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #fff8f2;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;

    &:active {
      background: #fff0e5;
    }
  }

  .nav-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
}

.swiper-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: #fff;

  .swiper-track {
    display: flex;
    width: 100%;
    height: 100%;
    transition: transform 0.3s ease;
  }

  .swiper-slide {
    flex-shrink: 0;
    width: 100%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .swiper-indicators {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 6px;

    .indicator {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.5);
      transition: all 0.3s ease;

      &.active {
        width: 18px;
        border-radius: 3px;
        background: #fff;
      }
    }
  }

  .image-counter {
    position: absolute;
    right: 16px;
    bottom: 16px;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    font-size: 12px;
    padding: 4px 10px;
    border-radius: 12px;
  }
}

.detail-body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.price-section {
  padding: 16px;
}

.price-main {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 12px;

  .price-xl {
    color: #ff7a2e;
    font-size: 28px;
    font-weight: 700;

    &::before {
      content: '¥';
      font-size: 0.6em;
      margin-right: 2px;
    }
  }

  .original-price {
    font-size: 13px;
    color: #bbb;
    text-decoration: line-through;
  }

  .discount-badge {
    background: linear-gradient(135deg, #ff7a2e, #ff5722);
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 4px;
  }
}

.product-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  margin-bottom: 12px;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;

  .meta-item {
    font-size: 12px;
    color: #999;
  }
}

.section {
  padding: 16px;

  .section-title {
    font-size: 15px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;

    .title-line {
      display: inline-block;
      width: 3px;
      height: 14px;
      background: linear-gradient(180deg, #ff7a2e, #ff9a5e);
      border-radius: 2px;
    }
  }

  .description {
    font-size: 14px;
    color: #666;
    line-height: 1.7;
  }
}

.seller-section {
  padding: 16px;
}

.seller-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f5f0ea;
  margin-bottom: 16px;

  .seller-avatar {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: #fff8f2;
    flex-shrink: 0;
  }

  .seller-info {
    flex: 1;

    .seller-name {
      font-size: 15px;
      font-weight: 600;
      color: #333;
      margin-bottom: 6px;
    }

    .seller-tag {
      display: flex;
      gap: 6px;

      .tag {
        background: #fff8f2;
        color: #ff7a2e;
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 4px;
      }
    }
  }

  .fav-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 8px 12px;
    border-radius: 10px;
    background: #fff8f2;
    cursor: pointer;
    transition: all 0.2s ease;

    .fav-icon {
      font-size: 20px;
    }

    .fav-text {
      font-size: 11px;
      color: #999;
    }

    &.active {
      background: #ffe8d6;

      .fav-text {
        color: #ff7a2e;
      }
    }

    &:active {
      transform: scale(0.95);
    }
  }
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #fffaf5;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    background: #fff4e8;
  }

  .contact-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .contact-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;

    .contact-label {
      font-size: 12px;
      color: #999;
    }

    .contact-value {
      font-size: 15px;
      color: #333;
      font-weight: 500;
    }
  }

  .copy-btn {
    background: linear-gradient(135deg, #ff7a2e, #ff9a5e);
    color: #fff;
    font-size: 12px;
    padding: 6px 14px;
    border-radius: 14px;
    font-weight: 500;
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  background: #fff;
  box-shadow: 0 -2px 12px rgba(255, 122, 46, 0.1);
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  z-index: 100;

  @media screen and (min-width: 768px) {
    left: 50%;
    transform: translateX(-50%);
    max-width: 480px;
  }

  button {
    flex: 1;
    height: 48px;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 500;
    transition: all 0.2s ease;

    .btn-icon {
      font-size: 18px;
    }

    &:active {
      transform: scale(0.98);
    }
  }

  .contact-call-btn {
    background: #fff8f2;
    color: #ff7a2e;
    border: 1.5px solid #ff9a5e;
  }

  .contact-wechat-btn {
    background: linear-gradient(135deg, #ff7a2e 0%, #ff9a5e 100%);
    color: #fff;
    box-shadow: 0 4px 14px rgba(255, 122, 46, 0.35);
  }
}

.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 200;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;

  &.show {
    opacity: 1;
  }
}
</style>
