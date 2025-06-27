import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import store from './components/store/index.js'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

axios.defaults.baseURL = '/api'

const app = createApp(App)

// 添加请求拦截器添加令牌
axios.interceptors.request.use(config => {
  const token = store.state.auth.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 添加响应拦截器处理认证错误和后端响应格式
axios.interceptors.response.use(
  response => {
    const data = response.data;
    
    if (data && typeof data.code !== 'undefined' && data.code === 0) {
      const error = new Error(data.msg || '请求失败');
      error.response = {
        status: 400,
        data: data
      };
      return Promise.reject(error);
    }
    
    return response;
  },
  error => {
    // 处理 HTTP 状态码错误
    if (error.response?.status === 401) {
      // Token过期或无效，清除用户状态并跳转到登录页
      store.dispatch('auth/logout')
      if (router.currentRoute.value.path !== '/login') {
        router.push('/login')
      }
    }
    
    // 处理后端返回的业务错误
    if (error.response?.data?.code === 0) {
      error.message = error.response.data.msg || '请求失败';
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
