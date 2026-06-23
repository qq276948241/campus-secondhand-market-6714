<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

const tabs = [
  { path: '/', name: '首页', icon: '🏠' },
  { path: '/publish', name: '发布', icon: '➕' },
  { path: '/profile', name: '我的', icon: '👤' }
]

const activePath = computed(() => route.path)

const goTab = (path: string) => {
  if (activePath.value !== path) {
    router.push(path)
  }
}

const showTabbar = computed(() => {
  return !route.path.startsWith('/detail/')
})
</script>

<template>
  <div class="app-root">
    <main class="app-main">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <nav v-if="showTabbar" class="tabbar">
      <div
        v-for="tab in tabs"
        :key="tab.path"
        class="tabbar-item"
        :class="{ active: activePath === tab.path || (tab.path === '/' && activePath === '/') }"
        @click="goTab(tab.path)"
      >
        <span class="tabbar-icon">{{ tab.icon }}</span>
        <span class="tabbar-label">{{ tab.name }}</span>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.app-root {
  min-height: 100vh;
  background: #fff8f3;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  padding-bottom: 72px;
}

.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-top: 1px solid #f0e6dc;
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom);
}

.tabbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.tabbar-icon {
  font-size: 22px;
  opacity: 0.6;
}

.tabbar-label {
  font-size: 12px;
  color: #999;
}

.tabbar-item.active .tabbar-icon {
  opacity: 1;
}

.tabbar-item.active .tabbar-label {
  color: #ff7a2d;
  font-weight: 600;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
