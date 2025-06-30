<template>
  <div class="app-container">
    <NotesSidebar
      :notes="notes"
      @create="createNewNote"
      @select="selectNote"
      @delete="deleteNote"
      @favorite="toggleFavorite"
      @search="searchNotes"
      @view="openCanvas"
    />
    <NotePreview
      v-if="currentNote"
      :note="currentNote"
      @edit="editNote"
      @view="openCanvas"
      @delete="deleteNote"
    />
  </div>
</template>

<script setup>
import NotesSidebar from '../components/NotesSidebar.vue'
import NotePreview from '../components/NotePreview.vue'
import { useNotesStore } from '../stores/notes'
import { useActivitiesStore } from '../stores/activities'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

const notesStore = useNotesStore()
const activitiesStore = useActivitiesStore()
const router = useRouter()
const emit = defineEmits(['openCanvas'])

const { notes, currentNote } = storeToRefs(notesStore)

function createNewNote() {
  const note = notesStore.createNote()
  activitiesStore.addActivity('创建笔记', note.title)
  router.push(`/canvas/${note.id}`)
}
function selectNote(id) {
  console.log('selectNote called, id:', id)
  notesStore.selectNote(id)
}
function deleteNote(id) {
  const note = notesStore.allNotes.find(n => n.id === id)
  notesStore.deleteNote(id)
  activitiesStore.addActivity('删除笔记', note?.title)
}
function toggleFavorite(id) {
  console.log('view toggleFavorite', id)
  notesStore.toggleFavorite(id)
  const note = notesStore.allNotes.find(n => n.id === id)
  activitiesStore.addActivity(note.isFavorite ? '收藏笔记' : '取消收藏', note.title)
}
function editNote(id, newTitle) {
  const note = notesStore.allNotes.find(n => n.id === id)
  notesStore.updateNote(id, { title: newTitle })
  activitiesStore.addActivity('重命名笔记', `${note.title} → ${newTitle}`)
}
function searchNotes(query) {
  notesStore.searchNotes(query)
}
function openCanvas(id) {
  console.log('openCanvas called with id:', id)
  router.push(`/canvas/${id}`)
}
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 30px;
  height: 100vh;
  box-sizing: border-box;
}
</style>