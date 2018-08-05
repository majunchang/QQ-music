<template>
  <div id="app"> 
    <musicHeader></musicHeader>
    <router-view/>
  </div>
</template>

<script>
import musicHeader from './components/musicHeader.vue'

export default {
  name: 'App',
  components: {
    musicHeader
  },
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>

<style >
div{
  margin: 0;
  padding: 0;
}
body,html{
  margin: 0;
  padding: 0;
}
/* #app{
  width: 80%;
  margin-left: 10%;
} */

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-width: 1250px;
}
</style>
