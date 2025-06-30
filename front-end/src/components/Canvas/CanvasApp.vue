<template>
  <div class="infinite-canvas-container" ref="canvasContainer">
    <div class="favorite-badge" v-if="note.isFavorite">
      <i class="fas fa-star"></i> 已收藏
    </div>
    <div class="canvas-controls" :style="{ pointerEvents: showInstruction ? 'none' : 'auto', opacity: showInstruction ? 0.5 : 1 }">
      <button class="control-btn" @click="zoomIn" title="放大">
        <i class="fas fa-search-plus"></i>
      </button>
      <button class="control-btn" @click="zoomOut" title="缩小">
        <i class="fas fa-search-minus"></i>
      </button>
      <button class="control-btn" @click="resetView" title="重置视图">
        <i class="fas fa-crosshairs"></i>
      </button>
      <button class="control-btn" @click="addTextBox" title="添加笔记">
        <i class="fas fa-font"></i>
      </button>
      <button class="control-btn" @click="clearCanvas" title="清空画布">
        <i class="fas fa-trash-alt"></i>
      </button>
      <button
        class="control-btn"
        :class="{'is-favorite': note.isFavorite}"
        @click="toggleFavorite"
        title="收藏画布"
      >
        <i class="fas fa-star"></i>
      </button>
    </div>
    <canvas ref="canvas" id="infinite-canvas" :style="{ pointerEvents: showInstruction ? 'none' : 'auto', opacity: showInstruction ? 0.5 : 1 }"></canvas>
    <canvas ref="gridCanvas" class="canvas-grid" :style="{ pointerEvents: showInstruction ? 'none' : 'auto', opacity: showInstruction ? 0.5 : 1 }"></canvas>
    <div id="text-boxes-container" :style="Object.assign({ pointerEvents: showInstruction ? 'none' : 'auto', opacity: showInstruction ? 0.5 : 1 }, textBoxesContainerStyle)">
      <TextBox
        v-for="tb in textBoxes"
        :key="tb.id"
        :modelValue="tb"
        :scale="viewState.scale"
        @update:modelValue="updateTextBox($event, tb.id)"
        @delete="deleteTextBox(tb.id)"
        @open-media-dialog="openMediaDialog"
      />
    </div>
    <div class="canvas-instruction" v-if="showInstruction" style="opacity:1; pointer-events:auto;">
      <h3>无限画布使用指南</h3>
      <p>这是一个可以无限延展的画布空间</p>
      <ul>
        <li><i class="fas fa-mouse-pointer"></i> 拖动画布进行平移</li>
        <li><i class="fas fa-mouse"></i> 使用滚轮缩放视图</li>
        <li><i class="fas fa-plus-circle"></i> 使用左上角控制按钮操作</li>
        <li><i class="fas fa-font"></i> 添加文本框并自由编辑</li>
        <li><i class="fas fa-expand-arrows-alt"></i> 画布可无限延展</li>
      </ul>
      <button class="nav-btn" @click="closeInstruction" style="margin-top: 15px;">
        <i class="fas fa-check"></i> 开始使用
      </button>
    </div>
    <div style="position: absolute; top: 20px; right: 20px; display: flex; gap: 10px; z-index: 10; background: rgba(255, 255, 255, 0.85); padding: 10px; border-radius: 30px; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);">
      <div style="display: flex; align-items: center; gap: 5px;">
        <input type="text" v-model="localTitle" placeholder="画布标题"
          style="padding: 8px 15px; border: 2px solid black; border-radius: 30px; background: transparent; font-size: 16px; min-width: 200px;">
      </div>
      <button class="btn" @click="saveCanvas" style="border-radius: 30px;">
        <i class="fas fa-save"></i> 保存
      </button>
      <button class="btn" @click="$emit('back')" style="border-radius: 30px; background: #ff6b6b;">
        <i class="fas fa-arrow-left"></i> 返回
      </button>
    </div>
    <MediaDialog 
      :show="isMediaDialogOpen" 
      @close="isMediaDialogOpen = false"
      @insert="insertMedia"
    />
    <div class="zoom-indicator">
      <i class="fas fa-search"></i>
      <span>{{ zoomPercent }}%</span>
      <input type="range" min="10" max="300" :value="zoomPercent" class="zoom-slider" @input="onZoomSlider" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, watchEffect, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import TextBox from './TextBox.vue'
import MediaDialog from '../myProfile/MediaDialog.vue'
import emitter from '../../eventBus'

