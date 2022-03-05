import { createWebHistory, createRouter } from 'vue-router'
import Register from '/src/views/Register.vue'
import Login from '/src/views/Login.vue'
import Admin from '/src/views/Admin.vue'
import { isLoggedIn } from '../api'
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
router.beforeEach(async (to: RouteLocationNormalized) => {
  // check login status
  let loggedIn = false

  try {
    const data = await isLoggedIn() as ResponseData
    if (data.code === 200) {
      loggedIn = true
    }
  } catch (err) {
    console.error(err)
  }


  if (to.path === '/login' || to.path === '/register') {
    if (loggedIn) {
      // redirect to '/admin' if logged in
      return '/admin'
    } else {
      return true
    }
  }

  // redirect to '/login' if not logged in
  if (!loggedIn) {
    return '/login'
  }

  // logged in
  if (getAllRoutePaths(routes).includes(to.path)) {
    return true
  }

  return '/admin'
})

export default router
