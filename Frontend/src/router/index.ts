import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router'
import Register from '/src/views/Register.vue'
import Login from '/src/views/Login.vue'


const routes: RouteRecordRaw[] = [
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
