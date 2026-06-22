<template>
  <div class="publish-page">
    <div class="nav-header">
      <button class="back-btn" @click="goBack">
        <span>←</span>
      </button>
      <h1 class="nav-title">发布闲置</h1>
      <div style="width: 36px;"></div>
    </div>

    <div class="form-body">
      <div class="form-section card">
        <h3 class="form-label">
          <span class="required">*</span>
          上传商品图片
        </h3>
        <div class="upload-grid">
          <div 
            v-for="(img, idx) in form.images" 
            :key="idx"
            class="upload-item"
          >
            <img :src="img" alt="preview" />
            <span class="remove-btn" @click="removeImage(idx)">✕</span>
          </div>
          <div 
            v-if="form.images.length < 6"
            class="upload-btn"
            @click="triggerUpload"
          >
            <span class="plus-icon">+</span>
            <span class="upload-text">{{ form.images.length }}/6</span>
          </div>
        </div>
        <input 
          type="file" 
          ref="fileInput"
          accept="image/*" 
          multiple
          style="display:none"
          @change="handleFileSelect"
        />
      </div>

      <div class="form-section card">
        <div class="form-row">
          <label class="form-label">
            <span class="required">*</span>
            商品标题
          </label>
          <input 
            type="text" 
            v-model="form.title" 
            class="form-input"
            placeholder="请输入商品名称，最多30字"
            maxlength="30"
          />
          <span class="char-count">{{ form.title.length }}/30</span>
        </div>

        <div class="form-row">
          <label class="form-label">
            <span class="required">*</span>
            商品分类
          </label>
          <div class="category-picker" @click="showCategoryPicker = true">
            <span v-if="form.category" class="category-selected">
              <span class="cat-icon">{{ selectedCatInfo?.icon }}</span>
              {{ selectedCatInfo?.name }}
            </span>
            <span v-else class="category-placeholder">请选择商品分类</span>
            <span class="arrow">›</span>
          </div>
        </div>

        <div class="form-row">
          <label class="form-label">
            <span class="required">*</span>
            商品价格
          </label>
          <div class="price-input-wrap">
            <span class="price-symbol">¥</span>
            <input 
              type="number" 
              v-model="form.price" 
              class="price-input"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div class="form-row">
          <label class="form-label">原价</label>
          <div class="price-input-wrap">
            <span class="price-symbol">¥</span>
            <input 
              type="number" 
              v-model="form.originalPrice" 
              class="price-input"
              placeholder="选填，方便显示折扣"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div class="form-row no-border">
          <label class="form-label">
            <span class="required">*</span>
            商品描述
          </label>
          <textarea 
            v-model="form.description" 
            class="form-textarea"
            placeholder="详细描述商品的新旧程度、使用情况、出售原因等，让买家更放心~"
            maxlength="300"
            rows="4"
          ></textarea>
          <span class="char-count">{{ form.description.length }}/300</span>
        </div>
      </div>

      <div class="form-section card">
        <div class="form-row">
          <label class="form-label">交易地点</label>
          <input 
            type="text" 
            v-model="form.location" 
            class="form-input"
            placeholder="例如：东区12号楼楼下"
          />
        </div>
      </div>

      <div class="tips-section">
        <h4 class="tips-title">📝 温馨提示</h4>
        <ul class="tips-list">
          <li>请如实描述商品状况，避免交易纠纷</li>
          <li>建议选择光线充足的地方拍摄清晰图片</li>
          <li>线下交易请选择校园内公共场所，注意安全</li>
        </ul>
      </div>
    </div>

    <div class="bottom-bar">
      <button class="draft-btn" @click="saveDraft">存为草稿</button>
      <button class="submit-btn" @click="submitForm" :disabled="!canSubmit">
        立即发布
      </button>
    </div>

    <div v-if="showCategoryPicker" class="picker-mask" @click.self="showCategoryPicker = false">
      <div class="picker-content">
        <div class="picker-header">
          <span class="picker-cancel" @click="showCategoryPicker = false">取消</span>
          <span class="picker-title">选择分类</span>
          <span class="picker-confirm" @click="showCategoryPicker = false">确定</span>
        </div>
        <div class="picker-body">
          <div
            v-for="cat in selectableCategories"
            :key="cat.id"
            class="cat-option"
            :class="{ active: form.category === cat.id }"
            @click="selectCategory(cat.id)"
          >
            <span class="cat-icon">{{ cat.icon }}</span>
            <span class="cat-name">{{ cat.name }}</span>
            <span v-if="form.category === cat.id" class="check-icon">✓</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="toastVisible" class="toast" :class="{ show: toastVisible }">
      {{ toastText }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore, categories } from '../store'

