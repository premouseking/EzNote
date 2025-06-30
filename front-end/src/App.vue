<template>

  <div id="app">
    <router-view/>
  </div>

</template>

<script>
import 'element-plus/dist/index.css'
export default {
  name: 'App',
   created() {
    // 临时注释掉登录检查，用于测试主页面
    // const token = localStorage.getItem('token')
    // if (!token && this.$route.path !== '/login' && this.$route.path !== '/register') {
    //   this.$router.push('/login')
    // }
  }
  }

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body{
    margin: 0px;
    overflow-x: hidden;
  }
</style>
