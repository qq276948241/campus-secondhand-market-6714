<template>
  <div class="profile-page">
    <div class="profile-header">
      <div class="bg-decoration"></div>
      <div class="user-card">
        <img :src="currentUser.avatar" class="user-avatar" alt="avatar" />
        <div class="user-info">
          <h2 class="user-name">{{ currentUser.name }}</h2>
          <div class="user-tags">
            <span class="user-tag">🎓 {{ currentUser.college }}</span>
            <span class="user-tag">{{ currentUser.grade }}</span>
          </div>
        </div>
        <button class="edit-btn">编辑</button>
      </div>

      <div class="stats-row">
        <div class="stat-item" @click="activeTab = 'published'">
          <span class="stat-num">{{ myPublished.length }}</span>
          <span class="stat-label">我发布的</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item" @click="activeTab = 'favorites'">
          <span class="stat-num">{{ favorites.length }}</span>
          <span class="stat-label">我收藏的</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-num">128</span>
          <span class="stat-label">浏览足迹</span>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="tab-bar card">
        <div 
          class="tab-item" 
          :class="{ active: activeTab === 'published' }"
          @click="activeTab = 'published'"
        >
          <span class="tab-icon">📦</span>
          我发布的
        </div>
        <div 
          class="tab-item" 
          :class="{ active: activeTab === 'favorites' }"
          @click="activeTab = 'favorites'"
        >
          <span class="tab-icon">❤️</span>
          我收藏的
        </div>
      </div>

      <div v-if="activeTab === 'published'">
        <div v-if="myPublished.length > 0" class="product-grid">
          <div 
            v-for="product in myPublished" 
            :key="product.id"
            class="product-wrapper"
          >
            <ProductCard :product="product" />
            <div class="product-actions">
              <button class="action-btn" @click="editProduct(product.id)">
                <span>✏️</span>编辑
              </button>
              <button class="action-btn delete" @click="deleteProduct(product.id)">
                <span>🗑️</span>删除
              </button>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <div class="empty-icon">📭</div>
          <div class="empty-text">还没有发布任何商品</div>
          <button class="btn-primary" style="margin-top: 16px;" @click="goPublish">
            立即发布
          </button>
        </div>
      </div>

      <div v-if="activeTab === 'favorites'">
        <div v-if="favorites.length > 0" class="product-grid">
          <ProductCard 
            v-for="product in favorites" 
            :key="product.id" 
            :product="product"
          />
        </div>
        <div v-else class="empty-state">
          <div class="empty-icon">💔</div>
          <div class="empty-text">还没有收藏任何商品</div>
          <button class="btn-primary" style="margin-top: 16px;" @click="goHome">
            去逛逛
          </button>
        </div>
      </div>
    </div>

    <div v-if="toastVisible" class="toast" :class="{ show: toastVisible }">
      {{ toastText }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '../store'
import ProductCard from '../components/ProductCard.vue'

const router = useRouter()
const store = useStore()

const currentUser = computed(() => store.state.currentUser)
const myPublished = computed(() => store.getMyPublished())
const favorites = computed(() => store.getFavoriteProducts())

const activeTab = ref('published')
const toastVisible = ref(false)
const toastText = ref('')

const goPublish = () => {
  router.push('/publish')
}

const goHome = () => {
  router.push('/')
}

const editProduct = (id) => {
  showToast('编辑功能开发中...')
}

const deleteProduct = (id) => {
  if (confirm('确定要删除这个商品吗？')) {
    store.deleteMyProduct(id)
    showToast('删除成功')
  }
}

const showToast = (text) => {
  toastText.value = text
  toastVisible.value = true
  setTimeout(() => {
    toastVisible.value = false
  }, 1600)
}
</script>

<style lang="scss" scoped>
.profile-page {
  background: #fff8f2;
  min-height: 100vh;
}

.profile-header {
  position: relative;
  padding: 20px 16px 16px;
  background: linear-gradient(135deg, #ff7a2e 0%, #ff9a5e 60%, #ffb88c 100%);
  border-radius: 0 0 28px 28px;
  overflow: hidden;
}

.bg-decoration {
  position: absolute;
  top: -60px;
  right: -40px;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 50%;

  &::after {
    content: '';
    position: absolute;
    top: 30px;
    left: -40px;
    width: 120px;
    height: 120px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 50%;
  }
}

.user-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;

  .user-avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    border: 3px solid rgba(255, 255, 255, 0.5);
    background: #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }

  .user-info {
    flex: 1;

    .user-name {
      font-size: 20px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 8px;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .user-tags {
      display: flex;
      gap: 8px;

      .user-tag {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.95);
        background: rgba(255, 255, 255, 0.22);
        padding: 3px 10px;
        border-radius: 10px;
      }
    }
  }

  .edit-btn {
    padding: 8px 16px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.25);
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    border: 1px solid rgba(255, 255, 255, 0.4);
    transition: all 0.2s ease;

    &:active {
      background: rgba(255, 255, 255, 0.35);
    }
  }
}

.stats-row {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 12px 0;

  .stat-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    transition: transform 0.15s ease;

    &:active {
      transform: scale(0.95);
    }

    .stat-num {
      font-size: 20px;
      font-weight: 700;
      color: #fff;
    }

    .stat-label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.9);
    }
  }

  .stat-divider {
    width: 1px;
    height: 28px;
    background: rgba(255, 255, 255, 0.3);
  }
}

.content {
  padding: 16px 12px 20px;
}

.tab-bar {
  display: flex;
  padding: 6px;
  margin-bottom: 16px;
  border-radius: 14px;
  background: #fff;

  .tab-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 12px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    color: #999;
    cursor: pointer;
    transition: all 0.2s ease;

    .tab-icon {
      font-size: 16px;
      opacity: 0.6;
    }

    &.active {
      background: linear-gradient(135deg, #fff3e8, #ffe8d6);
      color: #ff7a2e;
      font-weight: 600;

      .tab-icon {
        opacity: 1;
      }
    }
  }
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.product-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .product-actions {
    display: flex;
    gap: 8px;

    .action-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      height: 34px;
      border-radius: 8px;
      background: #fff;
      font-size: 12px;
      color: #666;
      box-shadow: 0 1px 4px rgba(255, 122, 46, 0.08);
      transition: all 0.15s ease;

      &:active {
        transform: scale(0.96);
      }

      &.delete {
        color: #ff5722;
      }
    }
  }
}

.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.78);
  color: #fff;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  z-index: 200;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;

  &.show {
    opacity: 1;
  }
}
</style>
