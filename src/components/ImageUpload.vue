<script setup lang="ts">
import { ref, watch } from 'vue'
import { Plus, X } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: string[]
  max?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const images = ref<string[]>([...props.modelValue])
const inputRef = ref<HTMLInputElement | null>(null)
const maxImages = props.max || 9

watch(
  () => props.modelValue,
  (newVal) => {
    images.value = [...newVal]
  }
)

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files || files.length === 0) return

  const remainingSlots = maxImages - images.value.length
  const filesToProcess = Array.from(files).slice(0, remainingSlots)

  filesToProcess.forEach((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      images.value.push(result)
      emit('update:modelValue', [...images.value])
    }
    reader.readAsDataURL(file)
  })

  if (inputRef.value) {
    inputRef.value.value = ''
  }
}

function removeImage(index: number) {
  images.value.splice(index, 1)
  emit('update:modelValue', [...images.value])
}

function triggerUpload() {
  if (images.value.length < maxImages && inputRef.value) {
    inputRef.value.click()
  }
}
</script>

<template>
  <div class="grid grid-cols-3 gap-3">
    <div
      v-for="(image, index) in images"
      :key="index"
      class="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
    >
      <img
        :src="image"
        :alt="`上传图片 ${index + 1}`"
        class="w-full h-full object-cover"
      />
      <button
        class="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100"
        @click="removeImage(index)"
      >
        <X :size="14" />
      </button>
    </div>

    <button
      v-if="images.length < maxImages"
      class="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-400 transition-colors hover:border-primary hover:text-primary"
      @click="triggerUpload"
    >
      <Plus :size="28" />
      <span class="text-xs">{{ images.length }} / {{ maxImages }}</span>
    </button>

    <input
      ref="inputRef"
      type="file"
      accept="image/*"
      multiple
      class="hidden"
      @change="handleFileChange"
    />
  </div>
</template>
