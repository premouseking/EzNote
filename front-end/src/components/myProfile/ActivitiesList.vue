<template>
  <div class="activities-list">
    <div v-if="activities.length === 0" class="empty-state" style="padding: 10px;">
      <i class="fas fa-history"></i>
      <p>暂无活动记录</p>
    </div>
    <div v-for="activity in activities" :key="activity.id" class="activity-item">
      <div class="activity-content">
        <div class="activity-icon">
          <i :class="['fas', activity.icon]"></i>
        </div>
        <div>
          <div>{{ activity.action }}: {{ activity.noteTitle || '未命名笔记' }}</div>
          <div class="activity-time">{{ formatDateTime(activity.timestamp) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['activities'])
function formatDateTime(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.activities-list {
  background: var(--primary-color);
  border-radius: 12px;
  padding: 15px;
  margin-top: 15px;
  max-height: 300px;
  overflow-y: auto;
}
.activity-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-color);
}
.activity-item:last-child {
  border-bottom: none;
}
.activity-content {
  display: flex;
  align-items: center;
  gap: 10px;
}
.activity-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--secondary-color);
}
.activity-time {
  color: #6699cc;
  font-size: 12px;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  text-align: center;
  color: #6699cc;
}
.empty-state i {
  font-size: 60px;
  opacity: 0.5;
}
.empty-state p {
  font-size: 18px;
  max-width: 80%;
  line-height: 1.5;
}
</style>