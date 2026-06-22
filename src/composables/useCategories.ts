import { ref, computed } from 'vue';
import type { Category } from '@/types';
import {
  Grid3X3,
  Smartphone,
  BookOpen,
  Shirt,
  Home,
  Dumbbell,
  Cookie,
  MoreHorizontal,
} from 'lucide-vue-next';

const allCategoriesData: Category[] = [
  { id: 'all', name: '全部', icon: 'grid' },
  { id: 'digital', name: '数码电子', icon: 'smartphone' },
  { id: 'books', name: '图书教材', icon: 'book-open' },
  { id: 'clothing', name: '服饰鞋包', icon: 'shirt' },
  { id: 'life', name: '生活用品', icon: 'home' },
  { id: 'sports', name: '运动户外', icon: 'dumbbell' },
  { id: 'food', name: '食品零食', icon: 'cookie' },
  { id: 'other', name: '其他', icon: 'more-horizontal' },
];

const iconMap: Record<string, any> = {
  'grid': Grid3X3,
  'smartphone': Smartphone,
  'book-open': BookOpen,
  'shirt': Shirt,
  'home': Home,
  'dumbbell': Dumbbell,
  'cookie': Cookie,
  'more-horizontal': MoreHorizontal,
};

export function useCategories() {
  const activeCategoryId = ref('all');

  const allCategories = computed(() => allCategoriesData);

  const selectableCategories = computed(() =>
    allCategoriesData.filter(c => c.id !== 'all')
  );

  const activeCategory = computed(() =>
    allCategoriesData.find(c => c.id === activeCategoryId.value)
  );

  const getCategoryById = (id: string) =>
    allCategoriesData.find(c => c.id === id);

  const getCategoryIcon = (iconName: string) =>
    iconMap[iconName] || Grid3X3;

  const setActiveCategory = (id: string) => {
    activeCategoryId.value = id;
  };

  return {
    allCategories,
    selectableCategories,
    activeCategoryId,
    activeCategory,
    iconMap,
    getCategoryById,
    getCategoryIcon,
    setActiveCategory,
  };
}
