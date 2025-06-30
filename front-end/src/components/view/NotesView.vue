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
import NotesSidebar from '../myCanvas/NotesSidebar.vue'
import NotePreview from '../myCanvas/NotePreview.vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const store = useStore()
const router = useRouter()
const emit = defineEmits(['openCanvas'])

// 使用Vuex的notes模块
const notes = computed(() => store.getters['notes/allNotes'])
const currentNote = computed(() => store.getters['notes/currentNote'])

async function createNewNote() {
  const note = await store.dispatch('notes/createNote')
  router.push(`/canvas/${note.id}`)
}

function selectNote(id) {
  console.log('selectNote called, id:', id)
  store.dispatch('notes/selectNote', id)
}

function deleteNote(id) {
  const note = notes.value.find(n => n.id === id)
  store.dispatch('notes/deleteNote', id)
}

function toggleFavorite(id) {
  console.log('view toggleFavorite', id)
  store.dispatch('notes/toggleFavorite', id)
}

function editNote(id, newTitle) {
  store.dispatch('notes/updateNote', { id, updates: { title: newTitle } })
}

function searchNotes(query) {
  store.dispatch('notes/searchNotes', query)
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