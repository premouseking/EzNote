import { createStore } from 'vuex'
import axios from 'axios'

/**
 * 解析JWT token载荷信息
 * @param {string} token 令牌
 * @returns {Object} 解析后的用户信息
 */
const parseJwtPayload = (token) => {
  try {
    if (!token) return {};
    
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('token错误');
      return {};
    }
    
    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
    
    const decoded = JSON.parse(atob(padded));
    
    console.log('解析decoded:', decoded);
    
    // 返回用户信息
    return {
      id: decoded.sub || decoded.userId || decoded.id,
      username: decoded.username || decoded.name || decoded.sub,
      email: decoded.email,
      role: decoded.role || decoded.authorities,
      exp: decoded.exp, // 过期时间
      iat: decoded.iat, // 签发时间
      ...decoded
    };
  } catch (error) {
    console.error('解析失败:', error);
    return {};
  }
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
     * @param {Object} state 状态对象
     * @param {Object} payload 包含token和rememberMe的对象
     * 设置用户的认证令牌，根据rememberMe决定存储方式
     */
    SET_TOKEN(state, payload) {
      const { token, rememberMe } = payload;
      state.token = token;
      
      if (rememberMe) {
        // 长期存储
        localStorage.setItem('token', token);
        localStorage.setItem('rememberMe', 'true');
        sessionStorage.removeItem('token');
      } else {
        // 临时存储
        sessionStorage.setItem('token', token);
        localStorage.setItem('rememberMe', 'false');
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
          const loginData = {
          username: credentials.username.trim(),
          password: credentials.password,
          rememberMe: credentials.rememberMe || false
        };
        
        console.log('登录请求:', { 
          username: loginData.username, 
          rememberMe: loginData.rememberMe 
        });
        
        // 发送登录请求到后端
        const response = await axios.post(API_ENDPOINTS.LOGIN, loginData);
        const responseData = response.data;
        
        console.log('后端响应:', responseData);
        
        const jwtToken = responseData.data;
        
        if (!jwtToken || typeof jwtToken !== 'string') {
          throw new Error('服务器响应错误');
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
        
        const jwtToken = responseData.data;
        
        if (!jwtToken || typeof jwtToken !== 'string') {
          throw new Error('服务器响应错误');
        }
        
        // 解析用户信息
        const userInfo = parseJwtPayload(jwtToken);
        
        // 注册默认不记住登录状态
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
        throw error;
      }
    },
    // 登出操作
    async logout({ commit }) {
      try {
        // await axios.post('/logout')
        // 清除本地存储的用户信息
        commit('LOGOUT')
        
        console.log('用户已成功登出')
        return Promise.resolve()

      } catch (error) {
        console.error('登出错误:', error)
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

// Notes module
const notes = {
  namespaced: true,
  state: () => {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || []
    // 如果没有保存的数据，创建一些测试数据
    if (savedNotes.length === 0) {
      const testNotes = [
        {
          id: '1',
          title: '我的第一个画布',
          imageData: '',
          textBoxes: [
            {
              id: '1-1',
              x: 100,
              y: 100,
              width: 200,
              height: 120,
              title: '欢迎使用',
              content: '这是一个测试笔记块，你可以在这里编辑内容。',
              mediaContent: ''
            }
          ],
          isFavorite: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          title: '项目计划',
          imageData: '',
          textBoxes: [
            {
              id: '2-1',
              x: 150,
              y: 150,
              width: 250,
              height: 150,
              title: '项目目标',
              content: '1. 完成前端开发\n2. 测试功能\n3. 部署上线',
              mediaContent: ''
            }
          ],
          isFavorite: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
      localStorage.setItem('notes', JSON.stringify(testNotes))
      return {
        allNotes: testNotes,
        searchQuery: '',
        currentNoteId: '1',
      }
    }
    return {
      allNotes: savedNotes,
      searchQuery: '',
      currentNoteId: savedNotes[0]?.id || null,
    }
  },
  mutations: {
    SAVE_NOTES(state) {
      localStorage.setItem('notes', JSON.stringify(state.allNotes));
    },
    CREATE_NOTE(state) {
      const newNote = {
        id: Date.now().toString(),
        title: '新画布',
        imageData: '',
        textBoxes: [],
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      state.allNotes.unshift(newNote);
      state.currentNoteId = newNote.id;
    },
    SELECT_NOTE(state, id) {
      state.currentNoteId = id;
    },
    DELETE_NOTE(state, id) {
      const idx = state.allNotes.findIndex(n => n.id === id);
      if (idx !== -1) {
        state.allNotes.splice(idx, 1);
        if (state.currentNoteId === id) {
          state.currentNoteId = state.allNotes[0]?.id || null;
        }
      }
    },
    TOGGLE_FAVORITE(state, id) {
      const note = state.allNotes.find(n => n.id === id);
      if (note) {
        note.isFavorite = !note.isFavorite;
      }
    },
    UPDATE_NOTE(state, { id, data }) {
      const note = state.allNotes.find(n => n.id === id);
      if (note) {
        Object.assign(note, data);
        note.updatedAt = new Date().toISOString();
      }
    },
    SET_SEARCH_QUERY(state, query) {
      state.searchQuery = query;
    }
  },
  actions: {
    saveNotes({ commit }) {
      commit('SAVE_NOTES');
    },
    createNote({ commit, dispatch, state }) {
      commit('CREATE_NOTE');
      dispatch('saveNotes');
      // 返回新创建的note
      return state.allNotes[0];
    },
    selectNote({ commit }, id) {
      commit('SELECT_NOTE', id);
    },
    deleteNote({ commit, dispatch }, id) {
      commit('DELETE_NOTE', id);
      dispatch('saveNotes');
    },
    toggleFavorite({ commit, dispatch }, id) {
      commit('TOGGLE_FAVORITE', id);
      dispatch('saveNotes');
    },
    updateNote({ commit, dispatch }, { id, updates }) {
      commit('UPDATE_NOTE', { id, data: updates });
      dispatch('saveNotes');
    },
    setSearchQuery({ commit }, query) {
      commit('SET_SEARCH_QUERY', query);
    },
    searchNotes({ commit, state, getters }, query) {
      commit('SET_SEARCH_QUERY', query);
      // 自动修正 currentNoteId
      const filtered = getters.notes;
      if (!filtered.find(n => n.id == state.currentNoteId)) {
        commit('SELECT_NOTE', filtered[0]?.id || null);
      }
    }
  },
  getters: {
    notes(state) {
      if (!state.searchQuery.trim()) return state.allNotes;
      const lowerQuery = state.searchQuery.toLowerCase();
      return state.allNotes.filter(note => {
        if (note.title && note.title.toLowerCase().includes(lowerQuery)) return true;
        if (note.textBoxes && note.textBoxes.some(tb =>
          (tb.title && tb.title.toLowerCase().includes(lowerQuery)) ||
          (tb.content && tb.content.toLowerCase().includes(lowerQuery))
        )) return true;
        return false;
      });
    },
    allNotes(state) {
      return state.allNotes;
    },
    currentNote(state) {
      return state.allNotes.find(n => n.id == state.currentNoteId) || null;
    },
    favoriteCount(state) {
      return state.allNotes.filter(n => n.isFavorite).length;
    }
  }
}

// Activities module
const activities = {
  namespaced: true,
  state: () => ({
    activities: JSON.parse(localStorage.getItem('activities')) || []
  }),
  mutations: {
    ADD_ACTIVITY(state, activity) {
      state.activities.unshift(activity);
      if (state.activities.length > 10) {
        state.activities.pop();
      }
      localStorage.setItem('activities', JSON.stringify(state.activities));
    },
    LOAD_ACTIVITIES(state) {
      state.activities = JSON.parse(localStorage.getItem('activities')) || [];
    }
  },
  actions: {
    addActivity({ commit }, { action, noteTitle }) {
      const getActivityIcon = (action) => {
        switch (action) {
          case '创建画布': return 'fa-plus-circle'
          case '更新画布': return 'fa-edit'
          case '删除画布': return 'fa-trash-alt'
          case '收藏画布': return 'fa-star'
          case '取消收藏': return 'fa-star-o'
          case '重命名画布': return 'fa-edit'
          default: return 'fa-history'
        }
      };
      
      const activity = {
        id: Date.now(),
        action,
        noteTitle,
        timestamp: new Date().toISOString(),
        icon: getActivityIcon(action)
      };
      commit('ADD_ACTIVITY', activity);
    },
    loadActivities({ commit }) {
      commit('LOAD_ACTIVITIES');
    }
  },
  getters: {
    activities(state) {
      return state.activities;
    }
  }
}

export default createStore({
  modules: {
    auth,
    notes,
    activities
  }
})