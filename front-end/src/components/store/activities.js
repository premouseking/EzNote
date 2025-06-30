import { ref } from 'vue'

// 活动记录数据
const activities = ref([
  {
    id: 1,
    action: '创建笔记',
    target: '示例笔记1',
    timestamp: new Date('2024-01-01T10:00:00')
  },
  {
    id: 2,
    action: '收藏笔记',
    target: '示例笔记2',
    timestamp: new Date('2024-01-02T11:00:00')
  }
])

let nextActivityId = 3

export function useActivitiesStore() {
  const addActivity = (action, target) => {
    const newActivity = {
      id: nextActivityId++,
      action,
      target,
      timestamp: new Date()
    }
    activities.value.unshift(newActivity)
    
    // 保持最多100条记录
    if (activities.value.length > 100) {
      activities.value = activities.value.slice(0, 100)
    }
  }

  const clearActivities = () => {
    activities.value = []
  }

  const getRecentActivities = (limit = 10) => {
    return activities.value.slice(0, limit)
  }

  return {
    activities,
    addActivity,
    clearActivities,
    getRecentActivities
  }
}
