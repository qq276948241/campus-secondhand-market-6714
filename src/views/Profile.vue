<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { myProducts, myCollected, mockProducts, type Product } from '../data'

const router = useRouter()

type TabType = 'published' | 'collected'
const activeTab = ref<TabType>('published')

const publishedList = ref<Product[]>([...myProducts])
const collectedList = ref<Product[]>([...myCollected])

const currentList = computed(() => {
  return activeTab.value === 'published' ? publishedList.value : collectedList.value
})

const goDetail = (id: number) => {
  router.push(`/detail/${id}`)
}

const goPublish = () => {
  router.push('/publish')
}

const handleAction = (e: Event, action: string, product: Product) => {
  e.stopPropagation()
  if (action === 'delete') {
    if (confirm(`确定要删除「${product.title}」吗？`)) {
      const idx = publishedList.value.findIndex(p => p.id === product.id)
      if (idx > -1) publishedList.value.splice(idx, 1)
    }
  } else if (action === 'offline') {
    alert('商品已下架')
  } else if (action === 'uncollect') {
    const idx = collectedList.value.findIndex(p => p.id === product.id)
    if (idx > -1) {
      collectedList.value.splice(idx, 1)
      const original = mockProducts.find(p => p.id === product.id)
      if (original) original.collected = false
    }
  } else if (action === 'edit') {
    alert('跳转到编辑页面')
  }
}
</script>

<template>
  <div class="profile">
    <header class="profile-header">
      <div class="header-bg"></div>
      <div class="user-card">
        <div class="avatar-wrap">
          <span class="avatar-emoji">🧑‍🎓</span>
        </div>
        <div class="user-info">
          <h2 class="user-name">校园卖家小明</h2>
          <p class="user-bio">📚 计算机学院 · 大三在读</p>
          <div class="user-tags">
            <span class="user-tag">✨ 认证学生</span>
            <span class="user-tag">⭐ 信用良好</span>
          </div>
        </div>
      </div>

      <div class="stats-row">
        <div class="stat-item">
          <div class="stat-num">{{ publishedList.length }}</div>
          <div class="stat-label">我发布的</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-num">{{ collectedList.length }}</div>
          <div class="stat-label">我的收藏</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-num">128</div>
          <div class="stat-label">浏览量</div>
        </div>
      </div>
    </header>

    <section class="action-banner">
      <button class="publish-entry" @click="goPublish">
        <span class="entry-icon">➕</span>
        <div class="entry-text">
          <span class="entry-title">发布闲置商品</span>
          <span class="entry-sub">让闲置物品流转起来</span>
        </div>
        <span class="entry-arrow">→</span>
      </button>
    </section>

    <section class="list-section">
      <div class="tabs">
        <div
          class="tab"
          :class="{ active: activeTab === 'published' }"
          @click="activeTab = 'published'"
        >
          <span>我发布的</span>
          <span class="tab-badge">{{ publishedList.length }}</span>
        </div>
        <div
          class="tab"
          :class="{ active: activeTab === 'collected' }"
          @click="activeTab = 'collected'"
        >
          <span>我的收藏</span>
          <span class="tab-badge">{{ collectedList.length }}</span>
        </div>
        <div class="tab-indicator" :style="{ left: activeTab === 'published' ? '0%' : '50%' }"></div>
      </div>

      <div v-if="currentList.length > 0" class="product-list">
        <div
          v-for="product in currentList"
          :key="product.id"
          class="product-item"
          @click="goDetail(product.id)"
        >
          <div class="item-image-wrap">
            <img :src="product.images[0]" :alt="product.title" class="item-image" />
            <span v-if="activeTab === 'published'" class="status-tag on-sale">在售</span>
          </div>
          <div class="item-content">
            <h3 class="item-title">{{ product.title }}</h3>
            <div class="item-price-row">
              <span class="price item-price">{{ product.price }}</span>
              <span v-if="product.originalPrice" class="price-original">{{ product.originalPrice }}</span>
            </div>
            <div class="item-meta">
              <span>👀 {{ product.views }}</span>
              <span v-if="activeTab === 'published'">🕒 {{ product.createdAt }}</span>
            </div>
            <div class="item-actions" @click.stop>
              <template v-if="activeTab === 'published'">
                <button class="action-btn edit" @click="(e) => handleAction(e, 'edit', product)">
                  ✏️ 编辑
                </button>
                <button class="action-btn offline" @click="(e) => handleAction(e, 'offline', product)">
                  📴 下架
                </button>
                <button class="action-btn delete" @click="(e) => handleAction(e, 'delete', product)">
                  🗑️ 删除
                </button>
              </template>
              <template v-else>
                <button class="action-btn contact" @click="goDetail(product.id)">
                  💬 联系卖家
                </button>
                <button class="action-btn uncollect" @click="(e) => handleAction(e, 'uncollect', product)">
                  ❤️ 取消收藏
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty">
        <span class="empty-icon">{{ activeTab === 'published' ? '📦' : '💭' }}</span>
        <p class="empty-text">
          {{ activeTab === 'published' ? '还没有发布任何商品' : '还没有收藏任何商品' }}
        </p>
        <button
          v-if="activeTab === 'published'"
          class="btn btn-primary"
          style="margin-top: 16px"
          @click="goPublish"
        >
          去发布
        </button>
      </div>
    </section>

    <section class="menu-section">
      <div class="menu-group">
        <div class="menu-item">
          <span class="menu-icon">📞</span>
          <span class="menu-text">我的联系方式</span>
          <span class="menu-arrow">›</span>
        </div>
        <div class="menu-item">
          <span class="menu-icon">⚙️</span>
          <span class="menu-text">设置</span>
          <span class="menu-arrow">›</span>
        </div>
        <div class="menu-item">
          <span class="menu-icon">❓</span>
          <span class="menu-text">帮助与反馈</span>
          <span class="menu-arrow">›</span>
        </div>
        <div class="menu-item">
          <span class="menu-icon">📜</span>
          <span class="menu-text">关于我们</span>
          <span class="menu-arrow">›</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.profile {
  min-height: 100vh;
}

