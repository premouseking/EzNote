<template>
  <div class="sidebar">
    <button class="nav-btn" @click="$emit('create')">
      <i class="fas fa-plus"></i> 新建画布
    </button>
    <div class="search-box">
      <i class="fas fa-search"></i>
      <input
        type="text"
        placeholder="搜索画布或笔记..."
        @input="$emit('search', $event.target.value)"
        class="search-input"
      >
    </div>
    <!-- 使用 NotesList 组件渲染画布列表 -->
    <NotesList
      :notes="notes"
      @select="console.log('NotesSidebar emit select', $event); $emit('select', $event)"
      @favorite="(id) => { console.log('sidebar favorite', id); $emit('favorite', id) }"
      @delete="confirmDelete"
      @view="$emit('view', $event)"
    />
  </div>
</template>

<script setup>
import NotesList from './NotesList.vue'
import emitter from '../eventBus'

const props = defineProps({
  notes: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['create', 'search', 'select', 'favorite', 'delete', 'view'])

function confirmDelete(id) {
  const noteToDelete = props.notes.find(note => note.id === id)
  if (noteToDelete) {
    emitter.emit('show-confirm', {
      message: `确定要删除画布 "${noteToDelete.title || '无标题画布'}" 吗？`,
      onConfirm: () => {
        emit('delete', id)
      }
    })
  }
}
</script>

<style scoped>
.sidebar {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  width: 280px;
  box-shadow: 0 4px 12px var(--shadow-color);
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex-shrink: 0;
  height: 100vh;
  box-sizing: border-box;
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
  width: 100%;
  box-sizing: border-box;
}
.nav-btn:hover {
  background: #0077cc !important;
  color: black !important;
  border-color: #005fa3;
}
.search-box {
  position: relative;
  width: 100%;
}
.search-box input {
  width: 100%;
  padding: 12px 15px 12px 40px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 15px;
  color: var(--text-color);
  box-sizing: border-box;
}
.search-box i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--accent-color);
}
.search-input {
  border: 2px solid #222 !important;
  border-radius: 8px;
  padding: 12px 15px 12px 40px;
  font-size: 15px;
  color: var(--text-color);
  width: 78%;
  box-sizing: border-box;
  background: #fff;
  outline: none;
}
.search-input:focus {
  border: 2px solid #222 !important;
  outline: none;
}
</style>