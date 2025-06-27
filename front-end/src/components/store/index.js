import { createStore } from 'vuex'
import axios from 'axios'

/**
 * 解析JWT载荷信息
 * @param {string} token JWT令牌
 * @returns {Object} 解析后的用户信息
 */
const parseJwtPayload = (token) => {
  try {
    if (!token) return {};
    
    // JWT格式：header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('JWT格式不正确');
      return {};
    }
    
    // 解码payload部分（Base64URL）
    const payload = parts[1];
    // 处理Base64URL：替换字符并添加padding
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
    
    // 解码并解析JSON
    const decoded = JSON.parse(atob(padded));
    
    console.log('解析JWT载荷:', decoded);
    
    // 返回用户信息（根据后端JWT结构调整字段映射）
    return {
      id: decoded.sub || decoded.userId || decoded.id,
      username: decoded.username || decoded.name || decoded.sub,
      email: decoded.email,
      role: decoded.role || decoded.authorities,
      // 添加JWT标准字段
      exp: decoded.exp, // 过期时间
      iat: decoded.iat, // 签发时间
      // 保留原始载荷信息
      ...decoded
    };
  } catch (error) {
    console.error('解析JWT失败:', error);
    return {};
  }
};

/**
 * 错误处理函数
 * @param {Object} error  错误对象
 * @param {string} defaultMessage 默认错误消息
 */
const handleApiError = (error, defaultMessage = '操作失败，请稍后重试') => {
  console.error('API请求失败:', error);
  
  // 处理后端返回的错误格式
  if (error.response?.data?.msg) {
    throw new Error(error.response.data.msg);
  }
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
        
        console.log('后端响应:', responseData);
        
        // 后端返回格式：{ code: 1, msg: "登录成功", data: "jwt_token_string" }
        const jwtToken = responseData.data;
        
        if (!jwtToken || typeof jwtToken !== 'string') {
          throw new Error('登录响应格式错误：缺少JWT令牌');
        }
        
        // 从JWT中解析用户信息
        const userInfo = parseJwtPayload(jwtToken);
        
        // 保存令牌
        commit('SET_TOKEN', { 
          token: jwtToken, 
          rememberMe: loginData.rememberMe 
        });
        
        // 保存用户信息
        if (userInfo && Object.keys(userInfo).length > 0) {
          commit('SET_USER', { 
            user: userInfo, 
            rememberMe: loginData.rememberMe 
          });
        }
        
        console.log('登录成功，用户信息:', userInfo);
        
        // 返回统一格式给前端组件使用
        return {
          success: true,
          message: responseData.msg || '登录成功',
          data: {
            token: jwtToken,
            user: userInfo
          }
        };
        
      } catch (error) {
        console.error('登录失败:', error);
        // 重新抛出错误，让调用方处理
        throw error;
      }
    },
    
    // 注册操作
    async register({ commit }, userData) {
      try {
        console.log('发送注册请求:', { 
          username: userData.username,
          email: userData.email 
        });
        
        // 发送注册请求到后端
        const response = await axios.post(API_ENDPOINTS.REGISTER, userData);
        const responseData = response.data;
        
        console.log('注册后端响应:', responseData);
        
        // 后端返回格式：{ code: 1, msg: "注册成功", data: "jwt_token_string" }
        const jwtToken = responseData.data;
        
        if (!jwtToken || typeof jwtToken !== 'string') {
          throw new Error('注册响应格式错误：缺少JWT令牌');
        }
        
        // 从JWT中解析用户信息
        const userInfo = parseJwtPayload(jwtToken);
        
        // 注册默认不记住登录状态，用户可在后续登录时选择
        const rememberMe = false;
        
        // 保存令牌
        commit('SET_TOKEN', { 
          token: jwtToken, 
          rememberMe 
        });
        
        // 保存用户信息
        if (userInfo && Object.keys(userInfo).length > 0) {
          commit('SET_USER', { 
            user: userInfo, 
            rememberMe 
          });
        }
        
        console.log('注册成功，用户信息:', userInfo);
        
        // 返回统一格式给前端组件使用
        return {
          success: true,
          message: responseData.msg || '注册成功',
          data: {
            token: jwtToken,
            user: userInfo
          }
        };
        
      } catch (error) {
        console.error('注册失败:', error);
        // 重新抛出错误，让调用方处理
        throw error;
      }
    },
    // 登出操作
    async logout({ commit }) {
      try {
        // 如果有后端登出接口，可以调用
        // await axios.post('/logout')
        
        // 清除本地存储的用户信息
        commit('LOGOUT')
        
        console.log('用户已成功登出')
        
        return Promise.resolve()
      } catch (error) {
        console.error('登出过程中发生错误:', error)
        
        // 即使出错也要清除本地数据
        commit('LOGOUT')
        
        return Promise.reject(error)
      }
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