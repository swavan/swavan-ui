<template>
  <div id="App">
    <navigator />
    <router-view></router-view>
  </div>
</template>
<script>

import navigator from '../components/navigator.vue'
export default {
  name: 'App',
  components: { navigator },
}
</script>

<style>
#App {
  min-width: 500px;
  height: 400px;
}
</style>
