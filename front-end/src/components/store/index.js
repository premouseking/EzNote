import { createStore } from 'vuex'
import axios from 'axios'

/**
 * 错误处理函数
 * @param {Object} error  错误对象
 * @param {string} defaultMessage 默认错误消息
 */
const handleApiError = (error, defaultMessage = '操作失败，请稍后重试') => {
  console.error('API请求失败:', error);
  
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  if (error.request) {
    throw new Error('网络连接失败，请检查网络连接');
  }
  throw new Error(error.message || defaultMessage);
};

const API_ENDPOINTS = {
  LOGIN: '/login',
  REGISTER: '/register'
};

const auth = {
  namespaced: true,
  state: {
    // 初始化时检查两种存储方式
    token: localStorage.getItem('token') || sessionStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}'),
    rememberMe: localStorage.getItem('rememberMe') === 'true'
  },
  mutations: {
    /**
     * @param {Object} state Vuex 状态对象
     * @param {Object} payload 包含token和rememberMe的对象
     * 设置用户的认证令牌，根据rememberMe决定存储方式
     */
    SET_TOKEN(state, payload) {
      const { token, rememberMe } = payload;
      state.token = token;
      
      if (rememberMe) {
        // 长期存储：使用localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('rememberMe', 'true');
        // 清除可能存在的sessionStorage
        sessionStorage.removeItem('token');
      } else {
        // 临时存储：使用sessionStorage
        sessionStorage.setItem('token', token);
        localStorage.setItem('rememberMe', 'false');
        // 清除可能存在的localStorage token
        localStorage.removeItem('token');
      }
    },
    /**
     * 
     * @param  state Vuex 状态对象
     * @param  payload  包含用户信息和rememberMe的对象
     * 设置用户信息，根据rememberMe决定存储方式
     */
    SET_USER(state, payload) {
      const { user, rememberMe } = payload;
      state.user = user;
      
      if (rememberMe) {
        // 长期存储
        localStorage.setItem('user', JSON.stringify(user));
        // 清除可能存在的sessionStorage
        sessionStorage.removeItem('user');
      } else {
        // 临时存储
        sessionStorage.setItem('user', JSON.stringify(user));
        // 不清除localStorage中的user，因为可能需要保留基本信息
      }
    },

    /**
     * @param state  Vuex 状态对象
     * 处理用户登出
     */
    LOGOUT(state) {
      state.token = ''
      state.user = {}
      // 清除所有存储
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('rememberMe')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
    }
  },
  actions: {    
    async login({ commit }, credentials) {
      try {
        // credentials 包含：
        // { username: "用户输入的用户名或邮箱", password: "密码", rememberMe: true/false }
        
        const loginData = {
          username: credentials.username.trim(),
          password: credentials.password,
          rememberMe: credentials.rememberMe || false
        };
        
        console.log('发送登录请求:', { 
          username: loginData.username, 
          rememberMe: loginData.rememberMe 
        });
        
        // 发送登录请求到后端
        const response = await axios.post(API_ENDPOINTS.LOGIN, loginData);

        const responseData = response.data;
        
        if (!responseData.success) {
          // 后端返回登录失败
          throw new Error(responseData.message || '登录失败');
        }
        
        const { data } = responseData;
        
        if (!data || !data.token) {
          throw new Error('登录响应格式错误：缺少token');
        }
        
        // 保存令牌
        commit('SET_TOKEN', { 
          token: data.token, 
          rememberMe: loginData.rememberMe 
        });
        
        // 保存用户信息
        if (data.user) {
          commit('SET_USER', { 
            user: data.user, 
            rememberMe: loginData.rememberMe 
          });
        }
        
        console.log('登录成功:', data.user);
        
        return responseData;
        
      } catch (error) {
        console.error('登录失败:', error);
        // 重新抛出错误
        throw handleApiError(error);
      }
    },
    
    // 注册操作
    async register({ commit }, userData) {
      try {
        console.log('发送注册请求:', { 
          username: userData.username,
          email: userData.email 
        });
        
        const response = await axios.post(API_ENDPOINTS.REGISTER, userData);
        const responseData = response.data;
        
        if (!responseData.success) {
          // 后端返回注册失败
          throw new Error(responseData.message || '注册失败');
        }
        
        const { data } = responseData;
        
        if (!data || !data.token) {
          throw new Error('注册响应格式错误：缺少token');
        }
        
        // 注册默认不记住登录状态，用户可在后续登录时选择
        const rememberMe = false;
        
        // 保存令牌
        commit('SET_TOKEN', { 
          token: data.token, 
          rememberMe 
        });
        
        // 保存用户信息
        if (data.user) {
          commit('SET_USER', { 
            user: data.user, 
            rememberMe 
          });
        }
        
        console.log('注册成功:', data.user);
        
        return responseData;
      } catch (error) {
        console.error('注册失败:', error);
        // 重新抛出错误
        throw handleApiError(error);
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