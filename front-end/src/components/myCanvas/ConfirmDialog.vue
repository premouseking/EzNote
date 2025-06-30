<template>
  <div class="confirm-dialog-overlay" v-if="show">
    <div class="confirm-dialog">
      <p>{{ message }}</p>
      <div class="dialog-buttons">
        <button class="btn-confirm" @click="onConfirm">确认</button>
        <button class="btn-cancel" @click="onCancel">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import emitter from '../../eventBus';

const show = ref(false);
const message = ref('');
let confirmCallback = null;

const showDialog = (payload) => {
  message.value = payload.message;
  confirmCallback = payload.onConfirm;
  show.value = true;
};

const onConfirm = () => {
  if (confirmCallback) {
    confirmCallback();
  }
  show.value = false;
};

const onCancel = () => {
  show.value = false;
  confirmCallback = null;
};

onMounted(() => {
  emitter.on('show-confirm', showDialog);
});

onUnmounted(() => {
  emitter.off('show-confirm', showDialog);
});
</script>

<style scoped>
.confirm-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.confirm-dialog {
  background-color: white;
  padding: 30px 40px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 400px;
}

.confirm-dialog p {
  font-size: 18px;
  margin: 0 0 25px;
  color: var(--text-color);
}

.dialog-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.dialog-buttons button {
  padding: 10px 25px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-confirm {
  background-color: var(--accent-color);
  color: white;
}

.btn-confirm:hover {
  background-color: #005fa3;
}

.btn-cancel {
  background-color: #e5e7eb;
  color: var(--text-color);
}

.btn-cancel:hover {
  background-color: #d1d5db;
}
</style> 