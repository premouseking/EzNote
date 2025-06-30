import { defineStore } from 'pinia'

export const useNotesStore = defineStore('notes', {
  state: () => {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || []
    // 如果没有保存的数据，创建一些测试数据
    if (savedNotes.length === 0) {
      const testNotes = [
        {
          id: '1',
          title: '我的第一个画布',
          imageData: '',
          textBoxes: [
            {
              id: '1-1',
              x: 100,
              y: 100,
              width: 200,
              height: 120,
              title: '欢迎使用',
              content: '这是一个测试笔记块，你可以在这里编辑内容。',
              mediaContent: ''
            }
          ],
          isFavorite: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          title: '项目计划',
          imageData: '',
          textBoxes: [
            {
              id: '2-1',
              x: 150,
              y: 150,
              width: 250,
              height: 150,
              title: '项目目标',
              content: '1. 完成前端开发\n2. 测试功能\n3. 部署上线',
              mediaContent: ''
            }
          ],
          isFavorite: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
      localStorage.setItem('notes', JSON.stringify(testNotes))
      return {
        allNotes: testNotes,
        searchQuery: '',
        currentNoteId: '1',
      }
    }
    return {
      allNotes: savedNotes,
      searchQuery: '',
      currentNoteId: savedNotes[0]?.id || null,
    }
  },
  getters: {
    notes(state) {
      if (!state.searchQuery.trim()) return state.allNotes;
      const lowerQuery = state.searchQuery.toLowerCase();
      return state.allNotes.filter(note => {
        if (note.title && note.title.toLowerCase().includes(lowerQuery)) return true;
        if (note.textBoxes && note.textBoxes.some(tb =>
          (tb.title && tb.title.toLowerCase().includes(lowerQuery)) ||
          (tb.content && tb.content.toLowerCase().includes(lowerQuery))
        )) return true;
        return false;
      });
    },
    currentNote(state) {
      return state.allNotes.find(n => n.id == state.currentNoteId) || null;
    },
    favoriteCount(state) {
      return state.allNotes.filter(n => n.isFavorite).length;
    }
  },
  actions: {
    saveNotes() {
      localStorage.setItem('notes', JSON.stringify(this.allNotes));
    },
    createNote() {
      const newNote = {
        id: Date.now().toString(),
        title: '新画布',
        imageData: '',
        textBoxes: [],
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.allNotes.unshift(newNote);
      this.currentNoteId = newNote.id;
      this.saveNotes();
      return newNote;
    },
    selectNote(id) {
      this.currentNoteId = id;
    },
    deleteNote(id) {
      const idx = this.allNotes.findIndex(n => n.id === id);
      if (idx !== -1) {
        this.allNotes.splice(idx, 1);
        if (this.currentNoteId === id) {
          this.currentNoteId = this.allNotes[0]?.id || null;
        }
        this.saveNotes();
      }
    },
    toggleFavorite(id) {
      const note = this.allNotes.find(n => n.id === id);
      if (note) {
        note.isFavorite = !note.isFavorite;
        this.saveNotes();
        console.log('store toggleFavorite', id, note.isFavorite)
      }
    },
    updateNote(id, data) {
      const note = this.allNotes.find(n => n.id === id);
      if (note) {
        Object.assign(note, data);
        note.updatedAt = new Date().toISOString();
        this.saveNotes();
      }
    },
    searchNotes(query) {
      this.searchQuery = query;
      // 自动修正 currentNoteId
      const filtered = this.notes;
      if (!filtered.find(n => n.id == this.currentNoteId)) {
        this.currentNoteId = filtered[0]?.id || null;
      }
    }
  }
})