const props = defineProps({
  noteId: String
})
const emit = defineEmits(['back'])

const store = useStore()
const note = computed(() => store.getters['notes/allNotes'].find(n => n.id === props.noteId) || {})
const textBoxes = ref([])
const showInstruction = ref(true)
const localTitle = ref('')

const viewState = reactive({
  x: 0,
  y: 0,
  scale: 1,
  isDragging: false,
  dragStartX: 0,
  dragStartY: 0,
  initialX: 0,
  initialY: 0
})

const canvas = ref(null)
const gridCanvas = ref(null)
const canvasContainer = ref(null)

const isMediaDialogOpen = ref(false)
const currentEditingBoxId = ref(null)

const zoomPercent = computed(() => Math.round(viewState.scale * 100));

function initCanvas() {
  if (!canvasContainer.value) return
  canvas.value.width = canvasContainer.value.offsetWidth
  canvas.value.height = canvasContainer.value.offsetHeight
  gridCanvas.value.width = canvasContainer.value.offsetWidth
  gridCanvas.value.height = canvasContainer.value.offsetHeight
  viewState.x = canvas.value.width / 2
  viewState.y = canvas.value.height / 2
  viewState.scale = 1
  updateCanvasView()
}

function renderCanvas() {
  const ctx = canvas.value.getContext('2d')
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
}

function drawGrid() {
  const gridCtx = gridCanvas.value.getContext('2d')
  const gridSize = 20 * viewState.scale
  const offsetX = ((viewState.x % gridSize) + gridSize) % gridSize;
  const offsetY = ((viewState.y % gridSize) + gridSize) % gridSize;
  gridCtx.clearRect(0, 0, gridCanvas.value.width, gridCanvas.value.height)
  gridCtx.strokeStyle = 'rgba(179, 224, 255, 0.5)'
  gridCtx.lineWidth = 1
  for (let x = offsetX; x < gridCanvas.value.width; x += gridSize) {
    gridCtx.beginPath()
    gridCtx.moveTo(x, 0)
    gridCtx.lineTo(x, gridCanvas.value.height)
    gridCtx.stroke()
  }
  for (let y = offsetY; y < gridCanvas.value.height; y += gridSize) {
    gridCtx.beginPath()
    gridCtx.moveTo(0, y)
    gridCtx.lineTo(gridCanvas.value.width, y)
    gridCtx.stroke()
  }
}

const textBoxesContainerStyle = computed(() => ({
  transform: `translate(${viewState.x}px, ${viewState.y}px) scale(${viewState.scale})`
}))

function updateCanvasView() {
  renderCanvas()
  drawGrid()
}

function setupCanvasEventListeners() {
  canvas.value.addEventListener('mousedown', (e) => {
    viewState.isDragging = true
    viewState.dragStartX = e.clientX
    viewState.dragStartY = e.clientY
    viewState.initialX = viewState.x
    viewState.initialY = viewState.y
    if (canvas.value && canvas.value.classList) {
      canvas.value.classList.add('dragging')
    }
  })
  document.addEventListener('mousemove', (e) => {
    if (viewState.isDragging) {
      viewState.x = viewState.initialX + (e.clientX - viewState.dragStartX)
      viewState.y = viewState.initialY + (e.clientY - viewState.dragStartY)
      updateCanvasView()
    }
  })
  document.addEventListener('mouseup', () => {
    viewState.isDragging = false
    if (canvas.value && canvas.value.classList) {
      canvas.value.classList.remove('dragging')
    }
  })
  canvasContainer.value.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomIntensity = 0.1;
    const wheel = e.deltaY < 0 ? 1 : -1;
    const zoom = Math.exp(wheel * zoomIntensity);
    const rect = canvasContainer.value.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const worldX = (centerX - viewState.x) / viewState.scale;
    const worldY = (centerY - viewState.y) / viewState.scale;
    viewState.scale *= zoom;
    viewState.scale = Math.max(0.1, Math.min(3, viewState.scale));
    viewState.x = centerX - worldX * viewState.scale;
    viewState.y = centerY - worldY * viewState.scale;
    updateCanvasView();
  }, { passive: false });
}

