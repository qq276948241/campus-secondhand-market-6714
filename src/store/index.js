import { reactive, computed } from 'vue'

export const categories = [
  { id: 'all', name: '全部', icon: '🛒' },
  { id: 'book', name: '书籍教材', icon: '📚' },
  { id: 'electronics', name: '数码电子', icon: '💻' },
  { id: 'dormitory', name: '宿舍用品', icon: '🛏️' },
  { id: 'clothing', name: '服饰鞋包', icon: '👕' },
  { id: 'sports', name: '运动户外', icon: '⚽' },
  { id: 'food', name: '零食饮料', icon: '🍜' },
  { id: 'other', name: '其他闲置', icon: '📦' }
]

const generateProducts = () => {
  const productTemplates = [
    {
      id: 1,
      title: '高等数学第七版同济大学',
      category: 'book',
      price: 15,
      originalPrice: 45,
      images: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600'
      ],
      description: '九成新，基本没怎么用过，笔记很少，适合考研复习用。可以送到宿舍楼下。',
      seller: {
        name: '数学小天才',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
        phone: '138****1234',
        wechat: 'math_lover',
        college: '数学与统计学院',
        grade: '大三'
      },
      location: '东校区12号楼',
      viewCount: 156,
      publishTime: Date.now() - 3600000 * 2
    },
    {
      id: 2,
      title: 'iPad Air 4代 64G WiFi版',
      category: 'electronics',
      price: 2800,
      originalPrice: 4799,
      images: [
        'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600',
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600'
      ],
      description: '2020年购入，平时爱惜使用，无磕碰无划痕，屏幕完好。送充电器和保护壳，适合记笔记看网课。',
      seller: {
        name: '数码控小王',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
        phone: '139****5678',
        wechat: 'tech_wang',
        college: '计算机学院',
        grade: '大四'
      },
      location: '西校区5号楼',
      viewCount: 342,
      publishTime: Date.now() - 3600000 * 5
    },
    {
      id: 3,
      title: '床上书桌懒人桌可折叠',
      category: 'dormitory',
      price: 25,
      originalPrice: 69,
      images: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'
      ],
      description: '买了没用几次，一直放着占地方。稳固不晃，带抽屉可以放笔和本子，承重很不错。',
      seller: {
        name: '收纳达人',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
        phone: '137****9012',
        wechat: 'dorm_organize',
        college: '管理学院',
        grade: '大二'
      },
      location: '南校区8号楼',
      viewCount: 89,
      publishTime: Date.now() - 3600000 * 12
    },
    {
      id: 4,
      title: 'Nike Air Force 1 小白鞋 42码',
      category: 'clothing',
      price: 320,
      originalPrice: 899,
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
        'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600'
      ],
      description: '正品专柜购入，穿过两三次，鞋底轻微磨损，鞋面很新，原价899。尺码不合适转让。',
      seller: {
        name: '球鞋爱好者',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
        phone: '136****3456',
        wechat: 'sneaker_love',
        college: '体育学院',
        grade: '大三'
      },
      location: '北校区3号楼',
      viewCount: 267,
      publishTime: Date.now() - 3600000 * 24
    },
    {
      id: 5,
      title: '羽毛球拍 尤尼克斯双拍套装',
      category: 'sports',
      price: 80,
      originalPrice: 220,
      images: [
        'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600'
      ],
      description: '尤尼克斯入门款，超轻耐打，买来学了几次就没兴趣了，送3个羽毛球和拍套。',
      seller: {
        name: '运动新手',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
        phone: '135****7890',
        wechat: 'sports_begin',
        college: '文学院',
        grade: '大一'
      },
      location: '东校区9号楼',
      viewCount: 112,
      publishTime: Date.now() - 3600000 * 36
    },
    {
      id: 6,
      title: '自热小火锅5盒打包卖',
      category: 'food',
      price: 50,
      originalPrice: 89,
      images: [
        'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600'
      ],
      description: '宿舍囤货太多了，麻辣嫩牛味和脆爽牛肚味，保质期还有半年，东区自取。',
      seller: {
        name: '吃货小王',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
        phone: '134****1122',
        wechat: 'foodie_wang',
        college: '食品科学学院',
        grade: '大二'
      },
      location: '东校区7号楼',
      viewCount: 201,
      publishTime: Date.now() - 3600000 * 48
    },
    {
      id: 7,
      title: '考研英语真题黄皮书全套',
      category: 'book',
      price: 45,
      originalPrice: 128,
      images: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600'
      ],
      description: '2024考研黄皮书英语一，全套都有，部分答案有笔记，不影响使用。学姐考研上岸成功。',
      seller: {
        name: '上岸学姐',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7',
        phone: '133****3344',
        wechat: 'kaoyan_jiejie',
        college: '外国语学院',
        grade: '大四'
      },
      location: '西校区2号楼',
      viewCount: 445,
      publishTime: Date.now() - 3600000 * 60
    },
    {
      id: 8,
      title: '小米台灯Pro 护眼LED灯',
      category: 'dormitory',
      price: 99,
      originalPrice: 199,
      images: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
        'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600'
      ],
      description: '小米护眼台灯，三档亮度可调，光线柔和不刺眼，考研党必备。搬家带不走便宜出。',
      seller: {
        name: '毕业出清',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8',
        phone: '132****5566',
        wechat: 'grad_sale',
        college: '化工学院',
        grade: '大四'
      },
      location: '南校区1号楼',
      viewCount: 178,
      publishTime: Date.now() - 3600000 * 72
    },
    {
      id: 9,
      title: '罗技G304无线游戏鼠标',
      category: 'electronics',
      price: 150,
      originalPrice: 299,
      images: [
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600'
      ],
      description: '罗技经典无线鼠标，续航超长，电竞级响应速度，送全新电池一颗，使用不超过半年。',
      seller: {
        name: '游戏少年',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=9',
        phone: '131****7788',
        wechat: 'gamer_boy',
        college: '软件学院',
        grade: '大三'
      },
      location: '西校区11号楼',
      viewCount: 234,
      publishTime: Date.now() - 3600000 * 84
    }
  ]
  return productTemplates
}

