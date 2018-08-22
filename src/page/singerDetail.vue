<template>
<keep-alive>
 <div class="singerDetail-box">

        <div class="singerDetail">
           <ReturnBack @returnBackprop = 'returnBack'></ReturnBack>
            <div class="singerDetail-singerInfo">
                <div class="sd-left">
                    <img :src="avatar" alt="">
                </div>
                <div class="sd-right">
                    <h1>{{singerName}}</h1>
                    <p class="brife">个人简介:&nbsp;.......</p>
                    <p class='single'>单曲&nbsp;
                      <span class="totalSong">
                      {{totalSong}}
                      </span></p>
                </div>
            </div>
            <div class="singerDetail-list">
                  <h1> 单曲&nbsp;{{totalSong}}</h1>
                  <Button type="success" size='large' @click='maskAdd' style="marginRight:15px">批量增加</Button>
                  <Button type="success" size='large' @click='playAll'>播放本页全部</Button>
                  <ul class='songlist_header'>
                    <li class="songlist_header_li">
                      <div class="li-index"></div>
                       <Checkbox style='display:none'></Checkbox>
                      <div class="header-song">歌曲</div>
                      <div class="header-album">专辑</div>
                      <div class="header-duration">时长</div>
                      <div class="header-duration">操作</div>
                    </li>
                    <div class="songlist_table">
                       <li v-for="(item,index) in pageSong"   :key='index' :class="[index%2===0?'li-even':'li-odd']">
                     
                      <div class="li-index">{{item.index}}</div>
                       <Checkbox v-model="item.check" @click.stop.native="checkBoxSong(item)"></Checkbox>
                      <div class="header-song">{{item.name}}</div>
                      <div class="header-album">{{item.album}}</div>
                      <div class="header-duration">{{item.duration}}</div>
                      <div class="header-duration  playIcon" @click='selectSong(item)'>
                        <i class="iconfont icon-play1"></i>
                      </div>
                    </li>
                    </div>
                  </ul>
                    <Page :total="100" @on-change='pageChange'/>
            </div>
        </div>
    
    </div>
</keep-alive>
   
</template>

<script>
import { getSingerDetail } from '../api/singer.js'
import { createSong } from '../utils/song.js'
import ReturnBack from '../components/returnBack'
import './iview.css'

export default {
  name: 'HelloWorld',

  data () {
    return {
      singerId: '',
      songs: [],
      bgImage: '',
      avatar: '',
      singerName: '',
      totalSong: '',
      pageSong: [],
      pageNum: 10,
      massAddArr: []
    }
  },
  components: {
    ReturnBack
  },
  created () {
    if (!this.$root.selectSinger) {
      this.$router.push({
        name: 'recommend',
        path: '/recommend'
      })
      this.$router.back()
    } else {
      this.singerId = this.$root.selectSinger.id
      this.avatar = this.bgImage = this.$root.selectSinger.avatar
      this.getSingerDetail(this.singerId)
    }
  },
  mounted () {

  },
  methods: {
    returnBack () {
      this.$router.back()
    },
    getSingerDetail (singerId) {
      getSingerDetail(singerId).then((res) => {
        this.songs = this.normalizeSongs(res.data.list)
        this.singerName = res.data.singer_name
        this.totalSong = res.data.total
        this.pageSong = this.songs.slice(0, this.pageNum)
      })
    },
    normalizeSongs (list) {
      let ret = []
      list.forEach((item) => {
        // 对象的解构赋值 等同于 var musicData = item.musicData
        let { musicData } = item
        if (musicData.songid && musicData.albummid) {
          musicData.index = item.index
          musicData.check = false
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    pageChange (current) {
      let startNum = (current - 1) * this.pageNum
      if (current === 1) {
        startNum = 0
      }
      this.pageSong = this.songs.slice(startNum, this.pageNum + startNum)
    },
    checkBoxSong (item) {
      this.$nextTick(() => {
        let massAddArr = this.massAddArr
        if (item.check) {
          massAddArr.push(item)
        } else {
          let findIndex = massAddArr.findIndex((value, index) => {
            return value.name === item.name
          })
          massAddArr.splice(findIndex, 1)
        }
        this.massAddArr = massAddArr
      })
    },
    maskAdd () {
      let massAddArr = this.massAddArr
      if (massAddArr.length) {
        this.$root.palyedSongArr = this.removeRepeat(massAddArr.concat(...this.$root.palyedSongArr))
        this.$router.push({
          paht: '/player',
          name: 'player'
        })
      } else {
        this.$Message.warning('并未选择任何歌曲!')
      }
    },
    playAll () {
      // 合并数组的两种方法
      // this.$root.palyedSongArr = this.$root.palyedSongArr.concat(...this.pageSong)
      Array.prototype.unshift.apply(this.$root.palyedSongArr, this.pageSong)
      this.$root.palyedSongArr = this.removeRepeat(this.$root.palyedSongArr)
      this.$router.push({
        paht: '/player',
        name: 'player'
      })
    },
    removeRepeat (arr) {
      let result = []
      let obj = { }
      arr.forEach((item, index) => {
        if (!obj[item.name]) {
          obj[item.name] = 1
          result.push(item)
        }
      })
      return result
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
      // 跳转到播放音乐页面  打开新窗口

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
  max-width: 250px;
  max-height: 250px;
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
.songlist_table  li:hover .playIcon {
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
.songlist_header_li .header-song{
  padding-left: 40px;
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
