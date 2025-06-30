<template>
  <div class="view-container active">
    <div class="profile-view">
      <div class="profile-header">
        <div class="avatar"><i class="fas fa-user"></i></div>
        <h2>用户昵称</h2>
        <p>notebookuser@example.com</p>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">{{ totalNotes }}</div>
          <div class="stat-label">笔记总数</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ favoriteCount }}</div>
          <div class="stat-label">收藏笔记</div>
        </div>
      </div>
      
      <div class="activities-section">
        <h3 class="activities-title">最近活动</h3>
        <ActivitiesList :activities="activities" />
      </div>
    </div>
  </div>
</template>

<script setup>
import ActivitiesList from '../myProfile/ActivitiesList.vue'
import { useStore } from 'vuex'
import { computed } from 'vue'

const store = useStore()
const favoriteCount = computed(() => store.getters['notes/favoriteCount'])
const totalNotes = computed(() => store.getters['notes/allNotes'].length)
const activities = computed(() => store.getters['activities/activities'])
</script>

<style scoped>
.view-container {
  flex-grow: 1;
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px var(--shadow-color);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  max-width: 600px;
  margin: 0 auto;
}

.profile-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 25px;
}

.profile-header {
  text-align: center;
  width: 100%;
}

.profile-header h2 {
  margin: 15px 0 5px 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--text-color);
}

.profile-header p {
  margin: 0;
  color: var(--text-color);
  opacity: 0.7;
  font-size: 14px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #66c2ff, #b3e0ff);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 194, 255, 0.3);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
  max-width: 400px;
}

.stat-card {
  background: linear-gradient(135deg, #f8f9ff, #e8f0ff);
  border: 1px solid rgba(102, 194, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 194, 255, 0.15);
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #66c2ff;
  margin-bottom: 8px;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: var(--text-color);
  opacity: 0.8;
  font-weight: 500;
}

.activities-section {
  width: 100%;
  max-width: 500px;
}

.activities-title {
  margin: 0 0 15px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  text-align: center;
}
</style>