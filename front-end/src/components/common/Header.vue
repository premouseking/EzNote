<template>
  <header>
    <div class="logo">
      <div class="logo-icon">N</div>
      <h1>格知笔记</h1>
    </div>
    <div class="nav-links" v-if="!route.path.match(/^\/canvas\/[\w-]+$/)">
      <button class="nav-btn" :class="{active: route.path.startsWith('/canvas')}" @click="goCanvas">
        <i class="fas fa-book"></i> 我的画布
      </button>
      <button class="nav-btn" :class="{active: route.name==='ProfileView'}" @click="goProfile">
        <i class="fas fa-user"></i> 个人主页
      </button>
    </div>
  </header>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

function goCanvas() {
  router.push('/canvas')
}
function goProfile() {
  router.push('/profile')
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
.nav-links {
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
  color: black !important;
  border-color: #005fa3;
}
</style>