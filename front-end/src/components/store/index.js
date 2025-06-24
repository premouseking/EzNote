import { createStore } from 'vuex'
import axios from 'axios'

// 用户认证模块
const auth = {
  namespaced: true,
  state: {
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user') || '{}')
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    SET_USER(state, user) {
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    LOGOUT(state) {
      state.token = ''
      state.user = {}
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },
  actions: {
    
    async login({ commit }, credentials) {
      try {
        const response = await axios.post('/login', credentials)
        const token = response.data.token
        
        // 保存令牌
        commit('SET_TOKEN', token)
        
        // 如果 API 返回了用户信息，保存用户信息
        if (response.data.user) {
          commit('SET_USER', response.data.user)
        }
        
        // 如果选择记住用户名
        if (credentials.remember) {
          localStorage.setItem('username', credentials.username)
        }
        
        return response
      } catch (error) {
        throw error
      }
    },
    
    // 注册操作
    async register({ commit }, userData) {
      try {
        const response = await axios.post('/register', userData)
        const token = response.data.token
        
        // 保存令牌
        commit('SET_TOKEN', token)
        
        // 如果 API 返回了用户信息，保存用户信息
        if (response.data.user) {
          commit('SET_USER', response.data.user)
        }
        
        return response
      } catch (error) {
        throw error
      }
    },
    
    // 登出操作
    logout({ commit }) {
      commit('LOGOUT')
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user
  }
}

// 创建 store
export default createStore({
  modules: {
    auth
  }
})