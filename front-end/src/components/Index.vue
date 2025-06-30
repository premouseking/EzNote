<template>
  <div>
    <header class="navbar"></header>
    <router-view/>
  </div>
</template>

<script setup>
import Header from './common/Header.vue';
</script>


<style>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

</style>