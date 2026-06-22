import type { Product } from '@/types';

const MY_PRODUCTS_KEY = 'campus_market_my_products';
const MY_FAVORITES_KEY = 'campus_market_my_favorites';

export function getMyProducts(): Product[] {
  try {
    const data = localStorage.getItem(MY_PRODUCTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveMyProducts(products: Product[]): void {
  localStorage.setItem(MY_PRODUCTS_KEY, JSON.stringify(products));
}

export function addMyProduct(product: Product): void {
  const products = getMyProducts();
  products.unshift(product);
  saveMyProducts(products);
}

export function removeMyProduct(productId: string): void {
  const products = getMyProducts();
  const filtered = products.filter(p => p.id !== productId);
  saveMyProducts(filtered);
}

export function getMyFavorites(): string[] {
  try {
    const data = localStorage.getItem(MY_FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveMyFavorites(ids: string[]): void {
  localStorage.setItem(MY_FAVORITES_KEY, JSON.stringify(ids));
}

export function toggleFavorite(productId: string): boolean {
  const favorites = getMyFavorites();
  const index = favorites.indexOf(productId);
  if (index > -1) {
    favorites.splice(index, 1);
    saveMyFavorites(favorites);
    return false;
  } else {
    favorites.unshift(productId);
    saveMyFavorites(favorites);
    return true;
  }
}

export function isFavorite(productId: string): boolean {
  return getMyFavorites().includes(productId);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

export function formatPrice(price: number): string {
  return `¥${price.toFixed(2)}`;
}

export function generateId(): string {
  return `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
