import { defineStore } from 'pinia'

export const useActivitiesStore = defineStore('activities', {
  state: () => ({
    activities: JSON.parse(localStorage.getItem('activities')) || []
  }),
  actions: {
    addActivity(action, noteTitle) {
      const activity = {
        id: Date.now(),
        action,
        noteTitle,
        timestamp: new Date().toISOString(),
        icon: this.getActivityIcon(action)
      }
      this.activities.unshift(activity)
      if (this.activities.length > 10) {
        this.activities.pop()
      }
      localStorage.setItem('activities', JSON.stringify(this.activities))
    },
    getActivityIcon(action) {
      switch (action) {
        case '创建画布': return 'fa-plus-circle'
        case '更新画布': return 'fa-edit'
        case '删除画布': return 'fa-trash-alt'
        case '收藏画布': return 'fa-star'
        case '取消收藏': return 'fa-star-o'
        case '重命名画布': return 'fa-edit'
        default: return 'fa-history'
      }
    },
    loadActivities() {
      this.activities = JSON.parse(localStorage.getItem('activities')) || []
    }
  }
})