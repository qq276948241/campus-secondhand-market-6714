<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ArrowLeft, Tag, DollarSign, AlignLeft, Image, ChevronDown } from 'lucide-vue-next'
import ImageUpload from '@/components/ImageUpload.vue'
import { CATEGORIES, type ProductCategory } from '@/types'
import { useProductStore } from '@/stores/product'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const productStore = useProductStore()
const userStore = useUserStore()
const { currentUser } = storeToRefs(userStore)

const images = ref<string[]>([])
const title = ref('')
const description = ref('')
const price = ref('')
const category = ref<ProductCategory>('数码电子')
const showCategoryPicker = ref(false)
const isSubmitting = ref(false)

const categoriesWithoutAll = computed(() => CATEGORIES.filter((c) => c !== '全部'))

const canSubmit = computed(() => {
  return (
    images.value.length > 0 &&
    title.value.trim().length >= 2 &&
    description.value.trim().length >= 5 &&
    parseFloat(price.value) > 0
  )
})

function goBack() {
  router.back()
}

function toggleCategoryPicker() {
  showCategoryPicker.value = !showCategoryPicker.value
}

function selectCategory(cat: ProductCategory) {
  category.value = cat
  showCategoryPicker.value = false
}

async function handleSubmit() {
  if (!canSubmit.value || isSubmitting.value) return

  isSubmitting.value = true

  try {
    productStore.addProduct({
      title: title.value.trim(),
      description: description.value.trim(),
      price: parseFloat(price.value),
      category: category.value,
      images: images.value,
      sellerId: currentUser.value.id,
      sellerName: currentUser.value.name,
      sellerAvatar: currentUser.value.avatar,
      contact: currentUser.value.contact,
    })

    alert('发布成功！')
    router.push('/profile')
  } catch (error) {
    alert('发布失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-8">
    <header class="sticky top-0 z-40 bg-white border-b border-gray-100">
      <div class="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <button
          class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-all active:scale-95"
          @click="goBack"
        >
          <ArrowLeft :size="20" />
        </button>
        <h1 class="text-lg font-medium text-gray-800">发布商品</h1>
        <div class="w-10" />
      </div>
    </header>

    <main class="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div class="bg-white rounded-card p-5 shadow-card">
        <div class="flex items-center gap-2 mb-4">
          <Image :size="20" class="text-primary" />
          <h3 class="font-medium text-gray-800">商品图片</h3>
          <span class="text-xs text-gray-400">（最多9张）</span>
        </div>
        <ImageUpload v-model="images" :max="9" />
      </div>

      <div class="bg-white rounded-card p-5 shadow-card space-y-5">
        <div>
          <div class="flex items-center gap-2 mb-3">
            <Tag :size="20" class="text-primary" />
            <h3 class="font-medium text-gray-800">商品标题</h3>
          </div>
          <input
            v-model="title"
            type="text"
            placeholder="请输入商品标题，最多50字"
            class="input-field"
            maxlength="50"
          />
          <p class="text-right text-xs text-gray-400 mt-1">{{ title.length }} / 50</p>
        </div>

        <div>
          <div class="flex items-center gap-2 mb-3">
            <AlignLeft :size="20" class="text-primary" />
            <h3 class="font-medium text-gray-800">商品描述</h3>
          </div>
          <textarea
            v-model="description"
            placeholder="请详细描述商品成色、使用情况、转手原因等"
            class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors resize-none"
            rows="4"
            maxlength="500"
          />
          <p class="text-right text-xs text-gray-400 mt-1">{{ description.length }} / 500</p>
        </div>

        <div>
          <div class="flex items-center gap-2 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
            <h3 class="font-medium text-gray-800">商品分类</h3>
          </div>
          <div class="relative">
            <button
              class="w-full px-4 py-3 border border-gray-200 rounded-lg flex items-center justify-between transition-colors focus:border-primary"
              type="button"
              @click="toggleCategoryPicker"
            >
              <span :class="category ? 'text-gray-800' : 'text-gray-400'">
                {{ category || '请选择分类' }}
              </span>
              <ChevronDown :size="20" class="text-gray-400 transition-transform" :class="{ 'rotate-180': showCategoryPicker }" />
            </button>

            <div
              v-if="showCategoryPicker"
              class="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-10 max-h-60 overflow-y-auto"
            >
              <button
                v-for="cat in categoriesWithoutAll"
                :key="cat"
                class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                :class="{ 'text-primary bg-primary-50': category === cat }"
                type="button"
                @click="selectCategory(cat)"
              >
                {{ cat }}
              </button>
            </div>
          </div>
        </div>

        <div>
          <div class="flex items-center gap-2 mb-3">
            <DollarSign :size="20" class="text-primary" />
            <h3 class="font-medium text-gray-800">商品价格</h3>
          </div>
          <div class="flex items-center">
            <span class="text-xl font-bold text-primary mr-2">¥</span>
            <input
              v-model="price"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              class="input-field flex-1 text-xl font-bold text-gray-800"
            />
          </div>
        </div>
      </div>

      <div class="bg-blue-50 rounded-card p-4 text-blue-600 text-sm">
        <p>📌 温馨提示：</p>
        <ul class="mt-2 space-y-1 text-xs">
          <li>• 请如实描述商品情况，避免交易纠纷</li>
          <li>• 建议选择校园当面交易，更安全可靠</li>
          <li>• 禁止发布违禁品、假冒伪劣商品</li>
        </ul>
      </div>
    </main>

    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 md:hidden">
      <div class="max-w-2xl mx-auto px-4 py-3">
        <button
          class="w-full btn-primary py-3 text-base"
          :disabled="!canSubmit || isSubmitting"
          :class="{ 'opacity-50 cursor-not-allowed': !canSubmit || isSubmitting }"
          @click="handleSubmit"
        >
          {{ isSubmitting ? '发布中...' : '立即发布' }}
        </button>
      </div>
    </div>

    <div class="hidden md:block max-w-2xl mx-auto px-4 pb-6">
      <button
        class="w-full btn-primary py-3 text-base"
        :disabled="!canSubmit || isSubmitting"
        :class="{ 'opacity-50 cursor-not-allowed': !canSubmit || isSubmitting }"
        @click="handleSubmit"
      >
        {{ isSubmitting ? '发布中...' : '立即发布' }}
      </button>
    </div>
  </div>
</template>