const router = useRouter()
const store = useStore()
const fileInput = ref(null)

const form = reactive({
  images: [],
  title: '',
  category: '',
  price: '',
  originalPrice: '',
  description: '',
  location: ''
})

const selectableCategories = computed(() => categories.filter(c => c.id !== 'all'))
const selectedCatInfo = computed(() => categories.find(c => c.id === form.category))

const showCategoryPicker = ref(false)
const toastVisible = ref(false)
const toastText = ref('')

const canSubmit = computed(() => {
  return (
    form.images.length > 0 &&
    form.title.trim().length >= 2 &&
    form.category &&
    Number(form.price) >= 0 &&
    form.description.trim().length >= 5
  )
})

const goBack = () => {
  if (form.title || form.images.length > 0 || form.description) {
    if (confirm('内容未保存，确定要离开吗？')) {
      router.back()
    }
  } else {
    router.back()
  }
}

const triggerUpload = () => {
  fileInput.value?.click()
}

const handleFileSelect = (e) => {
  const files = Array.from(e.target.files || [])
  const remaining = 6 - form.images.length
  files.slice(0, remaining).forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      form.images.push(e.target.result)
    }
    reader.readAsDataURL(file)
  })
  e.target.value = ''
}

const removeImage = (idx) => {
  form.images.splice(idx, 1)
}

const selectCategory = (id) => {
  form.category = id
}

const validateForm = () => {
  if (form.images.length === 0) {
    showToast('请至少上传一张商品图片')
    return false
  }
  if (form.title.trim().length < 2) {
    showToast('请输入商品标题')
    return false
  }
  if (!form.category) {
    showToast('请选择商品分类')
    return false
  }
  if (!form.price || Number(form.price) < 0) {
    showToast('请输入有效的商品价格')
    return false
  }
  if (form.description.trim().length < 5) {
    showToast('商品描述至少5个字')
    return false
  }
  return true
}

const submitForm = () => {
  if (!validateForm()) return

  const productId = store.addProduct({
    images: form.images.length ? form.images : [
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600'
    ],
    title: form.title.trim(),
    category: form.category,
    price: Number(form.price) || 0,
    originalPrice: Number(form.originalPrice) || Number(form.price) * 1.5,
    description: form.description.trim(),
    location: form.location.trim() || '校内面议'
  })

  showToast('🎉 发布成功！')
  
  setTimeout(() => {
    router.push(`/detail/${productId}`)
  }, 1200)
}

const saveDraft = () => {
  showToast('草稿已保存')
  setTimeout(() => {
    router.back()
  }, 800)
}

const showToast = (text) => {
  toastText.value = text
  toastVisible.value = true
  setTimeout(() => {
    toastVisible.value = false
  }, 1800)
}
</script>

<style lang="scss" scoped>
.publish-page {
  background: #fff8f2;
  min-height: 100vh;
  padding-bottom: 100px;
}

.nav-header {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, #ff7a2e 0%, #ff9a5e 100%);

  .back-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #fff;

    &:active {
      background: rgba(255, 255, 255, 0.35);
    }
  }

  .nav-title {
    font-size: 17px;
    font-weight: 600;
    color: #fff;
  }
}

.form-body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-section {
  padding: 4px 16px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 16px 0 12px;

  .required {
    color: #ff5722;
    font-weight: 600;
  }
}

.upload-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}

.upload-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  background: #fff8f2;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .remove-btn {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.55);
    color: #fff;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
}

.upload-btn {
  aspect-ratio: 1;
  border-radius: 10px;
  border: 1.5px dashed #ffc49a;
  background: #fffaf5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    background: #fff4e8;
  }

  .plus-icon {
    font-size: 32px;
    color: #ff9a5e;
    font-weight: 300;
    line-height: 1;
  }

  .upload-text {
    font-size: 12px;
    color: #ff9a5e;
  }
}

