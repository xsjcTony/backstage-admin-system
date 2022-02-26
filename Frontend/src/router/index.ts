import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router'
import Register from '/src/views/Register.vue'


const routes: RouteRecordRaw[] = [
  {
    path: '/register',
    name: 'Register',
    component: Register
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
