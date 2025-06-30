<template>
  <div class="media-dialog" v-if="show" @click.self="close">
    <div class="media-dialog-content">
      <div class="media-dialog-header">
        <h3>插入多媒体</h3>
        <button class="close-btn" @click="close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="media-dialog-body">
        <div class="media-tabs">
          <button class="tab-btn" :class="{active: activeTab === 'image'}" @click="activeTab = 'image'">图片</button>
          <button class="tab-btn" :class="{active: activeTab === 'video'}" @click="activeTab = 'video'">视频</button>
        </div>
        <div class="tab-content">
          <div class="tab-pane" :class="{active: activeTab === 'image'}">
            <div class="input-group">
              <label>图片URL:</label>
              <input type="url" v-model="imageUrl" placeholder="请输入图片链接">
            </div>
            <div class="input-group">
              <label>或上传图片:</label>
              <input type="file" @change="onFileChange" accept="image/*">
            </div>
            <div class="preview" v-if="previewSrc">
              <img :src="previewSrc" alt="预览">
            </div>
          </div>
          <div class="tab-pane" :class="{active: activeTab === 'video'}">
            <div class="input-group">
              <label>视频URL:</label>
              <input type="url" v-model="videoUrl" placeholder="请输入视频链接">
            </div>
             <div class="input-group">
              <label>或上传视频:</label>
              <input type="file" @change="onFileChange" accept="video/*">
            </div>
            <div class="preview" v-if="previewSrc">
              <video controls :src="previewSrc"></video>
            </div>
          </div>
        </div>
      </div>
      <div class="media-dialog-footer">
        <button class="btn-cancel" @click="close">取消</button>
        <button class="btn-insert" @click="insertMedia">插入</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean
})
const emit = defineEmits(['close', 'insert'])

const activeTab = ref('image')
const imageUrl = ref('')
const videoUrl = ref('')
const previewSrc = ref('')
let file = null

watch(() => props.show, (newVal) => {
  if (newVal) {
    // Reset state when dialog opens
    activeTab.value = 'image'
    imageUrl.value = ''
    videoUrl.value = ''
    previewSrc.value = ''
    file = null
  }
})

function onFileChange(e) {
  file = e.target.files[0]
  if (file) {
    previewSrc.value = URL.createObjectURL(file)
  }
}

function insertMedia() {
  let mediaHtml = ''
  let src = ''

  if (activeTab.value === 'image') {
    src = imageUrl.value || (file ? previewSrc.value : '')
    if (src) {
      mediaHtml = `<div class="media-item"><img src="${src}" alt="图片"><button class="remove-media" onclick="this.parentElement.remove()">&times;</button></div>`
    }
  } else {
    src = videoUrl.value || (file ? previewSrc.value : '')
    if (src) {
      mediaHtml = `<div class="media-item"><video controls src="${src}"></video><button class="remove-media" onclick="this.parentElement.remove()">&times;</button></div>`
    }
  }
  
  if (mediaHtml) {
    emit('insert', mediaHtml)
  }
  close()
}

function close() {
  emit('close')
}
</script>

<style scoped>
.media-dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}
.media-dialog-content {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    overflow: hidden;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
}
.media-dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #E5E7EB;
}
.media-dialog-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #111827;
}
.close-btn {
    width: 32px;
    height: 32px;
    background: #F3F4F6;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6B7280;
    transition: all 0.2s ease;
}
.close-btn:hover {
    background: #E5E7EB;
    color: #374151;
}
.media-dialog-body {
    padding: 20px;
    overflow-y: auto;
    flex-grow: 1;
}
.media-tabs {
    display: flex;
    border-bottom: 1px solid #E5E7EB;
    margin-bottom: 20px;
}
.tab-btn {
    padding: 10px 20px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    color: #6B7280;
    border-bottom: 2px solid transparent;
    transition: all 0.2s ease;
}
.tab-btn.active {
    color: #4F46E5;
    border-bottom-color: #4F46E5;
}
.tab-btn:hover {
    color: #374151;
}
.tab-pane {
    display: none;
}
.tab-pane.active {
    display: block;
}
.input-group {
    margin-bottom: 16px;
}
.input-group label {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
}
.input-group input {
    width: 95%;
    padding: 8px 12px;
    border: 1px solid #D1D5DB;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.2s ease;
}
.input-group input:focus {
    outline: none;
    border-color: #4F46E5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}
.preview {
    margin-top: 12px;
    padding: 12px;
    background: #F9FAFB;
    border: 1px solid #E5E7EB;
    border-radius: 6px;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.preview img,
.preview video {
    max-width: 100%;
    max-height: 120px;
    border-radius: 4px;
}
.media-dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 20px;
    border-top: 1px solid #E5E7EB;
    background: #F9FAFB;
}
.btn-cancel,
.btn-insert {
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}
.btn-cancel {
    background: #F3F4F6;
    border: 1px solid #D1D5DB;
    color: #374151;
}
.btn-cancel:hover {
    background: #E5E7EB;
}
.btn-insert {
    background: #4F46E5;
    border: 1px solid #4F46E5;
    color: white;
}
.btn-insert:hover {
    background: #4338CA;
}
.remove-media {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 20px;
    height: 20px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    opacity: 0;
    transition: opacity 0.2s ease;
}
.media-item:hover .remove-media {
    opacity: 1;
}
</style> 