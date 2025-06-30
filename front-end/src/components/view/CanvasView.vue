<template>
  <CanvasApp :noteId="noteId" @back="goBack" />
</template>

<script setup>
import CanvasApp from '@/components/Canvas/CanvasApp.vue'
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()

const noteId = computed(() => {
  console.log('CanvasView noteId:', route.params.id)
  return route.params.id
})

function goBack() {
  router.push('/canvas')
}
</script>