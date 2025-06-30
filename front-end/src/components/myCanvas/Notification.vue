<template>
  <div v-if="show" :class="['notification', {error: isError, show: show}]">
    <span>{{ message }}</span>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import emitter from '../../eventBus'

const show = ref(false)
const message = ref('')
const isError = ref(false)
let timer = null

function notify(msg, error = false) {
  message.value = msg
  isError.value = error
  show.value = true
  clearTimeout(timer)
  timer = setTimeout(() => show.value = false, 2000)
}

onMounted(() => {
  emitter.on('notify', notify)
})
onUnmounted(() => {
  emitter.off('notify', notify)
})
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  background-color: #4CAF50;
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  transform: translateX(120%);
  transition: transform 0.3s ease;
}
.notification.show {
  transform: translateX(0);
}
.notification.error {
  background-color: var(--error-color);
}
</style>