<template>
  <div class="category-bar">
    <div class="category-list">
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="category-item"
        :class="{ active: selected === cat.id }"
        @click="select(cat.id)"
      >
        <div class="icon-wrap">
          <span class="icon">{{ cat.icon }}</span>
        </div>
        <span class="name">{{ cat.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { categories } from '../store'

defineProps({
  selected: {
    type: String,
    default: 'all'
  }
})

const emit = defineEmits(['change'])

const select = (id) => {
  emit('change', id)
}
</script>

<style lang="scss" scoped>
.category-bar {
  background: #fff;
  padding: 16px 0 8px;
  margin-bottom: 16px;
  border-radius: 0 0 16px 16px;
  box-shadow: 0 2px 12px rgba(255, 122, 46, 0.06);
}

.category-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 0 8px;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px 4px;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.2s ease;

  &:active {
    background: #fff8f2;
    transform: scale(0.96);
  }

  .icon-wrap {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: #fff8f2;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.25s ease;

    .icon {
      font-size: 24px;
    }
  }

  .name {
    font-size: 12px;
    color: #666;
    transition: all 0.2s ease;
  }

  &.active {
    .icon-wrap {
      background: linear-gradient(135deg, #ff7a2e 0%, #ff9a5e 100%);
      box-shadow: 0 4px 12px rgba(255, 122, 46, 0.3);
    }

    .name {
      color: #ff7a2e;
      font-weight: 600;
    }
  }
}
</style>
