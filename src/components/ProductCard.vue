<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Heart, Eye } from 'lucide-vue-next';
import type { Product } from '@/types';
import { formatPrice, formatDate, isFavorite } from '@/utils/storage';

const props = defineProps<{
  product: Product;
}>();

const router = useRouter();

const favorite = computed(() => isFavorite(props.product.id));

const goToDetail = () => {
  router.push(`/product/${props.product.id}`);
};
</script>

<template>
  <div
    class="bg-white rounded-card shadow-card overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
    @click="goToDetail"
  >
    <div class="relative aspect-square overflow-hidden bg-gray-100">
      <img
        :src="product.images[0]"
        :alt="product.title"
        class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        loading="lazy"
      />
      <div v-if="product.condition" class="absolute top-2 left-2 px-2 py-0.5 bg-primary-500/90 text-white text-xs rounded-full">
        {{ product.condition }}
      </div>
    </div>

    <div class="p-3">
      <h3 class="text-sm font-medium text-gray-800 line-clamp-2 h-10 leading-5 mb-2">
        {{ product.title }}
      </h3>

      <div class="flex items-baseline gap-1 mb-2">
        <span class="text-lg font-bold text-primary-500">
          {{ formatPrice(product.price) }}
        </span>
        <span v-if="product.originalPrice" class="text-xs text-gray-400 line-through">
          {{ formatPrice(product.originalPrice) }}
        </span>
      </div>

      <div class="flex items-center justify-between text-xs text-gray-500">
        <div class="flex items-center gap-1">
          <img
            :src="product.seller.avatar"
            :alt="product.seller.name"
            class="w-5 h-5 rounded-full"
          />
          <span class="max-w-20 truncate">{{ product.seller.name }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="flex items-center gap-0.5">
            <Eye class="w-3 h-3" />
            {{ product.views }}
          </span>
        </div>
      </div>

      <div class="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
        <span class="text-xs text-gray-400">{{ formatDate(product.createdAt) }}</span>
        <Heart
          class="w-4 h-4 transition-colors"
          :class="favorite ? 'text-red-500 fill-red-500' : 'text-gray-300'"
        />
      </div>
    </div>
  </div>
</template>
