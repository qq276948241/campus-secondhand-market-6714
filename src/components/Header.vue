<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Search, Plus, User, ShoppingBag } from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const searchQuery = ref('');

const handleSearch = () => {
  if (route.name === 'home') {
    router.push({ name: 'home', query: { search: searchQuery.value } });
  } else {
    router.push({ name: 'home', query: { search: searchQuery.value } });
  }
};

const goToPublish = () => {
  router.push('/publish');
};

const goToProfile = () => {
  router.push('/profile');
};

const goHome = () => {
  router.push('/');
};
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
    <div class="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
      <div class="flex items-center gap-2 cursor-pointer" @click="goHome">
        <ShoppingBag class="w-7 h-7 text-primary-500" />
        <span class="text-lg font-bold text-gray-800 hidden sm:inline">校园淘</span>
      </div>

      <div class="flex-1 max-w-md">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索二手好物..."
            class="w-full h-10 pl-10 pr-4 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
            @keyup.enter="handleSearch"
          />
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-4">
        <button
          @click="goToPublish"
          class="flex items-center gap-1 px-3 sm:px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-full hover:bg-primary-600 transition-colors"
        >
          <Plus class="w-4 h-4" />
          <span class="hidden sm:inline">发布</span>
        </button>
        
        <button
          @click="goToProfile"
          class="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <User class="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  </header>
</template>