.profile-header {
  position: relative;
  padding-bottom: 20px;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 160px;
  background: linear-gradient(135deg, #ff7a2d 0%, #ff9a5c 60%, #ffb07a 100%);
  border-bottom-left-radius: 32px;
  border-bottom-right-radius: 32px;
}

.user-card {
  position: relative;
  padding: 60px 20px 0;
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.avatar-wrap {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fff5ed, #ffe4d0);
  border: 4px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: var(--shadow-md);
}

.avatar-emoji {
  font-size: 40px;
}

.user-info {
  flex: 1;
  min-width: 0;
  padding-top: 8px;
}

.user-name {
  font-size: 20px;
  font-weight: 800;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.user-bio {
  margin-top: 4px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
}

.user-tags {
  margin-top: 8px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.user-tag {
  padding: 3px 10px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(4px);
  color: #fff;
  font-size: 11px;
  border-radius: 20px;
  font-weight: 500;
}

.stats-row {
  position: relative;
  margin: 20px 16px 0;
  padding: 18px 0;
  background: #fff;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-num {
  font-size: 22px;
  font-weight: 800;
  color: var(--primary);
}

.stat-label {
  margin-top: 2px;
  font-size: 12px;
  color: var(--text-secondary);
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: var(--border);
}

.action-banner {
  padding: 0 16px;
  margin-top: 12px;
}

.publish-entry {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  background: linear-gradient(135deg, #fff5ed 0%, #ffe4d0 100%);
  border-radius: var(--radius-lg);
  border: 1.5px dashed var(--primary-light);
  transition: all 0.2s;
}

.publish-entry:active {
  transform: scale(0.99);
}

.entry-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}

.entry-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.entry-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--primary-dark);
}

.entry-sub {
  font-size: 12px;
  color: var(--text-secondary);
}

.entry-arrow {
  font-size: 22px;
  color: var(--primary);
  font-weight: 300;
}

.list-section {
  margin: 16px;
  background: #fff;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.tabs {
  position: relative;
  display: flex;
  padding: 0 16px;
  border-bottom: 1px solid var(--border-light);
}

.tab {
  position: relative;
  flex: 1;
  padding: 16px 0;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.tab.active {
  color: var(--primary);
}

.tab-badge {
  padding: 1px 8px;
  background: var(--bg);
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 500;
  border-radius: 10px;
}

.tab.active .tab-badge {
  background: var(--primary-bg);
  color: var(--primary);
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  width: 50%;
  height: 3px;
  background: var(--primary);
  border-radius: 3px 3px 0 0;
  transition: left 0.3s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.product-list {
  padding: 8px 16px 16px;
}

.product-item {
  display: flex;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--border-light);
  cursor: pointer;
  transition: opacity 0.2s;
}

.product-item:last-child {
  border-bottom: none;
}

.product-item:active {
  opacity: 0.7;
}

.item-image-wrap {
  position: relative;
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--bg);
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-tag {
  position: absolute;
  top: 6px;
  left: 6px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
}

.status-tag.on-sale {
  background: var(--success);
  color: #fff;
}

.item-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-price-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-top: 6px;
}

.item-price {
  font-size: 17px;
}

.item-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--text-light);
  margin-top: 4px;
}

.item-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;
}

.action-btn.edit {
  background: var(--primary-bg);
  color: var(--primary);
}

.action-btn.offline {
  background: var(--bg);
  color: var(--text-secondary);
}

.action-btn.delete {
  background: #ffe8e8;
  color: var(--danger);
}

.action-btn.contact {
  background: var(--primary-bg);
  color: var(--primary);
}

.action-btn.uncollect {
  background: #ffe8e8;
  color: var(--danger);
}

.action-btn:active {
  opacity: 0.8;
}

.empty {
  padding: 48px 20px;
}

.menu-section {
  padding: 0 16px 24px;
}

.menu-group {
  background: #fff;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  border-bottom: 1px solid var(--border-light);
  cursor: pointer;
  transition: background 0.2s;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background: var(--bg);
}

.menu-icon {
  font-size: 20px;
  width: 24px;
  text-align: center;
}

.menu-text {
  flex: 1;
  font-size: 15px;
  font-weight: 500;
}

.menu-arrow {
  font-size: 20px;
  color: var(--text-light);
  font-weight: 300;
}
</style>
