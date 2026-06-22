<template>
  <div class="tabbar">
    <div 
      class="tab-item"
      :class="{ active: isActive('/') }"
      @click="go('/')"
    >
      <span class="icon">🏠</span>
      <span class="label">首页</span>
    </div>
    <div 
      class="tab-item"
      :class="{ active: isActive('/publish') }"
      @click="go('/publish')"
    >
      <div class="publish-btn">
        <span class="plus">+</span>
      </div>
      <span class="label">发布</span>
    </div>
    <div 
      class="tab-item"
      :class="{ active: isActive('/profile') }"
      @click="go('/profile')"
    >
      <span class="icon">👤</span>
      <span class="label">我的</span>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const go = (path) => {
  if (route.path !== path) {
    router.push(path)
  }
}

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>

<style lang="scss" scoped>
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 65px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 -2px 12px rgba(255, 122, 46, 0.1);
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom);

  @media screen and (min-width: 768px) {
    left: 50%;
    transform: translateX(-50%);
    max-width: 480px;
  }
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  .icon {
    font-size: 22px;
    opacity: 0.6;
  }

  .label {
    font-size: 12px;
    color: #999;
  }

  &.active {
    .icon {
      opacity: 1;
    }
    .label {
      color: #ff7a2e;
      font-weight: 500;
    }
  }
}

.publish-btn {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff7a2e 0%, #ff9a5e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -20px;
  box-shadow: 0 4px 14px rgba(255, 122, 46, 0.4);
  transition: all 0.2s ease;

  .plus {
    color: #fff;
    font-size: 28px;
    font-weight: 300;
    line-height: 1;
  }
}

.tab-item:nth-child(2) {
  .label {
    color: #ff7a2e;
    font-weight: 500;
  }
}
</style>
