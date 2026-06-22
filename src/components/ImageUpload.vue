<template>
  <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
    <div
      v-for="(img, index) in modelValue"
      :key="index"
      class="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
    >
      <img :src="img" alt="" class="w-full h-full object-cover" />
      <button
        type="button"
        @click="removeImage(index)"
        class="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X class="w-4 h-4" />
      </button>
    </div>
    <label
      v-if="modelValue.length < maxCount"
      class="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors"
    >
      <Plus class="w-6 h-6 text-gray-400" />
      <span class="text-xs text-gray-500">上传图片</span>
      <input
        type="file"
        accept="image/*"
        multiple
        class="hidden"
        @change="handleFileChange"
      />
    </label>
  </div>
</template>

<script setup lang="ts">
import { Plus, X } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  modelValue: string[]
  maxCount?: number
}>(), {
  maxCount: 9
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const files = input.files
  if (!files) return

  const remaining = props.maxCount - props.modelValue.length
  const filesToProcess = Array.from(files).slice(0, remaining)

  filesToProcess.forEach(file => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      const newValue = [...props.modelValue, result]
      emit('update:modelValue', newValue)
    }
    reader.readAsDataURL(file)
  })

  input.value = ''
}

function removeImage(index: number) {
  const newValue = props.modelValue.filter((_, i) => i !== index)
  emit('update:modelValue', newValue)
}
</script>
