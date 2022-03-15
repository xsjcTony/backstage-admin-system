import Cookies from 'js-cookie'
import { createWebHistory, createRouter } from 'vue-router'
import Permissions from '/src/components/Admin/Permissions.vue'
import Roles from '/src/components/Admin/Roles.vue'
import Users from '/src/components/Admin/Users.vue'
import Welcome from '/src/components/Admin/Welcome.vue'
import Admin from '/src/views/Admin.vue'
import Login from '/src/views/Login.vue'
import Register from '/src/views/Register.vue'
import { getUserById, isLoggedIn } from '../api'
import { useStore } from '../stores'
import { getAllRoutePaths } from '../utils'
import type { ResponseData, User } from '../types'
import type { RouteRecordRaw, RouteLocationNormalized } from 'vue-router'


const routes: RouteRecordRaw[] = [
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    redirect: '/admin/welcome',
    children: [
      {
        path: 'welcome',
        name: 'welcome',
        component: Welcome
      },
      {
        path: 'users',
        name: 'users',
        component: Users
      },
      {
        path: 'roles',
        name: 'roles',
        component: Roles
      },
      {
        path: 'permissions',
        name: 'permissions',
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
  const mainStore = useStore()

  // OAuth cookie
  const t = Cookies.get('token')
  if (t) {
    authenticated = false
    localStorage.setItem('token', t)
    Cookies.remove('token')
  }

  if (!authenticated) {
    try {
      const data: ResponseData = await isLoggedIn()
      mainStore.loggedIn = true

      const id = (data.data as User).id
      mainStore.currentUser = (await getUserById(id)).data.data as User
    } catch (err) {
      mainStore.loggedIn = false
    }

    authenticated = true
  }

  if (to.path === '/login' || to.path === '/register') {
    if (mainStore.loggedIn) {
      // redirect to '/admin' if logged in
      return '/admin'
    } else {
      return true
    }
  }

  // redirect to '/login' if not logged in
  if (!mainStore.loggedIn) {
    return '/login'
  }

  // logged in
  if (getAllRoutePaths(routes).includes(to.path)) {
    return true
  }

  return '/admin'
})


export default router
