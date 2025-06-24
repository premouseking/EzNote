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
// 全局挂载
app.config.globalProperties.$axios = axios
axios.defaults.withCredentials = true


app.use(store)
app.use(router)
app.use(ElementPlus) 
app.mount('#app')
