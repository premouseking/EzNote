import { ref, computed } from 'vue'

// 模拟笔记数据
const allNotes = ref([
  {
    id: 1,
    title: '示例笔记1',
    content: '这是第一个示例笔记的内容',
    isFavorite: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 2,
    title: '示例笔记2',
    content: '这是第二个示例笔记的内容',
    isFavorite: true,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  }
])

const currentNote = ref(null)
const searchQuery = ref('')

// 计算属性
const notes = computed(() => {
  if (!searchQuery.value) {
    return allNotes.value
  }
  return allNotes.value.filter(note => 
    note.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

let nextId = 3

export function useNotesStore() {
  const createNote = () => {
    const newNote = {
      id: nextId++,
      title: `新笔记 ${new Date().toLocaleDateString()}`,
      content: '',
      isFavorite: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    allNotes.value.unshift(newNote)
    currentNote.value = newNote
    return newNote
  }

  const selectNote = (id) => {
    const note = allNotes.value.find(n => n.id === id)
    if (note) {
      currentNote.value = note
    }
  }

  const deleteNote = (id) => {
    const index = allNotes.value.findIndex(n => n.id === id)
    if (index !== -1) {
      allNotes.value.splice(index, 1)
      if (currentNote.value && currentNote.value.id === id) {
        currentNote.value = allNotes.value.length > 0 ? allNotes.value[0] : null
      }
    }
  }

  const updateNote = (id, updates) => {
    const note = allNotes.value.find(n => n.id === id)
    if (note) {
      Object.assign(note, updates, { updatedAt: new Date() })
      if (currentNote.value && currentNote.value.id === id) {
        Object.assign(currentNote.value, updates, { updatedAt: new Date() })
      }
    }
  }

  const toggleFavorite = (id) => {
    const note = allNotes.value.find(n => n.id === id)
    if (note) {
      note.isFavorite = !note.isFavorite
      note.updatedAt = new Date()
      if (currentNote.value && currentNote.value.id === id) {
        currentNote.value.isFavorite = note.isFavorite
        currentNote.value.updatedAt = note.updatedAt
      }
    }
  }

  const searchNotes = (query) => {
    searchQuery.value = query
  }

  return {
    allNotes,
    notes,
    currentNote,
    searchQuery,
    createNote,
    selectNote,
    deleteNote,
    updateNote,
    toggleFavorite,
    searchNotes
  }
}