function zoomIn() {
  viewState.scale = Math.min(3, viewState.scale + 0.1)
  updateCanvasView()
}
function zoomOut() {
  viewState.scale = Math.max(0.1, viewState.scale - 0.1)
  updateCanvasView()
}
function resetView() {
  viewState.x = canvas.value.width / 2
  viewState.y = canvas.value.height / 2
  viewState.scale = 1
  updateCanvasView()
}
function onZoomSlider(e) {
  const percent = parseInt(e.target.value, 10);
  viewState.scale = percent / 100;
}

function addTextBox() {
  const newWidth = 200;
  const newHeight = 100;

  // 使用 canvas 的尺寸来计算可视范围的中心点
  const centerX = (canvas.value.width / 2 - viewState.x) / viewState.scale;
  const centerY = (canvas.value.height / 2 - viewState.y) / viewState.scale;

  textBoxes.value.push({
    id: Date.now().toString() + Math.floor(Math.random() * 10000),
    x: centerX - newWidth / 2,
    y: centerY - newHeight / 2,
    width: newWidth,
    height: 120, // 初始高度
    title: '无标题',
    content: '点击编辑文本...',
    mediaContent: ''
  })
}
function deleteTextBox(id) {
  const idx = textBoxes.value.findIndex(tb => tb.id === id)
  if (idx !== -1) textBoxes.value.splice(idx, 1)
}
function clearCanvas() {
  if (confirm('确定要清空画布上的所有内容吗？')) {
    textBoxes.value = []
  }
}

function toggleFavorite() {
  store.dispatch('notes/toggleFavorite', props.noteId)
  const updatedNote = store.getters['notes/allNotes'].find(n => n.id === props.noteId)
  store.dispatch('activities/addActivity', {
    action: updatedNote.isFavorite ? '收藏画布' : '取消收藏',
    noteTitle: updatedNote.title
  })
}

function saveCanvas() {
  store.dispatch('notes/updateNote', {
    id: props.noteId,
    data: { 
      title: localTitle.value,
      textBoxes: textBoxes.value 
    }
  })
  store.dispatch('activities/addActivity', {
    action: '更新画布',
    noteTitle: localTitle.value
  })
  emitter.emit('notify', '画布已保存')
}

function editTitle() {
  const newTitle = prompt('请输入新的画布标题', localTitle.value)
  if (newTitle && newTitle.trim()) {
    localTitle.value = newTitle.trim()
    store.dispatch('activities/addActivity', {
      action: '重命名画布',
      noteTitle: `${note.value.title} → ${newTitle}`
    })
  }
}

function updateTextBox(newVal, id) {
  const idx = textBoxes.value.findIndex(tb => tb.id === id)
  if (idx !== -1) {
    textBoxes.value[idx] = { ...newVal }
  }
}

function openMediaDialog(boxId) {
  isMediaDialogOpen.value = true
  currentEditingBoxId.value = boxId
}

function insertMedia(mediaHtml) {
  const box = textBoxes.value.find(tb => tb.id === currentEditingBoxId.value)
  if (box) {
    if (!box.mediaContent) {
      box.mediaContent = ''
    }
    box.mediaContent += mediaHtml
  }
}

// 监听note变化，同步标题到本地状态
watch(() => note.value.title, (newTitle) => {
  localTitle.value = newTitle || ''
}, { immediate: true })

// 监听noteId变化，同步标题和textBoxes
watch(() => props.noteId, (id) => {
  console.log('noteId changed:', id)
  const n = store.getters['notes/allNotes'].find(n => n.id === id)
  console.log('found note:', n)
  if (n) {
    localTitle.value = n.title || ''
    textBoxes.value = n.textBoxes ? n.textBoxes.map(tb => ({ ...tb })) : []
    console.log('synced title:', localTitle.value)
  } else {
    localTitle.value = ''
    textBoxes.value = []
    console.log('note not found, cleared title')
  }
}, { immediate: true })

// 监听本地标题变化，同步到store（添加防抖）
let titleUpdateTimeout = null
watch(localTitle, (newTitle) => {
  if (props.noteId && newTitle !== note.value.title) {
    // 清除之前的定时器
    if (titleUpdateTimeout) {
      clearTimeout(titleUpdateTimeout)
    }
    // 设置新的定时器，500ms后更新
    titleUpdateTimeout = setTimeout(() => {
      store.dispatch('notes/updateNote', {
        id: props.noteId,
        data: { title: newTitle }
      })
    }, 500)
  }
})

watch(textBoxes, (val) => {
  store.dispatch('notes/updateNote', {
    id: props.noteId,
    data: { textBoxes: val }
  })
}, { deep: true })

