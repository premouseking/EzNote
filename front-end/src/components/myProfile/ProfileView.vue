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
          <div class="stat-number">{{ notes.length }}</div>
          <div class="stat-label">画布总数</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ favoriteCount }}</div>
          <div class="stat-label">收藏画布</div>
        </div>
      </div>
      <div class="activities-section">
        <h3 style="margin-bottom: 15px;">最近活动</h3>
        <ActivitiesList :activities="activities" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ActivitiesList from '../components/ActivitiesList.vue'
import { useNotesStore } from '../stores/notes'
import { useActivitiesStore } from '../stores/activities'

const notesStore = useNotesStore()
const activitiesStore = useActivitiesStore()

const notes = computed(() => notesStore.notes)
const activities = computed(() => activitiesStore.activities)
const favoriteCount = computed(() => notes.value.filter(n => n.isFavorite).length)
</script>

<style scoped>
.view-container {
  flex-grow: 1;
  background-color: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 12px var(--shadow-color);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
.profile-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.profile-header {
  text-align: center;
  margin-bottom: 30px;
}
.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #66c2ff, #b3e0ff);
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: white;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
  margin-top: 20px;
}
.stat-card {
  background: var(--primary-color);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 8px var(--shadow-color);
}
.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: var(--accent-color);
  margin-bottom: 10px;
}
.stat-label {
  font-size: 14px;
  color: var(--text-color);
  opacity: 0.8;
}
.activities-section {
  margin-top: 30px;
  width: 100%;
  margin-left: 40px;
  /* 可根据需要调整距离 */
  box-sizing: border-box;
}
</style>