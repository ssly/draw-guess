<template>
  <div id="app">
    <board></board>
  </div>
</template>

<script>
// import Hello from './components/Hello'
import Board from './components/Board'

export default {
  name: 'app',
  components: {
    Board
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
