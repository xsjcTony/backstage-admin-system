import { createWebHistory, createRouter } from 'vue-router'
import Register from '/src/views/Register.vue'
import Login from '/src/views/Login.vue'
import Admin from '/src/views/Admin.vue'
import { isLoggedIn } from '../api'
import { useStore } from '../stores'
import { ResponseData } from '../types'
import { getAllRoutePaths } from '../utils'
import type { RouteRecordRaw, RouteLocationNormalized } from 'vue-router'


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
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// access control
let authenticated = false
router.beforeEach(async (to: RouteLocationNormalized) => {
  const store = useStore()

  if (!authenticated) {
    try {
      const data = await isLoggedIn() as ResponseData
      if (data.code === 200) {
        store.loggedIn = true
      }
    } catch (err) {
      store.loggedIn = false
    }

    authenticated = true
  }

  if (to.path === '/login' || to.path === '/register') {
    if (store.loggedIn) {
      // redirect to '/admin' if logged in
      return '/admin'
    } else {
      return true
    }
  }

  // redirect to '/login' if not logged in
  if (!store.loggedIn) {
    return '/login'
  }

  // logged in
  if (getAllRoutePaths(routes).includes(to.path)) {
    return true
  }

  return '/admin'
})

export default router
