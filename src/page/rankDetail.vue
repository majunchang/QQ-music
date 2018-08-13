<template>
    <div class="singerDetail-box">
      
        <div class="singerDetail">
            <div class="singerDetail-singerInfo">
                <div class="sd-left">
                    <img :src="avatar" alt="">
                </div>
                <div class="sd-right">
                    <h1>{{topListName}}</h1>
                    <p class="brife">个人简介:&nbsp;......</p>
                    <p class='single'>单曲&nbsp;
                      <span class="totalSong">
                      {{totalSong}}
                      </span></p>
                </div>
            </div>
            <div class="singerDetail-list">
                  <h1> 单曲&nbsp;{{totalSong}}</h1>
                  <ul class='songlist_header'>
                    <li class="songlist_header_li">
                      <div class="li-index"></div>
                      <div class="header-song">歌曲</div>
                      <div class="header-album">专辑</div>
                      <div class="header-duration">时长</div>
                    </li>
                    <div class="songlist_table">
                       <li v-for="(item,index) in pageSong"  @click='selectSong(item)' :key='index' :class="[index%2===0?'li-even':'li-odd']">
                      <div class="li-index">{{item.index}}</div>
                      <div class="header-song">{{item.name}}</div>
                      <div class="header-album">{{item.album}}</div>
                      <div class="header-duration">{{item.duration}}</div>
                    </li>
                    </div>
                  </ul>
                    <Page :total="100" @on-change='pageChange'/>
            </div>
        </div>
    
    </div>
</template>

<script>
import {getTopMUsicList} from '../api/rank.js'
import { createSong } from '../utils/song.js'

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      singerId: '',
      songs: [],
      bgImage: '',
      avatar: '',
      topListName: '',
      totalSong: '',
      pageSong: [],
      pageNum: 10,
      brief: ''
    }
  },
  created () {
    if (!this.$root.rankSongId) {
      this.$router.back()
    } else {
      let rankId = this.$root.rankSongId
      this.getTopMUsicList(rankId)
    }
  },
  mounted () {

  },
  methods: {
    getTopMUsicList (rankId) {
      getTopMUsicList(rankId).then((res) => {
        console.log(res)
        this.songs = this.normalizeSongs(res.songlist)
        this.topListName = res.topinfo.ListName
        this.totalSong = res.total_song_num
        this.brief = res.topinfo.info
        this.avatar = res.topinfo.pic
        this.pageSong = this.songs.slice(0, this.pageNum)
      })
    },
    normalizeSongs (list) {
      let ret = []
      list.forEach((musicData, index) => {
        // 对象的解构赋值 等同于 var musicData = item.musicData
        if (musicData.data.songid && musicData.data.albummid) {
          musicData.index = index
          ret.push(createSong(musicData.data))
        }
      })
      return ret
    },
    pageChange (current) {
      let startNum = (current - 1) * this.pageNum - 1
      if (current === 1) {
        startNum = 0
      }
      this.pageSong = this.songs.slice(startNum, this.pageNum + startNum)
    },
    selectSong (item) {
      this.$root.selectSong = item
      //  判断一下  songArr中 是否存在这个selectSong
      let songArr = this.$root.palyedSongArr
      let findRes = songArr.find((song) => {
        return song.name === item.name
      })
      if (findRes) {
        let findIndex = songArr.findIndex((song, index) => {
          return song.name === item.name
        })
        songArr.splice(findIndex, 1)
      }
      songArr.unshift(item)
      if (songArr.length > 8) {
        songArr.pop()
      }
      // 跳转到播放音乐页面
      this.$router.push({
        paht: '/player',
        name: 'player'
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.singerDetail-box{
  background: url('https://y.gtimg.cn/mediastyle/yqq/img/bg_detail.jpg') 50% 0px repeat-x;
}
.singerDetail {
    width: 80%;
    margin-left: 10%;
}
.singerDetail-singerInfo{
  overflow: hidden;
  padding: 45px 0;

}
.sd-left,.sd-right{
  float: left;
}
.sd-left img{
  width: 250px;
  height: 250px;
  border-radius: 50%;
  border-style: none;
}
.sd-right{
  float: left;
    margin-left: 88px;
    margin-top: 35px;
    text-align: left;
}
.sd-right h1{
      font-size: 38px;
    font-weight: 500;
}
p.brife {
    margin: 17px 0;
    font-size: 18px;
    font-weight: 400;
}
p.single {
    font-size: 16px;
    font-weight: 500;
}
span.totalSong {
    font-size: 26px;
}
.songlist__header_name, .songlist__songname {
    float: left;
    width: 47.685185%;
    position: relative;
    white-space: normal;
}
.singerDetail-list{
  text-align: left;
}
.songlist__header {
    height: 50px;
    line-height: 50px;
    background-color: #fbfbfd;
    color: #999;
}
.singerDetail-list  li{
    list-style: none;
    display: flex;
    height: 50px;
    cursor: pointer;
}
.songlist_table{
  margin-bottom: 30px;
}
.songlist_table  li:hover{
   color: #31c27c;
}
.songlist_header_li{
background-color: #fbfbfd;
color: #999;
}
.header-song,.header-album,.header-duration{
    display: inline-block;
    flex: 1;
    line-height: 50px;
    font-size: 14px;
    font-weight: 500;
}
.header-song{
  text-align: left;
  padding-left: 20px;
}
.header-album{
  text-align: center;
}
.header-duration{
  text-align: right;
  padding-right: 20px;
}

.li-even{
  background-color: #ffffff;
}
.li-odd{
  background-color: #fbfbfd;
}
.li-index{
    display: inline-block;
    line-height: 50px;
    text-align: center;
    width: 50px;
    font-size: 14px;
    color: #999;
}
ul.ivu-page{
  margin-bottom: 50px;
  text-align: center;
}
</style>
