<template>
  <div class="activities-list">
    <div v-if="activities.length === 0" class="empty-state">
      <i class="fas fa-history"></i>
      <p>暂无活动记录</p>
    </div>
    <div v-for="activity in activities" :key="activity.id" class="activity-item">
      <div class="activity-content">
        <div class="activity-icon">
          <i :class="['fas', activity.icon]"></i>
        </div>
        <div class="activity-details">
          <div class="activity-text">{{ activity.action }}: {{ activity.noteTitle || '未命名笔记' }}</div>
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
  background: linear-gradient(135deg, #f8f9ff, #e8f0ff);
  border: 1px solid rgba(102, 194, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
  max-height: 350px;
  overflow-y: auto;
  transition: box-shadow 0.2s ease;
}

.activities-list:hover {
  box-shadow: 0 4px 12px rgba(102, 194, 255, 0.1);
}

.activity-item {
  padding: 15px 0;
  border-bottom: 1px solid rgba(102, 194, 255, 0.1);
  transition: background-color 0.2s ease;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-item:hover {
  background-color: rgba(102, 194, 255, 0.05);
  border-radius: 8px;
  margin: 0 -10px;
  padding: 15px 10px;
}

.activity-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #66c2ff, #b3e0ff);
  color: white;
  font-size: 16px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(102, 194, 255, 0.3);
}

.activity-details {
  flex-grow: 1;
  min-width: 0;
}

.activity-text {
  font-size: 14px;
  color: var(--text-color);
  font-weight: 500;
  margin-bottom: 4px;
  word-wrap: break-word;
}

.activity-time {
  color: #66c2ff;
  font-size: 12px;
  opacity: 0.8;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  text-align: center;
  color: #66c2ff;
  padding: 40px 20px;
}

.empty-state i {
  font-size: 48px;
  opacity: 0.6;
}

.empty-state p {
  font-size: 16px;
  margin: 0;
  opacity: 0.8;
  line-height: 1.5;
}

/* 滚动条样式 */
.activities-list::-webkit-scrollbar {
  width: 6px;
}

.activities-list::-webkit-scrollbar-track {
  background: rgba(102, 194, 255, 0.1);
  border-radius: 3px;
}

.activities-list::-webkit-scrollbar-thumb {
  background: rgba(102, 194, 255, 0.3);
  border-radius: 3px;
}

.activities-list::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 194, 255, 0.5);
}
</style>