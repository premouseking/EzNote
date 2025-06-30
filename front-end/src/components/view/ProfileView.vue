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
          <div class="stat-number">{{ notesStore.notes.length }}</div>
          <div class="stat-label">笔记总数</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ notesStore.favoriteCount }}</div>
          <div class="stat-label">收藏笔记</div>
        </div>
      </div>
      <div style="margin-top: 10px; margin-bottom: -10px; width: 100%; border: 1px solid #666666; border-radius: 12px; padding: 15px;">
        <h3 style="margin-bottom: 10px;">最近活动</h3>
        <ActivitiesList :activities="activitiesStore.activities" />
      </div>
    </div>
  </div>
</template>

<script setup>
import ActivitiesList from '../components/ActivitiesList.vue'
import { useNotesStore } from '../stores/notes'
import { useActivitiesStore } from '../stores/activities'
const notesStore = useNotesStore()
const activitiesStore = useActivitiesStore()
</script>

<style scoped>
.view-container {
  flex-grow: 1;
  background-color: white;
  border-radius: 12px;
  padding: 20px;
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
  margin-bottom: 20px;
}
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #66c2ff, #b3e0ff);
  margin: 0 auto 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: white;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  width: 100%;
  margin-top: 15px;
}
.stat-card {
  background: var(--primary-color);
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 4px 8px var(--shadow-color);
}
.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: var(--accent-color);
  margin-bottom: 8px;
}
.stat-label {
  font-size: 14px;
  color: var(--text-color);
  opacity: 0.8;
}
</style>