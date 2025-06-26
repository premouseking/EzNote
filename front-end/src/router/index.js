import Home from '@/components/home/Home.vue'
import Index from '@/components/Index.vue'
import Register from '@/components/Register.vue'
import Login from '@/components/Login.vue'
import { createRouter, createWebHistory } from 'vue-router'
import store from '@/components/store/index.js'

const routes = [
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
    path: '/',
    name: 'Index',
    component:Index,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = store.getters['auth/isAuthenticated']
  
  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
    next('/home')
  } else {
    next()
  }
})


export default router