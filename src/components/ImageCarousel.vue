<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  images: string[]
  height?: string
}>()

const currentIndex = ref(0)
const startX = ref(0)
const isDragging = ref(false)

const currentTranslate = computed(() => `translateX(-${currentIndex.value * 100}%)`)

function goTo(index: number) {
  if (index < 0) index = props.images.length - 1
  if (index >= props.images.length) index = 0
  currentIndex.value = index
}

function prev() {
  goTo(currentIndex.value - 1)
}

function next() {
  goTo(currentIndex.value + 1)
}

function handleTouchStart(event: TouchEvent) {
  startX.value = event.touches[0].clientX
  isDragging.value = true
}

function handleTouchEnd(event: TouchEvent) {
  if (!isDragging.value) return
  const endX = event.changedTouches[0].clientX
  const diff = startX.value - endX

  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      next()
    } else {
      prev()
    }
  }
  isDragging.value = false
}
</script>

<template>
  <div
    class="relative w-full overflow-hidden bg-gray-100 select-none"
    :style="{ height: height || '375px' }"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <div
      class="flex h-full transition-transform duration-300 ease-out"
      :style="{ transform: currentTranslate }"
    >
      <div
        v-for="(image, index) in images"
        :key="index"
        class="w-full h-full flex-shrink-0"
      >
        <img
          :src="image"
          :alt="`商品图片 ${index + 1}`"
          class="w-full h-full object-cover"
        />
      </div>
    </div>

    <button
      v-if="images.length > 1"
      class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-gray-600 shadow-md transition-all hover:bg-white active:scale-95 hidden md:flex"
      @click="prev"
    >
      <ChevronLeft :size="24" />
    </button>

    <button
      v-if="images.length > 1"
      class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-gray-600 shadow-md transition-all hover:bg-white active:scale-95 hidden md:flex"
      @click="next"
    >
      <ChevronRight :size="24" />
    </button>

    <div
      v-if="images.length > 1"
      class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
    >
      <button
        v-for="(_, index) in images"
        :key="index"
        class="w-2 h-2 rounded-full transition-all"
        :class="currentIndex === index ? 'bg-white w-6' : 'bg-white/50'"
        @click="goTo(index)"
      />
    </div>

    <div class="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
      {{ currentIndex + 1 }} / {{ images.length }}
    </div>
  </div>
</template>
