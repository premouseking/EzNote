<template>
  <header>
    <div class="logo">
      <div class="logo-icon">N</div>
      <h1>格知笔记</h1>
    </div>
    <div class="nav-center" v-if="!route.path.match(/^\/canvas\/[\w-]+$/)">
      <button class="nav-btn" :class="{active: route.path.startsWith('/canvas')}" @click="goCanvas">
        <i class="fas fa-book"></i> 我的画布
      </button>
      <button class="nav-btn" :class="{active: route.name==='ProfileView'}" @click="goProfile">
        <i class="fas fa-user"></i> 个人主页
      </button>
    </div>
    <div class="user-section" v-if="isAuthenticated">
      <span class="welcome-text">欢迎, {{ currentUser.username || '用户' }}</span>
      <button class="logout-btn" @click="handleLogout">
        <i class="fas fa-sign-out-alt"></i> 退出
      </button>
    </div>
  </header>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()
const store = useStore()

// 计算属性
const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
const currentUser = computed(() => store.getters['auth/currentUser'])

function goCanvas() {
  router.push('/canvas')
}

function goProfile() {
  router.push('/profile')
}

async function handleLogout() {
  try {
    await store.dispatch('auth/logout')
    router.push('/login')
  } catch (error) {
    console.error('登出失败:', error)
    // 即使出错也跳转到登录页
    router.push('/login')
  }
}
</script>

<style scoped>
header {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px var(--shadow-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}
.logo {
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
}
.logo-icon {
  width: 48px;
  height: 48px;
  background-color: var(--accent-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
}
.logo h1 {
  font-size: 28px;
  font-weight: 600;
  background: linear-gradient(to right, #0077cc, #00aaff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.nav-center {
  display: flex;
  gap: 20px;
}
.nav-btn {
  background: var(--primary-color);
  padding: 10px 20px;
  border-radius: 30px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid rgb(10, 11, 11);
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 8px;
}
.nav-btn.active, .nav-btn:hover {
  background: #0077cc !important;
  color: white !important;
  border-color: #005fa3;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.welcome-text {
  color: var(--text-color);
  font-weight: 500;
  font-size: 14px;
}

.logout-btn {
  background: #ff4757;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.logout-btn:hover {
  background: #ff3838;
  transform: translateY(-1px);
}
</style>