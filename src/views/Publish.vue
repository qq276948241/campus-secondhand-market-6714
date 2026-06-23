<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { categories } from '../data'

const router = useRouter()

const title = ref('')
const description = ref('')
const price = ref('')
const originalPrice = ref('')
const category = ref('')
const images = ref<string[]>([])
const MAX_IMAGES = 6

const publishCategories = computed(() => categories.filter(c => c.id !== 'all'))

const canSubmit = computed(() => {
  return title.value.trim() &&
    description.value.trim() &&
    price.value &&
    Number(price.value) > 0 &&
    category.value &&
    images.value.length > 0
})

const handleImageUpload = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files) return
  const files = Array.from(input.files).slice(0, MAX_IMAGES - images.value.length)
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (ev.target?.result && images.value.length < MAX_IMAGES) {
        images.value.push(ev.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  })
  input.value = ''
}

const removeImage = (index: number) => {
  images.value.splice(index, 1)
}

const submit = () => {
  if (!canSubmit.value) return
  alert('✅ 发布成功！商品已上架')
  router.push('/profile')
}

const goBack = () => {
  if (title.value || description.value || price.value || images.value.length) {
    if (confirm('确定要离开吗？已填写的内容将丢失')) {
      router.back()
    }
  } else {
    router.back()
  }
}
</script>

<template>
  <div class="publish">
    <header class="publish-header">
      <button class="back-btn" @click="goBack">
        <span>←</span>
      </button>
      <span class="header-title">发布商品</span>
      <div class="header-placeholder"></div>
    </header>

    <div class="publish-body">
      <section class="form-card card">
        <h3 class="form-label">商品图片 <span class="required">*</span> <span class="hint">(最多{{ MAX_IMAGES }}张)</span></h3>
        <div class="image-grid">
          <div
            v-for="(img, idx) in images"
            :key="idx"
            class="image-item"
          >
            <img :src="img" class="uploaded-image" />
            <button class="remove-image" @click="removeImage(idx)">×</button>
          </div>
          <label v-if="images.length < MAX_IMAGES" class="upload-box">
            <input type="file" accept="image/*" multiple @change="handleImageUpload" hidden />
            <span class="upload-plus">+</span>
            <span class="upload-text">添加图片</span>
          </label>
        </div>
      </section>

      <section class="form-card card">
        <div class="form-item">
          <label class="form-label">商品标题 <span class="required">*</span></label>
          <input
            v-model="title"
            type="text"
            class="form-input"
            placeholder="例如：九成新iPad Air 5 64G"
            maxlength="30"
          />
          <span class="char-count">{{ title.length }}/30</span>
        </div>

        <div class="form-divider"></div>

        <div class="form-item">
          <label class="form-label">商品描述 <span class="required">*</span></label>
          <textarea
            v-model="description"
            class="form-textarea"
            placeholder="详细描述商品的新旧程度、使用情况、出售原因等，让买家更放心~"
            maxlength="500"
          ></textarea>
          <span class="char-count">{{ description.length }}/500</span>
        </div>
      </section>

      <section class="form-card card">
        <div class="form-item">
          <label class="form-label">商品分类 <span class="required">*</span></label>
          <div class="category-grid">
            <div
              v-for="cat in publishCategories"
              :key="cat.id"
              class="cat-option"
              :class="{ active: category === cat.id }"
              @click="category = cat.id"
            >
              <span class="cat-option-icon">{{ cat.icon }}</span>
              <span class="cat-option-name">{{ cat.name }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="form-card card">
        <div class="form-item">
          <label class="form-label">出售价格 <span class="required">*</span></label>
          <div class="price-input-wrap">
            <span class="price-symbol">¥</span>
            <input
              v-model="price"
              type="number"
              min="0"
              step="0.01"
              class="form-input price-input"
              placeholder="0.00"
            />
          </div>
        </div>

        <div class="form-divider"></div>

        <div class="form-item">
          <label class="form-label">
            原价
            <span class="optional">(选填，有助于显示折扣)</span>
          </label>
          <div class="price-input-wrap">
            <span class="price-symbol">¥</span>
            <input
              v-model="originalPrice"
              type="number"
              min="0"
              step="0.01"
              class="form-input price-input"
              placeholder="0.00"
            />
          </div>
          <div v-if="originalPrice && price && Number(originalPrice) > Number(price)" class="discount-hint">
            折扣约 {{ Math.round((1 - Number(price) / Number(originalPrice)) * 100) }}% OFF
          </div>
        </div>
      </section>

      <section class="tips-card">
        <h4 class="tips-title">📌 发布小贴士</h4>
        <ul class="tips-list">
          <li>清晰的实拍图更容易卖出好价钱</li>
          <li>如实描述新旧程度，减少纠纷</li>
          <li>合理定价，参考同类商品价格</li>
          <li>建议校内当面交易，更安全放心</li>
        </ul>
      </section>
    </div>

    <div class="submit-bar safe-bottom">
      <button
        class="btn btn-primary btn-block submit-btn"
        :class="{ disabled: !canSubmit }"
        :disabled="!canSubmit"
        @click="submit"
      >
        立即发布
      </button>
    </div>
  </div>
</template>

<style scoped>
.publish {
  min-height: 100vh;
  padding-bottom: 96px;
}

.publish-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #fff;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--border);
}

