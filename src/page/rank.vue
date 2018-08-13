<template>
    <div>
        <div class="rankbox">
            <div class="rankContainer" v-for='(item,index) in rankArr' :key='index' @click='getTopMUsicList(item.id)'>
                <div class="single-rank">
                    <div class="rank-left">
                        <img :src="item.picUrl" alt="">
                    </div>
                    <div class="rank-right">
                        <div class="rankTopSong" v-for='(key,ind) in item.songList' :key='ind'>
                            {{ind+1}} &nbsp; &nbsp; &nbsp;{{key.songname}}---{{key.singername}}
                        </div>
                    </div>
                </div>
            </div>
    
        </div>
    </div>
</template>

<script>
import { getTopList } from '../api/rank.js'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      rankArr: []
    }
  },
  mounted () {
    this.getTopList()
  },
  methods: {
    getTopList () {
      getTopList().then((res) => {
        console.log(res)
        this.rankArr = res.data.topList
        console.log('打印一下')
        console.log(this.rankArr)
      })
    },
    getTopMUsicList (id) {
      this.$root.rankSongId = id
      this.$router.push({
        name: 'rankDetail',
        path: '/rankDetail'
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.rankbox {
    /* display: flex; */
    width: 80%;
    overflow: scroll;
    margin-left: 10%;
    text-align: center;
}

.rankContainer[data-v-1a483a23] {
    width: 50%;
    float: left;
    background: white;
}

.single-rank {
    float: left;
    flex: 1;
    width: 90%;
    background: rgba(0, 0, 0, 0.05);
    text-align: left;
    margin: 10px 20px;
    cursor: pointer;
}

.rank-left {
    display: inline-block;
    float: left;
}
.rank-left img{
  width: 180px;
}

.rank-right {
    display: inline-block;
    margin-left: 50px;
    /* width: 180px; */
    height: 180px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    line-height: 26px;
}

.single-rank:hover {
    color: #31c27c;
}

.rankTopSong {
    font-size: 14px;
    line-height: 60px;
    font-weight: 500;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 200px;
    /* line-height: 26px; */
}
</style>
