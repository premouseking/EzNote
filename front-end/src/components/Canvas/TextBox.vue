<template>
  <div
    class="square"
    :class="{ 
      'selected': isSelected,
      'dragging': isDragging
    }"
    :style="{ left: tb.x + 'px', top: tb.y + 'px', width: tb.width + 'px', zIndex: isDragging ? 200 : 100 }"
    @mousedown.stop="selectAndPrepareDrag"
    ref="box"
  >
    <div class="node-header">
      <div class="media-btn" @click.stop="openMediaDialog">
        <i class="fas fa-image"></i>
      </div>
    </div>
    <div
      class="node-title"
      contenteditable="true"
      ref="titleEl"
      @input="updateTitle"
    ></div>
    <hr class="node-divider" />
    <div
      class="node-text"
      contenteditable="true"
      ref="contentEl"
      @input="updateContent"
    ></div>
    <div class="node-media-container" v-html="tb.mediaContent"></div>
    <div class="resize-handle-right" @mousedown.stop="startResize"></div>
    <div class="delete-btn-outer" @click.stop="emitDelete">
      <i class="fas fa-times"></i>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: Object,
  scale: {
    type: Number,
    required: true
  }
})
const emit = defineEmits(['update:modelValue', 'delete', 'open-media-dialog'])

const tb = ref({ title: '无标题', ...props.modelValue })
const box = ref(null)
const titleEl = ref(null)
const contentEl = ref(null)

const isDragging = ref(false)
const isResizing = ref(false)
const isSelected = ref(false)

let initialX = 0, initialY = 0
let dragStartX = 0, dragStartY = 0
let startWidth = 0

function updateTitle(e) {
  tb.value.title = e.target.innerText
}

function updateContent(e) {
  tb.value.content = e.target.innerText
}

// 只在modelValue变化时手动同步DOM内容
watch(() => props.modelValue.title, (val) => {
  if (titleEl.value && document.activeElement !== titleEl.value) {
    titleEl.value.innerText = val || ''
  }
})
watch(() => props.modelValue.content, (val) => {
  if (contentEl.value && document.activeElement !== contentEl.value) {
    contentEl.value.innerText = val || ''
  }
})

onMounted(() => {
  if (titleEl.value) titleEl.value.innerText = tb.value.title || ''
  if (contentEl.value) contentEl.value.innerText = tb.value.content || ''
})

function selectAndPrepareDrag(e) {
  // Select the box
  isSelected.value = true
  document.querySelectorAll('.square.selected').forEach(el => {
    if (el && el.classList) el.classList.remove('selected')
  })
  if (box.value && box.value.classList) {
    box.value.classList.add('selected')
  }

  // Handle unselecting
  const unselectBox = (event) => {
    if (box.value && box.value.classList && box.value.contains && !box.value.contains(event.target)) {
      isSelected.value = false
      document.removeEventListener('mousedown', unselectBox)
    }
  }
  setTimeout(() => document.addEventListener('mousedown', unselectBox), 0)

  // Prepare for drag
  isDragging.value = true
  initialX = tb.value.x
  initialY = tb.value.y
  dragStartX = e.clientX
  dragStartY = e.clientY
  
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

function onDrag(e) {
  if (!isDragging.value) return
  const dx = (e.clientX - dragStartX) / props.scale
  const dy = (e.clientY - dragStartY) / props.scale
  tb.value.x = initialX + dx
  tb.value.y = initialY + dy
}

function stopDrag() {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

function startResize(e) {
  e.preventDefault()
  e.stopPropagation()
  isResizing.value = true
  startWidth = tb.value.width
  dragStartX = e.clientX

  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopResize)
}

function onResize(e) {
  if (!isResizing.value) return
  const speedFactor = 1.1; // 提升10%的灵敏度
  const dx = ((e.clientX - dragStartX) / props.scale) * speedFactor;
  tb.value.width = Math.max(100, startWidth + dx)
}

function stopResize() {
  isResizing.value = false
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
}

function emitDelete() {
  emit('delete')
}

function openMediaDialog() {
  emit('open-media-dialog', tb.value.id)
}

watch(tb, (newVal) => {
  emit('update:modelValue', newVal)
}, { deep: true })

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
})

</script>

<style scoped>
.square {
    position: absolute;
    padding: 12px;
    border: 3px solid #000;
    border-radius: 10px;
    transition: all 0.3s ease;
    cursor: grab;
    user-select: none;
    min-width: 100px;
    background: #fff;
    box-sizing: border-box;
    z-index: 100;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
.square:active {
    cursor: grabbing;
}
.square.selected {
    border-color: #4F46E5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.3);
}
.square.dragging {
    transition: none;
}
.node-title {
    font-size: 16px;
    font-weight: 600;
    line-height: 1.4;
    white-space: pre-wrap;
    outline: none;
    min-height: 22px;
    overflow-wrap: break-word;
    word-break: normal;
    margin-bottom: 8px;
    color: #111827;
}
.node-title:empty::before {
    content: "输入标题...";
    color: #9CA3AF;
    font-style: italic;
    font-weight: 500;
}
.node-text {
    font-size: 14px;
    line-height: 1.5;
    white-space: pre-wrap;
    outline: none;
    min-height: 21px;
    overflow-wrap: break-word;
    word-break: normal;
    flex-grow: 1;
    transition: border-color 0.2s ease;
}
.node-text:focus {
    border-color: #4F46E5;
}
.node-text:empty::before {
    content: "点击编辑文本...";
    color: #9CA3AF;
    font-style: italic;
}
.node-header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 8px;
}
.node-id {
    font-size: 12px;
    color: #6B7280;
    font-weight: 500;
}
.delete-btn-outer {
    position: absolute;
    top: -15px;
    right: -15px;
    width: 30px;
    height: 30px;
    background-color: #fff;
    border-radius: 50%;
    border: 2px solid #000;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 110;
    opacity: 0;
    transition: opacity 0.2s ease, background-color 0.2s, color 0.2s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
.delete-btn-outer:hover {
    background-color: #EF4444;
    color: #fff;
    border-color: #EF4444;
}
.square:hover .delete-btn-outer {
    opacity: 1;
}
.resize-handle-right {
    position: absolute;
    right: -4px;
    top: 10px;
    bottom: 10px;
    width: 8px;
    background: transparent;
    z-index: 105;
    opacity: 0;
    transition: opacity 0.2s ease;
    cursor: ew-resize;
}
.square:hover .resize-handle-right {
    opacity: 1;
}
.media-btn {
    width: 24px;
    height: 24px;
    background: #F3F4F6;
    border: 1px solid #D1D5DB;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 12px;
    color: #6B7280;
    transition: all 0.2s ease;
}
.media-btn:hover {
    background: #E5E7EB;
    color: #374151;
    transform: scale(1.05);
}
.node-media-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 100%;
}
.node-divider {
  border: none;
  border-top: 1.5px solid #e5e7eb;
  margin: 6px 0 10px 0;
}
</style>