.header-title {
  flex: 1;
  text-align: center;
  font-size: 17px;
  font-weight: 700;
}

.header-placeholder {
  width: 36px;
}

.publish-body {
  padding: 12px;
}

.form-card {
  margin-bottom: 12px;
  padding: 16px;
}

.form-item {
  position: relative;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
}

.required {
  color: #f44336;
  font-weight: 700;
}

.hint {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 400;
}

.optional {
  font-size: 12px;
  color: var(--text-light);
  font-weight: 400;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

@media (min-width: 640px) {
  .image-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.image-item {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--bg);
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 18px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-box {
  width: 100%;
  aspect-ratio: 1;
  border: 2px dashed var(--primary-light);
  border-radius: var(--radius-md);
  background: var(--primary-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-box:active {
  background: #ffe4d0;
}

.upload-plus {
  font-size: 32px;
  color: var(--primary);
  font-weight: 300;
  line-height: 1;
}

.upload-text {
  font-size: 12px;
  color: var(--primary);
  font-weight: 500;
}

.form-divider {
  height: 1px;
  background: var(--border-light);
  margin: 16px 0;
}

.form-input {
  width: 100%;
  padding: 12px 14px;
  background: var(--bg);
  border-radius: var(--radius-md);
  font-size: 15px;
  color: var(--text);
  transition: all 0.2s;
}

.form-input:focus {
  background: #fff;
  box-shadow: 0 0 0 2px var(--primary-light);
}

.form-input::placeholder {
  color: var(--text-light);
}

.form-textarea {
  width: 100%;
  min-height: 120px;
  padding: 12px 14px;
  background: var(--bg);
  border-radius: var(--radius-md);
  font-size: 15px;
  color: var(--text);
  resize: vertical;
  line-height: 1.6;
}

.form-textarea:focus {
  background: #fff;
  box-shadow: 0 0 0 2px var(--primary-light);
}

.char-count {
  position: absolute;
  right: 4px;
  bottom: -2px;
  font-size: 12px;
  color: var(--text-light);
  transform: translateY(100%);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.cat-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 8px;
  border-radius: var(--radius-md);
  background: var(--bg);
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.cat-option:active {
  transform: scale(0.96);
}

.cat-option.active {
  background: var(--primary-bg);
  border-color: var(--primary);
}

.cat-option-icon {
  font-size: 26px;
}

.cat-option-name {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

.cat-option.active .cat-option-name {
  color: var(--primary);
  font-weight: 600;
}

.price-input-wrap {
  display: flex;
  align-items: center;
  background: var(--bg);
  border-radius: var(--radius-md);
  padding: 0 14px;
}

.price-symbol {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary);
  margin-right: 4px;
}

.price-input {
  flex: 1;
  background: transparent !important;
  padding: 14px 0 !important;
  font-size: 20px !important;
  font-weight: 700;
}

.price-input:focus {
  box-shadow: none !important;
}

.discount-hint {
  margin-top: 10px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #fff5ed, #ffe4d0);
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--primary-dark);
  font-weight: 600;
  display: inline-block;
}

.tips-card {
  margin-top: 8px;
  padding: 16px;
  background: linear-gradient(135deg, #fffbf5, #fff5ed);
  border-radius: var(--radius-lg);
  border: 1px solid #ffe4d0;
}

.tips-title {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--primary-dark);
}

.tips-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tips-list li {
  font-size: 13px;
  color: #7a6a5d;
  padding-left: 16px;
  position: relative;
}

.tips-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--primary);
  font-weight: 700;
}

.submit-bar {
  position: fixed;
  bottom: 64px;
  left: 0;
  right: 0;
  background: #fff;
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  z-index: 100;
}

.submit-btn {
  padding: 15px !important;
  font-size: 16px !important;
}

.submit-btn.disabled {
  background: #e0d6cc !important;
  box-shadow: none !important;
  cursor: not-allowed;
  color: rgba(255, 255, 255, 0.8) !important;
}

@media (min-width: 768px) {
  .submit-bar {
    bottom: 0;
    padding-bottom: calc(16px + env(safe-area-inset-bottom));
  }
}
</style>
