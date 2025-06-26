import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import store from './components/store/index.js'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { setupMockInterceptors } from './mock/loginAPI.js'

axios.defaults.baseURL = '/api'

// 设置Mock拦截器
setupMockInterceptors(axios)

const app = createApp(App)

// 添加请求拦截器添加令牌
axios.interceptors.request.use(config => {
  const token = store.state.auth.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 添加响应拦截器处理认证错误
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token过期或无效，清除用户状态并跳转到登录页
      store.dispatch('auth/logout')
      if (router.currentRoute.value.path !== '/login') {
        router.push('/login')
      }
    }
    return Promise.reject(error)
  }
)

// 全局挂载
app.config.globalProperties.$axios = axios
axios.defaults.withCredentials = true

app.use(store)
app.use(router)
app.use(ElementPlus) 
app.mount('#app')
