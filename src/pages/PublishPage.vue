<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProducts } from '@/composables/useProducts'
import { CONDITIONS } from '@/types'
import type { Condition } from '@/types'
import { Camera, X, ChevronDown, Check, Tag, FileText, DollarSign } from 'lucide-vue-next'

const router = useRouter()
const { addProduct, categories } = useProducts()

const title = ref('')
const description = ref('')
const price = ref<number | ''>('')
const originalPrice = ref<number | ''>('')
const selectedCategory = ref<number | null>(null)
const selectedCondition = ref<Condition>('几乎全新')
const imageUrls = ref<string[]>([])
const showCategoryPicker = ref(false)
const isSubmitting = ref(false)

const categoryOptions = computed(() => categories.filter((c) => c.id !== 0))

function triggerUpload() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.multiple = true
  input.onchange = (e: Event) => {
    const files = (e.target as HTMLInputElement).files
    if (!files) return
    Array.from(files).forEach((file) => {
      if (imageUrls.value.length >= 6) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        const result = ev.target?.result as string
        if (result) imageUrls.value.push(result)
      }
      reader.readAsDataURL(file)
    })
  }
  input.click()
}

function removeImage(index: number) {
  imageUrls.value.splice(index, 1)
}

function selectCategory(id: number) {
  selectedCategory.value = id
  showCategoryPicker.value = false
}

function selectCondition(cond: Condition) {
  selectedCondition.value = cond
}

const canSubmit = computed(() => {
  return (
    title.value.trim() !== '' &&
    description.value.trim() !== '' &&
    price.value !== '' &&
    Number(price.value) > 0 &&
    selectedCategory.value !== null &&
    imageUrls.value.length > 0
  )
})

function handleSubmit() {
  if (!canSubmit.value || isSubmitting.value) return
  isSubmitting.value = true

  addProduct({
    title: title.value.trim(),
    description: description.value.trim(),
    price: Number(price.value),
    originalPrice: originalPrice.value ? Number(originalPrice.value) : undefined,
    condition: selectedCondition.value,
    categoryId: selectedCategory.value!,
    sellerId: 1,
    images: imageUrls.value.length > 0 ? imageUrls.value : ['https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=generic%20secondhand%20product%20placeholder%20warm%20lighting&image_size=landscape_4_3'],
  })

  router.push({ name: 'home' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 lg:pt-16">
    <div class="sticky top-0 z-40 bg-white border-b border-gray-100">
      <div class="container flex items-center justify-between h-12">
        <h1 class="text-base font-bold text-gray-800">发布闲置</h1>
        <span class="text-xs text-gray-400">带 * 为必填</span>
      </div>
    </div>

    <div class="container py-4 space-y-4">
      <div class="bg-white rounded-2xl p-4">
        <h2 class="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
          <Camera :size="16" class="text-brand-500" />
          商品图片 <span class="text-brand-500">*</span>
          <span class="ml-auto text-xs text-gray-400 font-normal">{{ imageUrls.length }}/6</span>
        </h2>
        <div class="grid grid-cols-3 gap-2">
          <div
            v-for="(img, idx) in imageUrls"
            :key="idx"
            class="relative aspect-square rounded-xl overflow-hidden group"
          >
            <img :src="img" class="w-full h-full object-cover" />
            <button
              class="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              @click="removeImage(idx)"
            >
              <X :size="12" />
            </button>
          </div>
          <button
            v-if="imageUrls.length < 6"
            class="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-brand-300 hover:text-brand-400 transition-colors"
            @click="triggerUpload"
          >
            <Camera :size="24" />
            <span class="text-[10px]">添加图片</span>
          </button>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 space-y-4">
        <div>
          <label class="text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
            <Tag :size="16" class="text-brand-500" />
            商品标题 <span class="text-brand-500">*</span>
          </label>
          <input
            v-model="title"
            type="text"
            placeholder="给你的宝贝起个好名字"
            class="input-field"
            maxlength="50"
          />
          <p class="text-right text-[10px] text-gray-400 mt-1">{{ title.length }}/50</p>
        </div>

        <div>
          <label class="text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
            <FileText :size="16" class="text-brand-500" />
            详细描述 <span class="text-brand-500">*</span>
          </label>
          <textarea
            v-model="description"
            placeholder="描述一下商品的品牌、型号、入手时间、使用情况等..."
            class="input-field resize-none"
            rows="4"
            maxlength="500"
          ></textarea>
          <p class="text-right text-[10px] text-gray-400 mt-1">{{ description.length }}/500</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 space-y-4">
        <div>
          <label class="text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
            <DollarSign :size="16" class="text-brand-500" />
            售价 <span class="text-brand-500">*</span>
          </label>
          <div class="relative">
            <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-500 font-bold">¥</span>
            <input
              v-model="price"
              type="number"
              placeholder="你期望的价格"
              class="input-field pl-8"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div>
          <label class="text-sm font-medium text-gray-600 mb-1.5 block">原价（选填）</label>
          <div class="relative">
            <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">¥</span>
            <input
              v-model="originalPrice"
              type="number"
              placeholder="购入时的价格"
              class="input-field pl-8"
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 space-y-4">
        <div>
          <label class="text-sm font-bold text-gray-700 mb-2 block">分类 <span class="text-brand-500">*</span></label>
          <button
            class="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:border-brand-300 transition-colors"
            @click="showCategoryPicker = !showCategoryPicker"
          >
            <span :class="selectedCategory !== null ? 'text-gray-800' : 'text-gray-400'">
              {{ selectedCategory !== null ? categories.find(c => c.id === selectedCategory)?.name : '选择分类' }}
            </span>
            <ChevronDown
              :size="16"
              class="text-gray-400 transition-transform duration-200"
              :class="showCategoryPicker ? 'rotate-180' : ''"
            />
          </button>
          <div v-if="showCategoryPicker" class="mt-2 grid grid-cols-3 gap-2">
            <button
              v-for="cat in categoryOptions"
              :key="cat.id"
              class="flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              :class="selectedCategory === cat.id
                ? 'bg-brand-500 text-white shadow-sm'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'"
              @click="selectCategory(cat.id)"
            >
              <Check v-if="selectedCategory === cat.id" :size="14" />
              <span>{{ cat.name }}</span>
            </button>
          </div>
        </div>

        <div>
          <label class="text-sm font-bold text-gray-700 mb-2 block">成色</label>
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="cond in CONDITIONS"
              :key="cond"
              class="px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
              :class="selectedCondition === cond
                ? 'bg-brand-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              @click="selectCondition(cond)"
            >
              {{ cond }}
            </button>
          </div>
        </div>
      </div>

      <button
        class="w-full btn-primary py-3.5 text-base"
        :disabled="!canSubmit || isSubmitting"
        @click="handleSubmit"
      >
        {{ isSubmitting ? '发布中...' : '发布商品' }}
      </button>
    </div>
  </div>
</template>
