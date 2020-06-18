<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import('./assets/scss/reset.css');
import('./assets/scss/base.scss');
import('./assets/scss/layout.scss');
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
