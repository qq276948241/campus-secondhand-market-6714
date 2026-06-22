import type { Product } from '@/types'

const MY_PRODUCTS_KEY = 'my_products'
const MY_FAVORITES_KEY = 'my_favorites'

export function getMyProducts(): Product[] {
  try {
    const data = localStorage.getItem(MY_PRODUCTS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveMyProducts(products: Product[]): void {
  localStorage.setItem(MY_PRODUCTS_KEY, JSON.stringify(products))
}

export function addMyProduct(product: Product): void {
  const products = getMyProducts()
  products.unshift(product)
  saveMyProducts(products)
}

export function removeMyProduct(productId: string): void {
  const products = getMyProducts()
  const filtered = products.filter(p => p.id !== productId)
  saveMyProducts(filtered)
}

export function getMyFavorites(): string[] {
  try {
    const data = localStorage.getItem(MY_FAVORITES_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveMyFavorites(favorites: string[]): void {
  localStorage.setItem(MY_FAVORITES_KEY, JSON.stringify(favorites))
}

export function addFavorite(productId: string): void {
  const favorites = getMyFavorites()
  if (!favorites.includes(productId)) {
    favorites.unshift(productId)
    saveMyFavorites(favorites)
  }
}

export function removeFavorite(productId: string): void {
  const favorites = getMyFavorites()
  const filtered = favorites.filter(id => id !== productId)
  saveMyFavorites(filtered)
}

export function isFavorite(productId: string): boolean {
  const favorites = getMyFavorites()
  return favorites.includes(productId)
}
