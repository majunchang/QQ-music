<template>
  <div>
    <p class="returnBack" @click="gotoBack">返回</p>
  </div>
</template>

<script>
export default {
  name: 'returnBack',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted () {},
  methods: {
    gotoBack () {
      this.$emit('returnBackprop')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.returnBack {
  display: inline-block;
  color: #31c27c;
  padding: 20px;
  font-size: 22px;
  position: absolute;
  left: 0;
  margin-left: 15px;
  cursor: pointer;
}
.returnBack:hover {
  color: #31c27c;
}
</style>
