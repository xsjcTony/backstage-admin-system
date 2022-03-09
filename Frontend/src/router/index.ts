import Cookies from 'js-cookie'
import { createWebHistory, createRouter } from 'vue-router'
import Permissions from '/src/components/Admin/Permissions.vue'
import Roles from '/src/components/Admin/Roles.vue'
import Users from '/src/components/Admin/Users.vue'
import Welcome from '/src/components/Admin/Welcome.vue'
import Admin from '/src/views/Admin.vue'
import Login from '/src/views/Login.vue'
import Register from '/src/views/Register.vue'
import { isLoggedIn } from '../api'
import { useStore } from '../stores'
import { getAllRoutePaths } from '../utils'
import type { ResponseData } from '../types'
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
    name: 'Admin',
    component: Admin,
    redirect: '/admin/welcome',
    children: [
      {
        path: 'welcome',
        name: 'Admin -> Welcome',
        component: Welcome
      },
      {
        path: 'users',
        name: 'Admin -> Users',
        component: Users
      },
      {
        path: 'roles',
        name: 'Admin -> Roles',
        component: Roles
      },
      {
        path: 'permissions',
        name: 'Admin -> Permissions',
        component: Permissions
      }
    ]
  }
]


const router = createRouter({
  history: createWebHistory(),
  routes
})


/**
 * Access Control - Navigation Guard
 */
let authenticated = false
router.beforeEach(async (to: RouteLocationNormalized) => {
  const store = useStore()

  // OAuth cookie
  const t = Cookies.get('token')
  if (t) {
    authenticated = false
    localStorage.setItem('token', t)
    Cookies.remove('token')
  }

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
  if (getAllRoutePaths(routes, '').includes(to.path)) {
    return true
  }

  return '/admin'
})


export default router
