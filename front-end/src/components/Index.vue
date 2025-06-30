<template>
  <div>
    <Header class="navbar"/>
    <main>
      <router-view/>
    </main>
  </div>
</template>

<script setup>
import Header from './common/Header.vue';
</script>


<style>
:root {
  --primary-color: #ffffff;
  --secondary-color: #f8f9ff;
  --accent-color: #66c2ff;
  --text-color: #2c3e50;
  --border-color: rgba(102, 194, 255, 0.2);
  --shadow-color: rgba(0, 0, 0, 0.1);
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

main {
  padding-top: 120px; /* 为固定导航栏留出空间 */
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  justify-content: center;
  padding-left: 20px;
  padding-right: 20px;
}
</style>