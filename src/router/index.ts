import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import ProductDetail from '@/pages/ProductDetail.vue'
import Publish from '@/pages/Publish.vue'
import Profile from '@/pages/Profile.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail
  },
  {
    path: '/publish',
    name: 'Publish',
    component: Publish
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
