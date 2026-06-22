<template>
  <div class="min-h-screen bg-gray-50 pb-24">
    <Header />
    <main class="max-w-2xl mx-auto pt-20 pb-8 px-4">
      <h1 class="text-xl font-bold text-gray-800 mb-5">发布商品</h1>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div class="bg-white rounded-card p-4 md:p-5">
          <label class="block text-sm font-medium text-gray-700 mb-3">
            商品图片 <span class="text-primary-500">*</span>
            <span class="text-gray-400 font-normal ml-1">(最多9张)</span>
          </label>
          <ImageUpload v-model="form.images" />
          <p v-if="errors.images" class="mt-2 text-sm text-red-500">{{ errors.images }}</p>
        </div>

        <div class="bg-white rounded-card p-4 md:p-5 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              商品标题 <span class="text-primary-500">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              placeholder="请输入商品标题，如：九成新 MacBook Pro"
              maxlength="50"
              class="w-full h-11 px-4 rounded-lg border border-gray-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
            />
            <div class="flex justify-between mt-1">
              <p v-if="errors.title" class="text-sm text-red-500">{{ errors.title }}</p>
              <span v-else class="text-xs text-gray-400"></span>
              <span class="text-xs text-gray-400">{{ form.title.length }}/50</span>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              商品分类 <span class="text-primary-500">*</span>
            </label>
            <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
              <button
                v-for="cat in categoryOptions"
                :key="cat.id"
                type="button"
                @click="form.category = cat.id"
                class="h-10 rounded-lg text-sm border transition-all"
                :class="form.category === cat.id
                  ? 'border-primary-500 bg-primary-50 text-primary-600 font-medium'
                  : 'border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-500'"
              >
                {{ cat.name }}
              </button>
            </div>
            <p v-if="errors.category" class="mt-2 text-sm text-red-500">{{ errors.category }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              商品价格 <span class="text-primary-500">*</span>
            </label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
              <input
                v-model="form.price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                class="w-full h-11 pl-8 pr-4 rounded-lg border border-gray-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
              />
            </div>
            <p v-if="errors.price" class="mt-1 text-sm text-red-500">{{ errors.price }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              商品描述 <span class="text-primary-500">*</span>
            </label>
            <textarea
              v-model="form.description"
              placeholder="详细描述商品的成色、使用情况、购买渠道等信息..."
              rows="5"
              maxlength="500"
              class="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm resize-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
            />
            <div class="flex justify-between mt-1">
              <p v-if="errors.description" class="text-sm text-red-500">{{ errors.description }}</p>
              <span v-else class="text-xs text-gray-400"></span>
              <span class="text-xs text-gray-400">{{ form.description.length }}/500</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-card p-4 md:p-5">
          <h3 class="text-sm font-medium text-gray-700 mb-3">联系方式（默认使用您的资料）</h3>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-gray-500 mb-1">手机号</label>
              <input
                v-model="form.phone"
                type="text"
                class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
              />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">微信号</label>
              <input
                v-model="form.wechat"
                type="text"
                class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
              />
            </div>
          </div>
          <p v-if="errors.contact" class="mt-2 text-sm text-red-500">{{ errors.contact }}</p>
        </div>

        <div class="pt-2">
          <button
            type="submit"
            :disabled="submitting"
            class="w-full h-12 rounded-full bg-primary-500 text-white font-medium text-base hover:bg-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Loader2 v-if="submitting" class="w-5 h-5 animate-spin" />
            <span>{{ submitting ? '发布中...' : '立即发布' }}</span>
          </button>
        </div>
      </form>
    </main>

    <div
      v-if="showSuccess"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div class="w-[85%] max-w-sm bg-white rounded-2xl p-6 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <Check class="w-8 h-8 text-green-600" />
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">发布成功！</h3>
        <p class="text-sm text-gray-500 mb-5">您的商品已成功上架，可在个人中心查看</p>
        <div class="flex gap-3">
          <button
            @click="showSuccess = false; resetForm()"
            class="flex-1 h-10 rounded-full border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors"
          >
            继续发布
          </button>
          <button
            @click="goProfile"
            class="flex-1 h-10 rounded-full bg-primary-500 text-white text-sm hover:bg-primary-600 transition-colors"
          >
            查看我的
          </button>
        </div>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Loader2, Check } from 'lucide-vue-next'
import Header from '@/components/Header.vue'
import BottomNav from '@/components/BottomNav.vue'
import ImageUpload from '@/components/ImageUpload.vue'
import { categories, currentUser } from '@/data/mock'
import { addMyProduct } from '@/utils/storage'
import type { Product } from '@/types'

const router = useRouter()

const categoryOptions = categories.filter(c => c.id !== 'all')

const form = reactive({
  title: '',
  description: '',
  price: '',
  category: '',
  images: [] as string[],
  phone: '',
  wechat: ''
})

const errors = reactive({
  title: '',
  description: '',
  price: '',
  category: '',
  images: '',
  contact: ''
})

const submitting = ref(false)
const showSuccess = ref(false)

onMounted(() => {
  form.phone = currentUser.phone
  form.wechat = currentUser.wechat
})

function validate(): boolean {
  let valid = true
  Object.keys(errors).forEach(k => { (errors as any)[k] = '' })

  if (form.images.length === 0) {
    errors.images = '请至少上传一张商品图片'
    valid = false
  }
  if (!form.title.trim()) {
    errors.title = '请输入商品标题'
    valid = false
  } else if (form.title.trim().length < 5) {
    errors.title = '标题至少5个字符'
    valid = false
  }
  if (!form.category) {
    errors.category = '请选择商品分类'
    valid = false
  }
  if (!form.price || parseFloat(form.price) <= 0) {
    errors.price = '请输入有效价格'
    valid = false
  }
  if (!form.description.trim()) {
    errors.description = '请输入商品描述'
    valid = false
  } else if (form.description.trim().length < 10) {
    errors.description = '描述至少10个字符'
    valid = false
  }
  if (!form.phone.trim() && !form.wechat.trim()) {
    errors.contact = '请至少填写一种联系方式'
    valid = false
  }

  return valid
}

function handleSubmit() {
  if (!validate()) return

  submitting.value = true

  setTimeout(() => {
    const now = new Date()
    const pad = (n: number) => n.toString().padStart(2, '0')
    const createdAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`

    const newProduct: Product = {
      id: `my_${Date.now()}`,
      title: form.title.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price),
      category: form.category,
      images: form.images,
      seller: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        phone: form.phone,
        wechat: form.wechat
      },
      createdAt,
      views: 0,
      isMyPublish: true
    }

    addMyProduct(newProduct)
    submitting.value = false
    showSuccess.value = true
  }, 800)
}

function resetForm() {
  form.title = ''
  form.description = ''
  form.price = ''
  form.category = ''
  form.images = []
}

function goProfile() {
  router.push('/profile')
}
</script>
