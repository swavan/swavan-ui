<template>
  <div id="App">
    <navigator />
    <router-view></router-view>
  </div>
</template>
<script>

import navigator from '../components/navigator.vue'
export default {
  created(){
    document.title="SwaVan"
  },
  name: 'App',
  components: { navigator },
}
</script>

<style>
#App {
  min-width: 500px;
  min-height: 500px;
}

@media only screen and (min-width: 601px) {
  #App {
    height: 100%;
  }
}
</style>