const state = reactive({
  products: generateProducts(),
  favorites: [2, 7],
  myPublished: [1, 4],
  searchKeyword: '',
  selectedCategory: 'all',
  currentUser: {
    name: '我是同学',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me',
    college: '信息工程学院',
    grade: '大三'
  }
})

export const useStore = () => {
  const filteredProducts = computed(() => {
    let list = [...state.products]
    
    if (state.selectedCategory !== 'all') {
      list = list.filter(p => p.category === state.selectedCategory)
    }
    
    if (state.searchKeyword.trim()) {
      const kw = state.searchKeyword.trim().toLowerCase()
      list = list.filter(p => 
        p.title.toLowerCase().includes(kw) || 
        p.description.toLowerCase().includes(kw)
      )
    }
    
    return list.sort((a, b) => b.publishTime - a.publishTime)
  })

  const favoriteProducts = computed(() => {
    return state.products.filter(p => state.favorites.includes(p.id))
  })

  const myPublishedProducts = computed(() => {
    return state.products.filter(p => state.myPublished.includes(p.id))
  })

  const getProductById = (id) => {
    return state.products.find(p => p.id === Number(id))
  }

  const isFavorite = (id) => {
    return state.favorites.includes(Number(id))
  }

  const toggleFavorite = (id) => {
    const numId = Number(id)
    const idx = state.favorites.indexOf(numId)
    if (idx > -1) {
      state.favorites.splice(idx, 1)
    } else {
      state.favorites.push(numId)
    }
  }

  const getFavoriteProducts = () => {
    return favoriteProducts.value
  }

  const getMyPublished = () => {
    return myPublishedProducts.value
  }

  const addProduct = (product) => {
    const newId = Math.max(...state.products.map(p => p.id)) + 1
    const newProduct = {
      id: newId,
      ...product,
      seller: {
        name: state.currentUser.name,
        avatar: state.currentUser.avatar,
        phone: '138****0000',
        wechat: 'my_wechat',
        college: state.currentUser.college,
        grade: state.currentUser.grade
      },
      viewCount: 0,
      publishTime: Date.now()
    }
    state.products.unshift(newProduct)
    state.myPublished.unshift(newId)
    return newId
  }

  const incrementView = (id) => {
    const product = state.products.find(p => p.id === Number(id))
    if (product) product.viewCount++
  }

  const setSearchKeyword = (kw) => {
    state.searchKeyword = kw
  }

  const setCategory = (cat) => {
    state.selectedCategory = cat
  }

  const deleteMyProduct = (id) => {
    const idx = state.products.findIndex(p => p.id === Number(id))
    if (idx > -1) state.products.splice(idx, 1)
    const myIdx = state.myPublished.indexOf(Number(id))
    if (myIdx > -1) state.myPublished.splice(myIdx, 1)
  }

  return {
    state,
    filteredProducts,
    favoriteProducts,
    myPublishedProducts,
    getProductById,
    isFavorite,
    toggleFavorite,
    getFavoriteProducts,
    getMyPublished,
    addProduct,
    incrementView,
    setSearchKeyword,
    setCategory,
    deleteMyProduct
  }
}
