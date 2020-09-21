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
    margin: 10px 50px;
    height: 100%;
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
    padding-bottom: 5px;
  }
}
</style>
