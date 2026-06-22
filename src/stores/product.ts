import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Product, ProductCategory } from '@/types'
import { mockProducts } from '@/mock/products'
import { storage } from '@/utils/storage'
import { generateId } from '@/utils/format'

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>(storage.get('products', mockProducts))
  const searchKeyword = ref('')
  const selectedCategory = ref<ProductCategory>('全部')

  watch(
    products,
    (newVal) => {
      storage.set('products', newVal)
    },
    { deep: true }
  )

  const filteredProducts = ref<Product[]>([])

  function updateFilteredProducts() {
    let result = [...products.value]

    if (selectedCategory.value !== '全部') {
      result = result.filter((p) => p.category === selectedCategory.value)
    }

    if (searchKeyword.value.trim()) {
      const keyword = searchKeyword.value.toLowerCase().trim()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(keyword) ||
          p.description.toLowerCase().includes(keyword)
      )
    }

    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    filteredProducts.value = result
  }

  function setSearchKeyword(keyword: string) {
    searchKeyword.value = keyword
    updateFilteredProducts()
  }

  function setCategory(category: ProductCategory) {
    selectedCategory.value = category
    updateFilteredProducts()
  }

  function getProductById(id: string): Product | undefined {
    return products.value.find((p) => p.id === id)
  }

  function addProduct(product: Omit<Product, 'id' | 'createdAt' | 'sellerId' | 'sellerName' | 'sellerAvatar' | 'contact'> & {
    sellerId: string
    sellerName: string
    sellerAvatar: string
    contact: string
  }) {
    const newProduct: Product = {
      ...product,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    products.value.unshift(newProduct)
    updateFilteredProducts()
    return newProduct
  }

  function deleteProduct(id: string) {
    const index = products.value.findIndex((p) => p.id === id)
    if (index > -1) {
      products.value.splice(index, 1)
      updateFilteredProducts()
    }
  }

  function getProductsBySeller(sellerId: string): Product[] {
    return products.value.filter((p) => p.sellerId === sellerId)
  }

  updateFilteredProducts()

  return {
    products,
    filteredProducts,
    searchKeyword,
    selectedCategory,
    setSearchKeyword,
    setCategory,
    getProductById,
    addProduct,
    deleteProduct,
    getProductsBySeller,
    updateFilteredProducts,
  }
})
