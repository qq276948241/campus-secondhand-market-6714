export interface User {
  id: string
  name: string
  avatar: string
  phone: string
  wechat: string
}

export interface Seller {
  id: string
  name: string
  avatar: string
  phone: string
  wechat: string
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  category: string
  images: string[]
  seller: Seller
  createdAt: string
  views: number
  isMyPublish?: boolean
}

export interface Category {
  id: string
  name: string
  icon: string
}
