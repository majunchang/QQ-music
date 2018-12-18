<template>
  <div>
    <h1>这是rankdetail页面</h1>
  </div>
</template>

<script>
import { getTopMUsicList } from '../api/rank.js';
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted () {
    this.getTopList()
  },
  methods: {
    getTopList () {
      let Rankid = this.$root.rankSongId
      if (!Rankid) {
        this.$router.goBack()
      }
      getTopMUsicList(Rankid).then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
