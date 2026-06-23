export interface Product {
  id: number
  title: string
  description: string
  price: number
  originalPrice?: number
  condition: string
  categoryId: number
  sellerId: number
  images: string[]
  createdAt: string
  isSold: boolean
}

export interface Category {
  id: number
  name: string
  icon: string
}

export interface User {
  id: number
  nickname: string
  avatar: string
  wechat: string
  qq: string
  phone: string
}

export interface Favorite {
  id: number
  userId: number
  productId: number
  createdAt: string
}

export const CONDITIONS = ['全新', '几乎全新', '轻微使用痕迹', '明显使用痕迹'] as const
export type Condition = (typeof CONDITIONS)[number]
