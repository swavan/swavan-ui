<template>
  <div id="App">
    <navigator />
    <router-view></router-view>
  </div>
</template>
<script>

import navigator from '../components/navigator'
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
