export type ProductCategory = '全部' | '数码电子' | '图书教材' | '生活用品' | '服饰鞋包' | '美妆护肤' | '运动户外' | '其他'

export interface Product {
  id: string
  title: string
  description: string
  price: number
  category: ProductCategory
  images: string[]
  sellerId: string
  sellerName: string
  sellerAvatar: string
  contact: string
  createdAt: string
}

export interface User {
  id: string
  name: string
  avatar: string
  contact: string
}

export interface Favorite {
  id: string
  productId: string
  userId: string
  createdAt: string
}

export const CATEGORIES: ProductCategory[] = [
  '全部',
  '数码电子',
  '图书教材',
  '生活用品',
  '服饰鞋包',
  '美妆护肤',
  '运动户外',
  '其他',
]
