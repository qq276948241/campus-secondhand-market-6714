<script setup lang="ts">
import { ref } from 'vue';
import { Plus, X, Image as ImageIcon } from 'lucide-vue-next';

const props = defineProps<{
  maxCount?: number;
}>();

const emit = defineEmits<{
  (e: 'change', images: string[]): void;
}>();

const images = ref<string[]>([]);
const fileInputRef = ref<HTMLInputElement | null>(null);

const maxCount = props.maxCount || 9;

const handleUploadClick = () => {
  if (images.value.length >= maxCount) return;
  fileInputRef.value?.click();
};

const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const files = input.files;
  if (!files) return;

  const remainingSlots = maxCount - images.value.length;
  const filesToProcess = Array.from(files).slice(0, remainingSlots);

  filesToProcess.forEach(file => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      images.value.push(result);
      emit('change', images.value);
    };
    reader.readAsDataURL(file);
  });

  input.value = '';
};

const removeImage = (index: number) => {
  images.value.splice(index, 1);
  emit('change', images.value);
};
</script>

<template>
  <div class="image-upload">
    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
      <div
        v-for="(img, index) in images"
        :key="index"
        class="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
      >
        <img :src="img" alt="" class="w-full h-full object-cover" />
        <button
          @click.stop="removeImage(index)"
          class="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <button
        v-if="images.length < maxCount"
        @click="handleUploadClick"
        class="aspect-square flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 hover:border-primary-400 hover:bg-primary-50 transition-all"
      >
        <Plus class="w-8 h-8 text-gray-400" />
        <span class="text-xs text-gray-400 mt-1">添加图片</span>
      </button>
    </div>

    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      multiple
      class="hidden"
      @change="handleFileChange"
    />

    <p class="text-xs text-gray-400 mt-3">
      最多可上传 {{ maxCount }} 张图片，建议尺寸 800x800 以上
    </p>
  </div>
</template>
