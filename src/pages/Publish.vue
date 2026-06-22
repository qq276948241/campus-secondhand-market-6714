<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, Image as ImageIcon, Tag, MapPin, FileText } from 'lucide-vue-next';
import Header from '@/components/Header.vue';
import BottomNav from '@/components/BottomNav.vue';
import ImageUpload from '@/components/ImageUpload.vue';
import { categories } from '@/data/mock';
import { currentUser } from '@/data/mock';
import { addMyProduct, generateId } from '@/utils/storage';
import type { Product } from '@/types';

const router = useRouter();

const title = ref('');
const description = ref('');
const price = ref('');
const originalPrice = ref('');
const categoryId = ref('');
const condition = ref('9成新');
const location = ref('东校区');
const images = ref<string[]>([]);
const submitting = ref(false);

const conditions = ['全新', '99新', '95新', '9成新', '8成新', '7成新及以下'];
const locations = ['东校区', '西校区', '南校区', '北校区'];

const selectableCategories = computed(() => {
  return categories.filter(c => c.id !== 'all');
});

const canSubmit = computed(() => {
  return title.value.trim() && 
         description.value.trim() && 
         price.value && 
         categoryId.value && 
         images.value.length > 0;
});

const handleImagesChange = (imgs: string[]) => {
  images.value = imgs;
};

const handleSubmit = async () => {
  if (!canSubmit.value || submitting.value) return;
  
  submitting.value = true;

  const category = selectableCategories.value.find(c => c.id === categoryId.value);
  
  const product: Product = {
    id: generateId(),
    title: title.value.trim(),
    description: description.value.trim(),
    price: Number(price.value),
    originalPrice: originalPrice.value ? Number(originalPrice.value) : undefined,
    category: category?.name || '',
    categoryId: categoryId.value,
    images: images.value,
    seller: currentUser,
    createdAt: new Date().toISOString(),
    views: 0,
    condition: condition.value,
    location: location.value,
  };

  addMyProduct(product);

  setTimeout(() => {
    submitting.value = false;
    router.push('/profile?tab=publish');
  }, 500);
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-14 px-4 bg-white shadow-sm md:hidden">
      <button @click="goBack" class="p-2 -ml-2 rounded-full hover:bg-gray-100">
        <ArrowLeft class="w-5 h-5 text-gray-700" />
      </button>
      <span class="font-medium text-gray-800">发布商品</span>
      <button
        @click="handleSubmit"
        :disabled="!canSubmit || submitting"
        class="text-sm font-medium transition-colors"
        :class="canSubmit ? 'text-primary-500' : 'text-gray-300'"
      >
        发布
      </button>
    </div>

    <div class="hidden md:block">
      <Header />
    </div>

    <main class="pt-14 md:pt-20 pb-24 md:pb-8">
      <div class="max-w-2xl mx-auto px-4">
        <div class="bg-white p-4 md:p-6 rounded-card shadow-card md:mt-6">
          <h2 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ImageIcon class="w-5 h-5 text-primary-500" />
            商品图片
          </h2>
          <ImageUpload :max-count="9" @change="handleImagesChange" />
        </div>

        <div class="bg-white p-4 md:p-6 rounded-card shadow-card mt-4">
          <h2 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText class="w-5 h-5 text-primary-500" />
            基本信息
          </h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                商品标题 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="title"
                type="text"
                placeholder="请输入商品标题，最多30字"
                maxlength="30"
                class="w-full h-11 px-4 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                商品描述 <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="description"
                placeholder="详细描述商品的使用情况、购买时间、转让原因等"
                rows="4"
                maxlength="500"
                class="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all resize-none"
              />
              <p class="text-xs text-gray-400 text-right mt-1">{{ description.length }}/500</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-4 md:p-6 rounded-card shadow-card mt-4">
          <h2 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Tag class="w-5 h-5 text-primary-500" />
            价格与分类
          </h2>

          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  转让价格 <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500 font-semibold">¥</span>
                  <input
                    v-model="price"
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    class="w-full h-11 pl-8 pr-4 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  原价 <span class="text-gray-400 text-xs font-normal">(选填)</span>
                </label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">¥</span>
                  <input
                    v-model="originalPrice"
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    class="w-full h-11 pl-8 pr-4 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                商品分类 <span class="text-red-500">*</span>
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="cat in selectableCategories"
                  :key="cat.id"
                  @click="categoryId = cat.id"
                  class="px-4 py-2 rounded-full text-sm font-medium transition-all"
                  :class="categoryId === cat.id 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                >
                  {{ cat.name }}
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                新旧程度
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="c in conditions"
                  :key="c"
                  @click="condition = c"
                  class="px-3 py-1.5 rounded-full text-sm transition-all"
                  :class="condition === c 
                    ? 'bg-primary-100 text-primary-600 border border-primary-300' 
                    : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'"
                >
                  {{ c }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white p-4 md:p-6 rounded-card shadow-card mt-4">
          <h2 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin class="w-5 h-5 text-primary-500" />
            交易地点
          </h2>

          <div class="flex flex-wrap gap-2">
            <button
              v-for="loc in locations"
              :key="loc"
              @click="location = loc"
              class="px-4 py-2 rounded-full text-sm transition-all"
              :class="location === loc 
                ? 'bg-primary-100 text-primary-600 border border-primary-300' 
                : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'"
            >
              {{ loc }}
            </button>
          </div>
        </div>

        <div class="hidden md:block mt-6">
          <button
            @click="handleSubmit"
            :disabled="!canSubmit || submitting"
            class="w-full h-12 text-white font-medium rounded-full transition-all"
            :class="canSubmit && !submitting ? 'bg-primary-500 hover:bg-primary-600' : 'bg-gray-300 cursor-not-allowed'"
          >
            {{ submitting ? '发布中...' : '发布商品' }}
          </button>
        </div>
      </div>
    </main>

    <div v-if="!submitting" class="md:hidden">
      <BottomNav />
    </div>
  </div>
</template>
