<template>
  <div class="notes-list">
    <div
      v-for="note in notes"
      :key="note.id"
      class="note-item"
      @click="$emit('select', note.id)"
    >
      <div class="note-main">
        <div class="note-title">{{ note.title || '无标题笔记' }}</div>
        <div class="note-date">{{ formatDate(note.updatedAt) }}</div>
      </div>
      <div class="note-actions">
        <button type="button" class="favorite-btn" :class="{favorited: note.isFavorite}" @click.stop="emitFavorite(note.id)">
          <i class="fas fa-star"></i>
        </button>
        <button type="button" class="delete-note-btn" @click.stop="emitDelete(note.id)">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
    <div v-if="notes && notes.length === 0" class="empty-state" style="padding: 20px; color: #6699cc;">
      <i class="fas fa-sticky-note"></i>
      <p>暂无笔记</p>
    </div>
  </div>
</template>

<script setup>
import { toRefs, watch } from 'vue'

const props = defineProps({
  notes: {
    type: Array,
    required: true
  },
  currentNoteId: {
    type: [String, Number],
    default: null
  }
})
const notes = props.notes

console.log('NotesList notes:', notes)

const emit = defineEmits(['select', 'favorite', 'delete', 'view'])

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })
}

function emitFavorite(id) {
  console.log('NotesList emitFavorite', id)
  emit('favorite', id)
}
function emitDelete(id) {
  console.log('NotesList emitDelete', id)
  emit('delete', id)
}

watch(() => notes, (val) => {
  console.log('notes changed:', val)
})
</script>

<style scoped>
.notes-list {
  overflow-y: auto;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px 10px;
  border: 2px solid #222;
  border-radius: 10px;
  max-height:630px;
  background: var(--primary-color);
  box-sizing: border-box;
}
.note-item {
  padding: 18px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 4px solid var(--accent-color);
  background: var(--primary-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  border: 1.5px solid #222;
}
.note-item:last-child {
  margin-bottom: 0;
}
.note-item:hover {
  background: var(--secondary-color);
  transform: translateX(3px);
}
.note-item.active {
  background: #e6f2ff;
  color: #222;
}
.note-item.favorite {
  border-left: 4px solid var(--favorite-color);
  background: #fff9c4;
}
.note-main {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}
.note-title {
  font-weight: 600;
  margin-bottom: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
}
.note-date {
  font-size: 12px;
  margin-top: 2px;
  color: inherit;
  opacity: 0.7;
}
.note-actions {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 16px;
  align-items: flex-end;
  justify-content: center;
  height: 100%;
}
.favorite-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1.5px solid #bbb;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin: 0;
  padding: 0;
  transition: background 0.2s, border 0.2s;
}
.favorite-btn.favorited i {
  color: var(--favorite-color);
}
.delete-note-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1.5px solid #bbb;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin: 0;
  padding: 0;
  transition: background 0.2s, border 0.2s;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  text-align: center;
  height: 100%;
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
.enter-canvas-btn {
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 4px 12px;
  margin-left: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}
.enter-canvas-btn:hover {
  background: #0077cc;
}
.favorite-btn i, .delete-note-btn i {
  font-size: 15px;
}
</style>