<template>
  <div class="home-container">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">欢迎使用格知笔记</h1>
        <p class="hero-subtitle">智能画布，让创意自由流淌</p>
        <div class="action-buttons">
          <el-button type="primary" size="large" @click="goToCanvas">
            <el-icon><EditPen /></el-icon>
            开始创作
          </el-button>
          <el-button size="large" @click="goToNotes">
            <el-icon><Document /></el-icon>
            查看笔记
          </el-button>
        </div>
      </div>
      <div class="hero-image">
        <img src="@/assets/logo1.png" alt="EzNote Logo" />
      </div>
    </div>

    <div class="features-section">
      <h2>核心功能</h2>
      <div class="features-grid">
        <div class="feature-card">
          <el-icon class="feature-icon"><EditPen /></el-icon>
          <h3>智能画布</h3>
          <p>自由的创作空间，支持文字、图片、图形等多种元素</p>
        </div>
        <div class="feature-card">
          <el-icon class="feature-icon"><Document /></el-icon>
          <h3>笔记管理</h3>
          <p>高效的笔记组织和管理系统，让你的想法井然有序</p>
        </div>
        <div class="feature-card">
          <el-icon class="feature-icon"><Share /></el-icon>
          <h3>协作分享</h3>
          <p>轻松分享你的创作，与他人协作完成精彩内容</p>
        </div>
      </div>
    </div>

    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-number">{{ userStats.notesCount }}</div>
          <div class="stat-label">我的笔记</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ userStats.canvasCount }}</div>
          <div class="stat-label">创作画布</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ userStats.activitiesCount }}</div>
          <div class="stat-label">活动记录</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { EditPen, Document, Share } from '@element-plus/icons-vue'

const router = useRouter()

const userStats = ref({
  notesCount: 0,
  canvasCount: 0,
  activitiesCount: 0
})

const goToCanvas = () => {
  router.push('/canvas')
}

const goToNotes = () => {
  router.push('/canvas')
}

onMounted(() => {
  // 这里可以添加获取用户统计数据的API调用
  // 暂时使用模拟数据
  userStats.value = {
    notesCount: 12,
    canvasCount: 5,
    activitiesCount: 28
  }
})
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 80px;
  gap: 40px;
}

.hero-content {
  flex: 1;
  text-align: left;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 20px;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #7f8c8d;
  margin-bottom: 40px;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  gap: 20px;
}

.action-buttons .el-button {
  padding: 15px 30px;
  font-size: 16px;
  border-radius: 8px;
}

.hero-image {
  flex: 0 0 300px;
  text-align: center;
}

.hero-image img {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
}

.features-section {
  margin-bottom: 80px;
}

.features-section h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 50px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.feature-card {
  background: white;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  color: #409eff;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 15px;
}

.feature-card p {
  color: #7f8c8d;
  line-height: 1.6;
}

.stats-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 50px;
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 1.1rem;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .action-buttons {
    justify-content: center;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-section {
    padding: 30px 20px;
  }
}
</style>