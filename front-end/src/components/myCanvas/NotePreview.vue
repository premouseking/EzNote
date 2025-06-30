<template>
  <div class="note-preview">
    <div class="title-edit">
      <template v-if="isEditingTitle">
        <input v-model="editTitleValue" class="edit-title-input" @keyup.enter="saveEditTitle" @keyup.esc="cancelEditTitle" />
        <button class="edit-title-btn" @click="saveEditTitle">保存</button>
        <button class="edit-title-btn cancel" @click="cancelEditTitle">取消</button>
      </template>
      <template v-else>
        <h2>{{ note.title || '无标题画布' }}</h2>
        <i class="fas fa-edit edit-icon" @click="startEditTitle" title="编辑标题"></i>
      </template>
    </div>
    <div class="note-content">
      <div v-if="note.textBoxes && note.textBoxes.length">
        <div v-for="tb in note.textBoxes" :key="tb.id" class="text-box-preview">
          <div class="tb-title">{{ tb.title || '无标题笔记' }}</div>
          <div class="tb-content">{{ tb.content }}</div>
        </div>
      </div>
      <p v-else class="empty-preview">此画布没有内容</p>
    </div>
    <div class="note-actions">
      <button class="btn btn-view enter-canvas-btn" @click="$emit('view', note.id)">
        <i class="fas fa-external-link-alt"></i> 进入画布
      </button>
      <button class="btn btn-delete" @click="confirmDelete">
        <i class="fas fa-trash"></i> 删除画布
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import emitter from '../eventBus'

const props = defineProps(['note'])
const emit = defineEmits(['edit', 'delete', 'view'])

const isEditingTitle = ref(false)
const editTitleValue = ref('')

function startEditTitle() {
  editTitleValue.value = props.note.title || ''
  isEditingTitle.value = true
}
function saveEditTitle() {
  if (editTitleValue.value.trim()) {
    emit('edit', props.note.id, editTitleValue.value.trim())
  }
  isEditingTitle.value = false
}
function cancelEditTitle() {
  isEditingTitle.value = false
}

function confirmDelete() {
  emitter.emit('show-confirm', {
    message: `确定要删除画布 "${props.note.title || '无标题画布'}" 吗？`,
    onConfirm: () => {
      emit('delete', props.note.id)
    }
  })
}
</script>

<style scoped>
.note-preview {
  background: var(--primary-color);
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1 1 0%;
  min-width: 0;
}
.title-edit {
  display: flex;
  align-items: center;
  gap: 10px;
}
.edit-icon {
  cursor: pointer;
  color: var(--accent-color);
  font-size: 18px;
  opacity: 0.7;
  transition: all 0.2s;
}
.edit-icon:hover {
  opacity: 1;
  transform: scale(1.1);
}
.note-content {
  background: white;
  border-radius: 8px;
  padding: 15px;
  min-height: 100px;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
  max-height: 550px;
  overflow-y: auto;
}
.text-box-preview {
  background: #f0f9ff;
  border-radius: 4px;
  padding: 8px 12px;
  margin-bottom: 10px;
}
.tb-title {
  font-weight: bold;
  color: #174366;
  margin-bottom: 4px;
}
.tb-content {
  color: #003366;
  font-size: 14px;
  white-space: pre-wrap;
}
.note-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
.enter-canvas-btn {
  background: #0077cc !important;
  color: #fff !important;
  border-radius: 20px;
  padding: 10px 28px;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: none;
  transition: background 0.2s;
}
.enter-canvas-btn:hover {
  background: #005fa3 !important;
}
.btn-delete {
  background: #ff6b6b;
  color: white;
}
.empty-preview {
  color: #bbb;
  font-style: italic;
}
.edit-title-input {
  font-size: 20px;
  padding: 4px 10px;
  border: 2px solid #0077cc;
  border-radius: 6px;
  margin-right: 8px;
  min-width: 180px;
}
.edit-title-btn {
  background: #0077cc;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 4px 14px;
  margin-right: 6px;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;
}
.edit-title-btn.cancel {
  background: #bbb;
  color: #222;
}
.edit-title-btn:hover {
  background: #005fa3;
}
</style>