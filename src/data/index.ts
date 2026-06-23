export interface Product {
  id: number
  title: string
  description: string
  price: number
  originalPrice?: number
  category: string
  images: string[]
  seller: {
    name: string
    avatar: string
    phone: string
    wechat?: string
    college: string
  }
  createdAt: string
  views: number
  collected: boolean
}

export interface Category {
  id: string
  name: string
  icon: string
}

export const categories: Category[] = [
  { id: 'all', name: '全部', icon: '🏠' },
  { id: 'digital', name: '数码电子', icon: '📱' },
  { id: 'book', name: '教材书籍', icon: '📚' },
  { id: 'daily', name: '生活用品', icon: '🧴' },
  { id: 'clothes', name: '服饰鞋包', icon: '👕' },
  { id: 'sports', name: '运动户外', icon: '⚽' },
  { id: 'food', name: '零食饮料', icon: '🍜' },
  { id: 'other', name: '其他', icon: '📦' }
]

const img = (seed: string) =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(seed)}&image_size=square`

export const mockProducts: Product[] = [
  {
    id: 1,
    title: '九成新iPad Air 5 64G WIFI版',
    description: '2023年购入，平时用来记笔记看视频，屏幕无划痕，电池健康度95%，带原装充电器和保护壳。因换Pro出掉，可小刀，同城面交优先。',
    price: 2899,
    originalPrice: 4799,
    category: 'digital',
    images: [
      img('iPad Air 5 tablet on white desk'),
      img('iPad back view silver color'),
      img('iPad with apple pencil')
    ],
    seller: { name: '小林同学', avatar: '🧑‍💻', phone: '138****8888', wechat: 'xiaolin_2024', college: '计算机学院' },
    createdAt: '2024-06-20',
    views: 328,
    collected: false
  },
  {
    id: 2,
    title: '高等数学同济第七版上下册 习题全解',
    description: '大一用过的高数教材，笔记不多，整体很新，附带习题全解指南。考研或者期末复习都合适，打包出售不散卖。',
    price: 35,
    originalPrice: 98,
    category: 'book',
    images: [
      img('advanced mathematics textbook chinese university'),
      img('textbook exercises solution guide')
    ],
    seller: { name: '学霸张', avatar: '👩‍🎓', phone: '139****6666', college: '数学学院' },
    createdAt: '2024-06-19',
    views: 156,
    collected: true
  },
  {
    id: 3,
    title: '小米电动滑板车1S 续航30km',
    description: '去年双十一买的，通勤用了半年，现在买了电动车不用了。轮胎新换的，刹车正常，APP可连，送车锁和打气筒。',
    price: 899,
    originalPrice: 1999,
    category: 'sports',
    images: [
      img('xiaomi electric scooter white color'),
      img('electric scooter dashboard close up'),
      img('scooter side view campus road')
    ],
    seller: { name: '追风少年', avatar: '🛴', phone: '137****2222', wechat: 'zhuifeng99', college: '机械工程学院' },
    createdAt: '2024-06-18',
    views: 512,
    collected: false
  },
  {
    id: 4,
    title: '宜家实木书桌 120x60cm 白橡木色',
    description: '毕业出宜家书桌，买来用了一年，没有磕碰损坏，桌面很宽敞放显示器完全没问题。需自提，在东区宿舍5号楼。',
    price: 180,
    originalPrice: 399,
    category: 'daily',
    images: [
      img('ikea wooden desk white oak color'),
      img('desk with monitor setup')
    ],
    seller: { name: '毕业季小王', avatar: '🎓', phone: '136****4444', college: '经管学院' },
    createdAt: '2024-06-17',
    views: 89,
    collected: false
  },
  {
    id: 5,
    title: '优衣库U系列卫衣 黑色L码',
    description: '去年冬天买的，穿了两次不太适合自己，版型很正，面料厚实不起球。L码适合175-180身高，原价299现低价出。',
    price: 99,
    originalPrice: 299,
    category: 'clothes',
    images: [
      img('uniqlo black hoodie minimalist'),
      img('hoodie on hanger detail view')
    ],
    seller: { name: '穿搭博主', avatar: '👔', phone: '135****7777', wechat: '穿搭博主', college: '设计学院' },
    createdAt: '2024-06-16',
    views: 201,
    collected: true
  },
  {
    id: 6,
    title: '索尼WH-1000XM4 无线降噪头戴耳机',
    description: '旗舰级降噪耳机，音质没得说，降噪效果一流，坐飞机高铁必备。配件齐全盒子都在，耳罩有一点点使用痕迹不影响。',
    price: 1399,
    originalPrice: 2499,
    category: 'digital',
    images: [
      img('sony wh1000xm4 headphones black'),
      img('headphones carrying case and cables'),
      img('headphones wearing front view')
    ],
    seller: { name: '音乐发烧友', avatar: '🎧', phone: '134****3333', college: '音乐学院' },
    createdAt: '2024-06-15',
    views: 445,
    collected: false
  },
  {
    id: 7,
    title: '三只松鼠零食大礼包 未拆封',
    description: '室友送的太多吃不完，全新未拆封，保质期还有6个月，内含坚果肉铺果干等十几样，比超市便宜一半。',
    price: 59,
    originalPrice: 128,
    category: 'food',
    images: [
      img('three squirrels snack gift box chinese'),
      img('snack box opened variety nuts')
    ],
    seller: { name: '小馋猫', avatar: '😋', phone: '133****1111', college: '外国语学院' },
    createdAt: '2024-06-14',
    views: 76,
    collected: false
  },
  {
    id: 8,
    title: '罗技MX Master 3S无线鼠标 黑色',
    description: '办公神器，滚轮超级好用，手感一流，用了半年多，功能一切正常，接收器数据线都在。',
    price: 459,
    originalPrice: 699,
    category: 'digital',
    images: [
      img('logitech mx master 3s mouse black'),
      img('mouse side buttons close up')
    ],
    seller: { name: '程序员小李', avatar: '💻', phone: '132****5555', wechat: 'coder_li', college: '软件学院' },
    createdAt: '2024-06-13',
    views: 188,
    collected: false
  }
]

export const myProducts = [mockProducts[0], mockProducts[3]]
export const myCollected = [mockProducts[1], mockProducts[4]]
