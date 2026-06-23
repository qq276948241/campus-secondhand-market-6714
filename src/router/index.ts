import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import ProductDetailPage from '@/pages/ProductDetailPage.vue'
import PublishPage from '@/pages/PublishPage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/product/:id',
    name: 'product',
    component: ProductDetailPage,
  },
  {
    path: '/publish',
    name: 'publish',
    component: PublishPage,
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