.form-row {
  padding: 12px 0;
  border-bottom: 1px solid #f5f0ea;
  position: relative;

  &.no-border {
    border-bottom: none;
  }

  .form-label {
    margin: 0 0 10px;
  }

  .form-input {
    width: 100%;
    height: 42px;
    background: #fffaf5;
    border-radius: 10px;
    padding: 0 14px;
    font-size: 15px;
    color: #333;

    &::placeholder {
      color: #bbb;
    }
  }

  .form-textarea {
    width: 100%;
    background: #fffaf5;
    border-radius: 10px;
    padding: 12px 14px;
    font-size: 14px;
    color: #333;
    resize: none;
    line-height: 1.6;

    &::placeholder {
      color: #bbb;
    }
  }

  .char-count {
    position: absolute;
    right: 8px;
    bottom: 14px;
    font-size: 11px;
    color: #ccc;
  }
}

.category-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  background: #fffaf5;
  border-radius: 10px;
  padding: 0 14px;
  cursor: pointer;

  .category-selected {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    color: #333;
    font-weight: 500;

    .cat-icon {
      font-size: 20px;
    }
  }

  .category-placeholder {
    font-size: 14px;
    color: #bbb;
  }

  .arrow {
    font-size: 22px;
    color: #ccc;
  }
}

.price-input-wrap {
  display: flex;
  align-items: center;
  height: 48px;
  background: #fffaf5;
  border-radius: 10px;
  padding: 0 14px;

  .price-symbol {
    font-size: 20px;
    color: #ff7a2e;
    font-weight: 600;
    margin-right: 8px;
  }

  .price-input {
    flex: 1;
    height: 100%;
    background: transparent;
    font-size: 18px;
    font-weight: 600;
    color: #333;

    &::placeholder {
      color: #ddd;
      font-weight: 400;
      font-size: 14px;
    }
  }
}

.tips-section {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(255, 122, 46, 0.06);

  .tips-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
  }

  .tips-list {
    display: flex;
    flex-direction: column;
    gap: 8px;

    li {
      font-size: 12px;
      color: #999;
      line-height: 1.5;
      padding-left: 16px;
      position: relative;

      &::before {
        content: '•';
        position: absolute;
        left: 4px;
        color: #ffb080;
      }
    }
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

  .draft-btn {
    flex: 0 0 auto;
    width: 100px;
    height: 48px;
    border-radius: 24px;
    background: #fff8f2;
    color: #ff7a2e;
    font-size: 15px;
    font-weight: 500;
    border: 1.5px solid #ffd3b0;
  }

  .submit-btn {
    flex: 1;
    height: 48px;
    border-radius: 24px;
    background: linear-gradient(135deg, #ff7a2e 0%, #ff9a5e 100%);
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    box-shadow: 0 4px 14px rgba(255, 122, 46, 0.35);
    transition: all 0.2s ease;

    &:disabled {
      opacity: 0.5;
      box-shadow: none;
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }
  }
}

.picker-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
  display: flex;
  align-items: flex-end;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
}

.picker-content {
  width: 100%;
  background: #fff;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  animation: slideUp 0.25s ease;

  @media screen and (min-width: 768px) {
    max-width: 480px;
    margin: 0 auto;
  }

  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f5f0ea;

  .picker-cancel {
    font-size: 15px;
    color: #999;
    padding: 4px 8px;
  }

  .picker-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }

  .picker-confirm {
    font-size: 15px;
    color: #ff7a2e;
    font-weight: 500;
    padding: 4px 8px;
  }
}

.picker-body {
  padding: 8px 16px 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.cat-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:active {
    background: #fff8f2;
  }

  &.active {
    background: #fff8f2;

    .cat-name {
      color: #ff7a2e;
      font-weight: 600;
    }
  }

  .cat-icon {
    font-size: 24px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff8f2;
    border-radius: 10px;
  }

  .cat-name {
    flex: 1;
    font-size: 15px;
    color: #333;
  }

  .check-icon {
    color: #ff7a2e;
    font-size: 18px;
    font-weight: 600;
  }
}

.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.78);
  color: #fff;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 14px;
  z-index: 300;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
  text-align: center;
  max-width: 80%;

  &.show {
    opacity: 1;
  }
}
</style>
