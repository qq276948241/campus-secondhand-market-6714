import { ref, computed } from 'vue'
import { products as mockProducts, categories, users } from '@/mock/data'
import type { Product, Category, User } from '@/types'

const allProducts = ref<Product[]>([...mockProducts])

export function useProducts() {
  const products = computed(() => allProducts.value)

  function getProductById(id: number): Product | undefined {
    return allProducts.value.find((p) => p.id === id)
  }

  function getProductsByCategory(categoryId: number): Product[] {
    if (categoryId === 0) return allProducts.value
    return allProducts.value.filter((p) => p.categoryId === categoryId)
  }

  function searchProducts(keyword: string, categoryId: number = 0, includeSold: boolean = false): Product[] {
    let result = categoryId === 0
      ? allProducts.value
      : allProducts.value.filter((p) => p.categoryId === categoryId)
    if (!includeSold) {
      result = result.filter((p) => !p.isSold)
    }
    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(kw) ||
          p.description.toLowerCase().includes(kw),
      )
    }
    return result
  }

  function getProductsBySeller(sellerId: number): Product[] {
    return allProducts.value.filter((p) => p.sellerId === sellerId)
  }

  function addProduct(product: Omit<Product, 'id' | 'createdAt' | 'isSold'>): Product {
    const newProduct: Product = {
      ...product,
      id: Math.max(0, ...allProducts.value.map((p) => p.id)) + 1,
      createdAt: new Date().toISOString(),
      isSold: false,
    }
    allProducts.value.unshift(newProduct)
    return newProduct
  }

  function deleteProduct(id: number) {
    const idx = allProducts.value.findIndex((p) => p.id === id)
    if (idx !== -1) allProducts.value.splice(idx, 1)
  }

  function toggleSoldStatus(id: number) {
    const product = allProducts.value.find((p) => p.id === id)
    if (product) product.isSold = !product.isSold
  }

  function getCategoryById(id: number): Category | undefined {
    return categories.find((c) => c.id === id)
  }

  function getUserById(id: number): User | undefined {
    return users.find((u) => u.id === id)
  }

  return {
    products,
    getProductById,
    getProductsByCategory,
    searchProducts,
    getProductsBySeller,
    addProduct,
    deleteProduct,
    toggleSoldStatus,
    getCategoryById,
    getUserById,
    categories,
    users,
  }
}
