import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import ProductDetail from '@/pages/ProductDetail.vue'
import Publish from '@/pages/Publish.vue'
import Profile from '@/pages/Profile.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/product/:id',
    name: 'product-detail',
    component: ProductDetail,
  },
  {
    path: '/publish',
    name: 'publish',
    component: Publish,
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
