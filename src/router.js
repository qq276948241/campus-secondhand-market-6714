import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/Home.vue')
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    component: () => import('./views/Detail.vue')
  },
  {
    path: '/publish',
    name: 'Publish',
    component: () => import('./views/Publish.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('./views/Profile.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
