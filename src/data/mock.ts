import type { Product, User } from '@/types';

export const currentUser: User = {
  id: 'user-001',
  name: '小明同学',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaoming',
  phone: '138****8888',
  wechat: 'xiaoming_wx',
};

const generateProducts = (): Product[] => {
  const sellers = [
    { id: 'seller-1', name: '李同学', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=li', phone: '139****1111', wechat: 'li_wx123' },
    { id: 'seller-2', name: '王同学', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang', phone: '138****2222', wechat: 'wang_wx456' },
    { id: 'seller-3', name: '张同学', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhang', phone: '137****3333', wechat: 'zhang_wx789' },
    { id: 'seller-4', name: '刘学姐', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liu', phone: '136****4444', wechat: 'liu_wx000' },
    { id: 'seller-5', name: '陈学长', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chen', phone: '135****5555', wechat: 'chen_wx111' },
  ];

  const productData = [
    { title: 'iPad Pro 2022 11寸 256G', desc: '9成新，带笔和键盘，毕业出，配件齐全，盒子都在', price: 4500, originalPrice: 6999, category: 'digital', categoryId: 'digital', images: ['https://picsum.photos/seed/ipad1/600/600', 'https://picsum.photos/seed/ipad2/600/600'], condition: '9成新' },
    { title: '高等数学同济第七版 上下册', desc: '教材+习题全解，有笔记但不影响使用', price: 35, originalPrice: 78, category: 'books', categoryId: 'books', images: ['https://picsum.photos/seed/math1/600/600'], condition: '8成新' },
    { title: 'Nike Air Force 1 白鞋', desc: '42码，穿了几次，鞋底几乎没磨损', price: 380, originalPrice: 799, category: 'clothing', categoryId: 'clothing', images: ['https://picsum.photos/seed/nike1/600/600', 'https://picsum.photos/seed/nike2/600/600'], condition: '9成新' },
    { title: '小米台灯Pro', desc: '护眼台灯，三档调光，宿舍必备', price: 80, originalPrice: 169, category: 'life', categoryId: 'life', images: ['https://picsum.photos/seed/lamp1/600/600'], condition: '全新' },
    { title: '迪卡侬山地自行车', desc: 'M号，蓝色，骑了半年，变速正常', price: 550, originalPrice: 1299, category: 'sports', categoryId: 'sports', images: ['https://picsum.photos/seed/bike1/600/600', 'https://picsum.photos/seed/bike2/600/600'], condition: '8成新' },
    { title: '三只松鼠坚果大礼包', desc: '买多了吃不完，全新未拆封，保质期到年底', price: 45, originalPrice: 89, category: 'food', categoryId: 'food', images: ['https://picsum.photos/seed/snack1/600/600'], condition: '全新' },
    { title: 'MacBook Air M1 8+256G', desc: '2020款，银灰色，无磕碰，电池循环90次', price: 5200, originalPrice: 7999, category: 'digital', categoryId: 'digital', images: ['https://picsum.photos/seed/mac1/600/600', 'https://picsum.photos/seed/mac2/600/600', 'https://picsum.photos/seed/mac3/600/600'], condition: '95新' },
    { title: '大学英语四级真题+词汇', desc: '真题做了几套，词汇书几乎全新', price: 25, originalPrice: 59, category: 'books', categoryId: 'books', images: ['https://picsum.photos/seed/english1/600/600'], condition: '7成新' },
    { title: '优衣库羽绒服 男M码', desc: '黑色轻薄款，去年冬天买的，洗过一次', price: 200, originalPrice: 499, category: 'clothing', categoryId: 'clothing', images: ['https://picsum.photos/seed/jacket1/600/600'], condition: '9成新' },
    { title: '宿舍小风扇 可充电', desc: 'USB充电，三档风速，静音设计', price: 30, originalPrice: 69, category: 'life', categoryId: 'life', images: ['https://picsum.photos/seed/fan1/600/600'], condition: '全新' },
    { title: '篮球 斯伯丁正品', desc: '室内室外都能用，打了几次', price: 120, originalPrice: 299, category: 'sports', categoryId: 'sports', images: ['https://picsum.photos/seed/basketball1/600/600'], condition: '9成新' },
    { title: '罗技无线鼠标 M590', desc: '蓝牙+USB双模，静音按键，送电池', price: 90, originalPrice: 199, category: 'digital', categoryId: 'digital', images: ['https://picsum.photos/seed/mouse1/600/600'], condition: '95新' },
    { title: '考研政治全套资料', desc: '肖秀荣+徐涛，书+习题+背诵手册', price: 60, originalPrice: 200, category: 'books', categoryId: 'books', images: ['https://picsum.photos/seed/kaoyan1/600/600', 'https://picsum.photos/seed/kaoyan2/600/600'], condition: '8成新' },
    { title: '宜家落地灯', desc: '简约现代风格，暖光护眼，搬家出', price: 65, originalPrice: 149, category: 'life', categoryId: 'life', images: ['https://picsum.photos/seed/floorlamp1/600/600'], condition: '9成新' },
    { title: '滑板 双翘板', desc: '初学者入门板，送护具和背包', price: 150, originalPrice: 350, category: 'sports', categoryId: 'sports', images: ['https://picsum.photos/seed/skateboard1/600/600'], condition: '8成新' },
  ];

  return productData.map((p, index) => ({
    id: `product-${String(index + 1).padStart(3, '0')}`,
    title: p.title,
    description: p.desc,
    price: p.price,
    originalPrice: p.originalPrice,
    category: p.category,
    categoryId: p.categoryId,
    images: p.images,
    seller: sellers[index % sellers.length],
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    views: Math.floor(Math.random() * 500) + 10,
    condition: p.condition,
    location: ['东校区', '西校区', '南校区', '北校区'][index % 4],
  }));
};

export const mockProducts: Product[] = generateProducts();
