import Home from '@/components/home/Home.vue'
import Index from '@/components/Index.vue'
import Register from '@/components/Register.vue'
import Login from '@/components/Login.vue'
import NotesView from '@/components/view/NotesView.vue'
import CanvasView from '@/components/view/CanvasView.vue'
import ProfileView from '@/components/view/ProfileView.vue'
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
    meta: { requiresAuth: true }, // 添加认证要求
    children: [
      {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: false }
      },
      {
        path: '/canvas',
        name: 'NotesView',
        component: NotesView,
        meta: { requiresAuth: false }
      },
      {
        path: '/canvas/:id',
        name: 'CanvasView',
        component: CanvasView,
        meta: { requiresAuth: false }
      },
      {
        path: '/profile',
        name: 'ProfileView',
        component: ProfileView,
        meta: { requiresAuth: false }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // 临时注释掉认证检查，用于测试主页面
  // const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  // const isAuthenticated = store.getters['auth/isAuthenticated']
  
  // if (requiresAuth && !isAuthenticated) {
  //   next('/login')
  // } else if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
  //   next('/home')
  // } else {
  //   next()
  // }
  
  next()
})


export default router