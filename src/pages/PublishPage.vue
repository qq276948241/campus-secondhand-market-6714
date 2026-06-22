<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, Tag, FileText, DollarSign, Layers } from 'lucide-vue-next';
import Header from '@/components/Header.vue';
import BottomNav from '@/components/BottomNav.vue';
import ImageUpload from '@/components/ImageUpload.vue';
import { categories, currentUser } from '@/data/mock';
import { addMyProduct, generateId } from '@/utils/storage';
import type { Product } from '@/types';

const router = useRouter();

const productName = ref('');
const description = ref('');
const price = ref('');
const categoryId = ref('');
const images = ref<string[]>([]);
const submitting = ref(false);

const selectableCategories = computed(() => {
  return categories.filter(c => c.id !== 'all');
});

const canSubmit = computed(() => {
  return productName.value.trim() &&
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
    title: productName.value.trim(),
    description: description.value.trim(),
    price: Number(price.value),
    category: category?.name || '',
    categoryId: categoryId.value,
    images: images.value,
    seller: currentUser,
    createdAt: new Date().toISOString(),
    views: 0,
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
        :class="canSubmit && !submitting ? 'text-primary-500' : 'text-gray-300'"
      >
        发布
      </button>
    </div>

    <div class="hidden md:block">
      <Header />
    </div>

    <main class="pt-14 md:pt-20 pb-32 md:pb-8">
      <div class="max-w-2xl mx-auto px-4">
        <div class="bg-white p-5 md:p-6 rounded-card shadow-card md:mt-6">
          <h2 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Layers class="w-5 h-5 text-primary-500" />
            商品图片
          </h2>
          <ImageUpload :max-count="9" @change="handleImagesChange" />
        </div>

        <div class="bg-white p-5 md:p-6 rounded-card shadow-card mt-4">
          <h2 class="font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <FileText class="w-5 h-5 text-primary-500" />
            商品信息
          </h2>

          <div class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                商品名称 <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model="productName"
                  type="text"
                  placeholder="请输入商品名称，例如：iPad Pro 2022"
                  maxlength="50"
                  class="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                商品描述 <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="description"
                placeholder="请详细描述商品的成色、使用情况、购买时间、转让原因等..."
                rows="5"
                maxlength="500"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all resize-none"
              />
              <p class="text-xs text-gray-400 text-right mt-1.5">{{ description.length }}/500</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                转让价格 <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <DollarSign class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500" />
                <input
                  v-model="price"
                  type="number"
                  placeholder="请输入价格"
                  min="0"
                  step="0.01"
                  class="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all"
                />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">元</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                <span class="flex items-center gap-1.5">
                  <Tag class="w-4 h-4" />
                  选择分类 <span class="text-red-500">*</span>
                </span>
              </label>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <button
                  v-for="cat in selectableCategories"
                  :key="cat.id"
                  @click="categoryId = cat.id"
                  class="px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all text-center"
                  :class="categoryId === cat.id
                    ? 'bg-primary-50 border-primary-500 text-primary-600'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'"
                >
                  {{ cat.name }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div class="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div class="bg-white border-t border-gray-100 p-4 pb-20">
        <button
          @click="handleSubmit"
          :disabled="!canSubmit || submitting"
          class="w-full h-12 text-white font-semibold rounded-full transition-all shadow-lg active:scale-[0.98]"
          :class="canSubmit && !submitting
            ? 'bg-primary-500 hover:bg-primary-600 shadow-primary-500/30'
            : 'bg-gray-300 cursor-not-allowed shadow-none'"
        >
          {{ submitting ? '发布中...' : '立即发布' }}
        </button>
      </div>
      <BottomNav />
    </div>

    <div class="hidden md:block max-w-2xl mx-auto px-4 mt-6">
      <button
        @click="handleSubmit"
        :disabled="!canSubmit || submitting"
        class="w-full h-14 text-white font-semibold text-base rounded-full transition-all shadow-lg hover:shadow-xl active:scale-[0.99]"
        :class="canSubmit && !submitting
          ? 'bg-primary-500 hover:bg-primary-600 shadow-primary-500/30'
          : 'bg-gray-300 cursor-not-allowed shadow-none'"
      >
        {{ submitting ? '正在发布...' : '发布商品' }}
      </button>
    </div>
  </div>
</template>
