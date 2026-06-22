export interface Seller {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  wechat: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  categoryId: string;
  images: string[];
  seller: Seller;
  createdAt: string;
  views: number;
  condition?: string;
  location?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  wechat: string;
}
