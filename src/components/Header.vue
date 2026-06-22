<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
    <div class="max-w-6xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <router-link to="/" class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
            <ShoppingBag class="w-5 h-5 text-white" />
          </div>
          <span class="text-lg font-bold text-primary-600 hidden sm:block">校园二手</span>
        </router-link>
      </div>

      <div v-if="showSearch" class="flex-1 max-w-md mx-4">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            v-model="searchText"
            @input="handleSearch"
            placeholder="搜索二手商品..."
            class="w-full h-10 pl-10 pr-4 rounded-full bg-gray-100 text-sm focus:bg-white focus:ring-2 focus:ring-primary-300 transition-all"
          />
        </div>
      </div>

      <div class="flex items-center gap-2">
        <router-link
          to="/publish"
          class="hidden md:flex items-center gap-1.5 h-9 px-4 rounded-full bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          <Plus class="w-4 h-4" />
          <span>发布</span>
        </router-link>
        <router-link
          to="/profile"
          class="w-9 h-9 rounded-full overflow-hidden ring-2 ring-primary-100 hover:ring-primary-300 transition-all"
        >
          <img :src="userAvatar" alt="avatar" class="w-full h-full object-cover" />
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ShoppingBag, Search, Plus } from 'lucide-vue-next'
import { currentUser } from '@/data/mock'

const props = defineProps<{
  showSearch?: boolean
  modelValue?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const searchText = ref(props.modelValue || '')
const userAvatar = currentUser.avatar

watch(() => props.modelValue, (val) => {
  searchText.value = val || ''
})

function handleSearch() {
  emit('update:modelValue', searchText.value)
}
</script>
