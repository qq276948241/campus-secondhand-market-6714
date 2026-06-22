<script setup lang="ts">
import { Phone, MessageCircle } from 'lucide-vue-next'
import { formatDate } from '@/utils/format'

const props = defineProps<{
  avatar: string
  name: string
  contact: string
  createdAt: string
}>()

function handleCall() {
  window.location.href = `tel:${props.contact}`
}

function handleMessage() {
  alert(`联系方式：${props.contact}\n\n（实际项目中可接入微信/短信等功能）`)
}
</script>

<template>
  <div class="bg-white rounded-card p-4 shadow-card">
    <div class="flex items-center gap-3">
      <img
        :src="avatar"
        :alt="name"
        class="w-12 h-12 rounded-full bg-gray-100"
      />
      <div class="flex-1 min-w-0">
        <h4 class="font-medium text-gray-800 truncate">{{ name }}</h4>
        <p class="text-xs text-gray-400">{{ formatDate(createdAt) }} 发布</p>
      </div>
      <div class="flex gap-2">
        <button
          class="w-10 h-10 rounded-full bg-primary-50 text-primary flex items-center justify-center transition-all active:scale-95"
          title="打电话"
          @click="handleCall"
        >
          <Phone :size="18" />
        </button>
        <button
          class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center transition-all active:scale-95"
          title="联系卖家"
          @click="handleMessage"
        >
          <MessageCircle :size="18" />
        </button>
      </div>
    </div>
  </div>
</template>