onMounted(() => {
  // 检查 localStorage 是否已看过指南
  if (localStorage.getItem('canvasGuideShown')) {
    showInstruction.value = false
  } else {
    showInstruction.value = true
  }
  initCanvas()
  setupCanvasEventListeners()
  window.addEventListener('resize', initCanvas)
})

function closeInstruction() {
  showInstruction.value = false
  localStorage.setItem('canvasGuideShown', '1')
}

onUnmounted(() => {
  // 清理定时器
  if (titleUpdateTimeout) {
    clearTimeout(titleUpdateTimeout)
  }
  // 清理事件监听器
  window.removeEventListener('resize', initCanvas)
})

watch(() => viewState.scale, updateCanvasView)
</script>

<style scoped>
.view-container {
  flex-grow: 1;
  background-color: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 12px var(--shadow-color);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
.profile-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.profile-header {
  text-align: center;
  margin-bottom: 30px;
}
.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #66c2ff, #b3e0ff);
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: white;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
  margin-top: 20px;
}
.stat-card {
  background: var(--primary-color);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 8px var(--shadow-color);
}
.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: var(--accent-color);
  margin-bottom: 10px;
}
.stat-label {
  font-size: 14px;
  color: var(--text-color);
  opacity: 0.8;
}
.canvas-controls {
  position: absolute;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 30px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
}
.control-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--primary-color);
  border: 2px solid rgb(10, 11, 11);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  color: var(--text-color);
  font-size: 18px;
}
.control-btn:hover, .control-btn.is-favorite {
  background: #0077cc !important;
  color: black !important;
  border-color: #005fa3;
}
.canvas-instruction {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 20px;
  border: 3px solid #000;
  padding: 56px 72px;
  z-index: 1000;
  text-align: center;
  min-width: 420px;
  max-width: 98vw;
  max-height: 88vh;
  overflow-y: auto;
}
.canvas-instruction h3 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
}
.canvas-instruction p {
  font-size: 18px;
  margin-bottom: 24px;
}
.canvas-instruction ul {
  text-align: left;
  margin: 32px auto 0 auto;
  padding-left: 0;
  max-width: 420px;
  font-size: 18px;
}
.canvas-instruction li {
  margin-bottom: 16px;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 10px;
}
.canvas-instruction button, .canvas-instruction .nav-btn {
  background: var(--primary-color);
  border: 2px solid #000;
  border-radius: 30px;
  padding: 12px 24px;
  font-size: 18px;
  font-weight: bold;
  color: black !important;
  opacity: 1 !important;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.canvas-instruction button:hover, .canvas-instruction .nav-btn:hover {
  background: #0077cc !important;
  color: black !important;
}
.infinite-canvas-container {
  position: relative;
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.favorite-badge {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #fbbf24;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
canvas, .canvas-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100% !important;
  height: 100% !important;
  display: block;
  z-index: 0;
  pointer-events: none;
}
#text-boxes-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: auto;
}
.zoom-indicator {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.85);
  padding: 10px;
  border-radius: 30px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}
.zoom-indicator i {
  font-size: 24px;
  color: var(--text-color);
}
.zoom-indicator span {
  font-size: 18px;
  color: var(--text-color);
}
.zoom-slider {
  width: 150px;
  height: 10px;
  background: transparent;
  border-radius: 5px;
  position: relative;
}
.zoom-slider::-webkit-slider-runnable-track {
  width: 100%;
  height: 10px;
  background: var(--primary-color);
  border-radius: 5px;
}
.zoom-slider::-webkit-slider-thumb {
  width: 20px;
  height: 20px;
  background: var(--accent-color);
  border-radius: 50%;
  cursor: pointer;
  -webkit-appearance: none;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}
.zoom-slider::-moz-range-track {
  width: 100%;
  height: 10px;
  background: var(--primary-color);
  border-radius: 5px;
}
.zoom-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: var(--accent-color);
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}
.zoom-slider::-ms-thumb {
  width: 20px;
  height: 20px;
  background: var(--accent-color);
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}
.zoom-slider::-ms-fill-lower,
.zoom-slider::-ms-fill-upper {
  background: var(--primary-color);
  border-radius: 5px;
}
.btn {
  background: var(--primary-color);
  border: 2px solid rgb(10, 11, 11);
  padding: 8px 16px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 6px;
}
.btn:hover {
  background: #0077cc !important;
  color: black !important;
  border-color: #005fa3;
}
</style>