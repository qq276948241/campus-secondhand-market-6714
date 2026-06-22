import type { Product, Category, User } from '@/types'

export const currentUser: User = {
  id: 'user_001',
  name: '小明同学',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
  phone: '138****8888',
  wechat: 'xiaoming_2024'
}

export const categories: Category[] = [
  { id: 'all', name: '全部', icon: 'LayoutGrid' },
  { id: 'digital', name: '数码', icon: 'Laptop' },
  { id: 'books', name: '书籍', icon: 'BookOpen' },
  { id: 'clothing', name: '服饰', icon: 'Shirt' },
  { id: 'life', name: '生活', icon: 'Home' },
  { id: 'sports', name: '运动', icon: 'Dumbbell' },
  { id: 'others', name: '其他', icon: 'MoreHorizontal' }
]

export const mockProducts: Product[] = [
  {
    id: 'p001',
    title: '九成新 MacBook Pro 13寸 2020款',
    description: '自用MacBook Pro 13寸，2020款，M1芯片，8G+256G，外观完好无磕碰，电池循环120次左右，带原装充电器。因换新机出，适合学生党编程学习、日常办公使用。',
    price: 5200,
    category: 'digital',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop'
    ],
    seller: {
      id: 'seller_001',
      name: '计算机学院小李',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      phone: '139****1234',
      wechat: 'lilei_cs'
    },
    createdAt: '2024-06-20 14:30',
    views: 256
  },
  {
    id: 'p002',
    title: '高等数学教材 同济第七版 上下册',
    description: '同济大学高等数学第七版，上下册全套，内有少量笔记，不影响阅读。适合大一新生预习或复习使用。',
    price: 25,
    category: 'books',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=600&fit=crop'
    ],
    seller: {
      id: 'seller_002',
      name: '数学系小王',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      phone: '138****5678',
      wechat: 'wang_math'
    },
    createdAt: '2024-06-21 09:15',
    views: 89
  },
  {
    id: 'p003',
    title: 'Nike Air Force 1 纯白 42码',
    description: 'Nike空军一号纯白款，42码，穿过几次，鞋底磨损很小，鞋盒还在。因为买大了半码所以出，低价转让。',
    price: 380,
    category: 'clothing',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&h=600&fit=crop'
    ],
    seller: {
      id: 'seller_003',
      name: '体院小张',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
      phone: '137****9012',
      wechat: 'zhang_sport'
    },
    createdAt: '2024-06-21 16:45',
    views: 178
  },
  {
    id: 'p004',
    title: '小米智能台灯 Pro',
    description: '小米台灯Pro，可调节亮度色温，护眼模式，用了一年多，功能正常，外观9成新。毕业了带不走，便宜出。',
    price: 80,
    category: 'life',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=600&fit=crop'
    ],
    seller: {
      id: 'seller_004',
      name: '大四学姐',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
      phone: '136****3456',
      wechat: 'jie_graduate'
    },
    createdAt: '2024-06-22 10:20',
    views: 67
  },
  {
    id: 'p005',
    title: '迪卡侬 山地自行车 26寸',
    description: '迪卡侬入门山地车，26寸，变速顺畅，刹车灵敏，适合日常通勤和校园骑行。附送车锁和水壶架。',
    price: 450,
    category: 'sports',
    images: [
      'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=600&fit=crop'
    ],
    seller: {
      id: 'seller_005',
      name: '骑行爱好者',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
      phone: '135****7890',
      wechat: 'bike_lover'
    },
    createdAt: '2024-06-22 15:00',
    views: 134
  },
  {
    id: 'p006',
    title: 'iPhone 12 128G 蓝色',
    description: 'iPhone 12 蓝色 128G，国行，电池健康87%，屏幕无划痕，外观轻微使用痕迹，配原装数据线。',
    price: 2800,
    category: 'digital',
    images: [
      'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop'
    ],
    seller: {
      id: 'seller_006',
      name: '换手机的小陈',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
      phone: '134****2345',
      wechat: 'chen_iphone'
    },
    createdAt: '2024-06-23 08:30',
    views: 312
  },
  {
    id: 'p007',
    title: '四六级英语真题集 2024版',
    description: '新东方四六级真题全套，2024最新版，部分做过，答案解析齐全，还有词汇书附赠。',
    price: 35,
    category: 'books',
    images: [
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop'
    ],
    seller: {
      id: 'seller_007',
      name: '过六级的小刘',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
      phone: '133****6789',
      wechat: 'liu_cet6'
    },
    createdAt: '2024-06-23 11:10',
    views: 45
  },
  {
    id: 'p008',
    title: '优衣库羽绒服 男款M码',
    description: '优衣库轻薄羽绒服，男款M码，黑色，充绒量90%，非常保暖，穿过一冬天，洗净存放。',
    price: 200,
    category: 'clothing',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&h=600&fit=crop'
    ],
    seller: {
      id: 'seller_008',
      name: '毕业季小周',
      avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&h=200&fit=crop',
      phone: '132****0123',
      wechat: 'zhou_uniqlo'
    },
    createdAt: '2024-06-23 14:20',
    views: 92
  }
]
