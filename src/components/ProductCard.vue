<template>
  <div class="product-card card" @click="goDetail">
    <div class="image-wrap">
      <img :src="product.images[0]" :alt="product.title" class="product-img" />
      <div v-if="discount > 0" class="discount-tag">
        -{{ discount }}折
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

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const discount = computed(() => {
  if (!props.product.originalPrice) return 0
  const d = Math.round((props.product.price / props.product.originalPrice) * 10)
  return d < 10 ? d : 0
})

const goDetail = () => {
  router.push(`/detail/${props.product.id}`)
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
