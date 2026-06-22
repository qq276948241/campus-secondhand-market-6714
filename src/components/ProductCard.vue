<template>
  <div class="product-card card" @click="goDetail">
    <div class="image-wrap">
      <img :src="product.images[0]" :alt="product.title" class="product-img" />
      <div v-if="discount > 0" class="discount-tag">
        -{{ discount }}折
      </div>
      <div 
        class="fav-btn" 
        :class="{ active: isFav }"
        @click.stop="handleFav"
      >
        <svg class="heart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </div>
    </div>
    <div class="info">
      <h3 class="title text-ellipsis-2">{{ product.title }}</h3>
      <div class="price-row">
        <span class="price price-lg">{{ product.price }}</span>
        <span class="original-price">¥{{ product.originalPrice }}</span>
      </div>
      <div class="meta">
        <span class="location">📍 {{ product.location }}</span>
        <span class="views">{{ product.viewCount }}次浏览</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '../store'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const store = useStore()

const isFav = computed(() => store.isFavorite(props.product.id))

const discount = computed(() => {
  if (!props.product.originalPrice) return 0
  const d = Math.round((props.product.price / props.product.originalPrice) * 10)
  return d < 10 ? d : 0
})

const goDetail = () => {
  router.push(`/detail/${props.product.id}`)
}

const handleFav = () => {
  store.toggleFavorite(props.product.id)
}
</script>

<style lang="scss" scoped>
.product-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  cursor: pointer;

  &:active {
    transform: scale(0.98);
  }
}

.image-wrap {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
  background: #fff5ee;

  .product-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .discount-tag {
    position: absolute;
    top: 8px;
    left: 8px;
    background: linear-gradient(135deg, #ff7a2e, #ff5722);
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 4px;
  }

  .fav-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 5;

    .heart-icon {
      width: 18px;
      height: 18px;
      color: #ccc;
      transition: all 0.2s ease;
    }

    &:active {
      transform: scale(0.9);
    }

    &.active {
      background: #fff;
      box-shadow: 0 2px 8px rgba(255, 122, 46, 0.3);

      .heart-icon {
        color: #ff7a2e;
        fill: #ff7a2e;
        animation: heartBeat 0.3s ease;
      }
    }
  }

  @keyframes heartBeat {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
  }
}

.info {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.title {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  min-height: 2.8em;
  font-weight: 500;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.price-lg {
  font-size: 18px;
}

.original-price {
  font-size: 12px;
  color: #bbb;
  text-decoration: line-through;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #999;
}
</style>
