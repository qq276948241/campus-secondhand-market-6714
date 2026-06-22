<script setup lang="ts">
import { ref, watch } from 'vue'
import { Search } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'search': [value: string]
}>()

const inputValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    inputValue.value = newVal
  }
)

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  inputValue.value = target.value
  emit('update:modelValue', target.value)
}

function handleSearch() {
  emit('search', inputValue.value)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    handleSearch()
  }
}
</script>

<template>
  <div class="relative">
    <div class="flex items-center h-11 bg-gray-50 rounded-full px-4 gap-3 transition-colors focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/30">
      <Search :size="20" class="text-gray-400 flex-shrink-0" />
      <input
        type="text"
        :value="inputValue"
        :placeholder="placeholder || '搜索心仪好物'"
        class="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-gray-400"
        @input="handleInput"
        @keydown="handleKeydown"
      />
      <button
        v-if="inputValue"
        class="text-xs text-primary font-medium flex-shrink-0"
        @click="handleSearch"
      >
        搜索
      </button>
    </div>
  </div>
</template>
