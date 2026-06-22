<template>
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <TabBar />
  </div>
</template>

<script setup>
import TabBar from './components/TabBar.vue'
</script>

<style lang="scss" scoped>
.app-container {
  min-height: 100vh;
  background: #fff8f2;
  padding-bottom: 70px;
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
