<template>
  <div class="search-bar">
    <div class="search-wrap">
      <span class="search-icon">🔍</span>
      <input
        type="text"
        class="search-input"
        v-model="inputValue"
        :placeholder="placeholder"
        @input="onInput"
        @keyup.enter="onSearch"
      />
      <span v-if="inputValue" class="clear-btn" @click="clear">✕</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '搜索二手好物...'
  }
})

const emit = defineEmits(['update:modelValue', 'search'])

const inputValue = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  inputValue.value = val
})

const onInput = () => {
  emit('update:modelValue', inputValue.value)
}

const onSearch = () => {
  emit('search', inputValue.value)
}

const clear = () => {
  inputValue.value = ''
  emit('update:modelValue', '')
  emit('search', '')
}
</script>

<style lang="scss" scoped>
.search-bar {
  padding: 12px 16px;
  background: linear-gradient(135deg, #ff7a2e 0%, #ff9a5e 100%);
}

.search-wrap {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 24px;
  padding: 0 16px;
  height: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.search-icon {
  font-size: 16px;
  margin-right: 8px;
  opacity: 0.6;
}

.search-input {
  flex: 1;
  height: 100%;
  font-size: 14px;
  color: #333;
  background: transparent;

  &::placeholder {
    color: #bbb;
  }
}

.clear-btn {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #999;
  cursor: pointer;
}
</style>
