<template>
  <div >
      <h1>播放歌曲页面</h1>
      <div class="player-container">
        <div class="background">
             <img :src="bgImage" alt="">
        </div>
        <div class="palyer-mainCon">
          <div class="player-left">
              <ul class='player-list'>
                    <li class="songlist_player_li">
                      <div class="li-index"></div>
                      <div class="player-song">歌曲</div>
                      <div class="player-album">歌手</div>
                      <div class="player-duration">时长</div>
                    </li>
                    <div class="songlist_table">
                       <li v-for="(item,index) in palyedSongArr"  :key='index' :class="[index%2===0?'li-even':'li-odd']">
                      <div class="li-index">{{index+1}}</div>
                      <div class="player-song">{{item.name}}</div>
                      <div class="player-album">{{item.singer}}</div>
                      <div class="player-duration">{{item.duration}}</div>
                    </li>
                    </div>
                  </ul>
          </div>
          <div class="player-right">
                <img :src="bgImage" alt="">
          </div>
            <!-- <audio :src="url" ref='audio' loop autoplay></audio> -->
        </div>
        <!-- 播放条 -->
        <div class="play-toolbar">
                <div class="play-part">
                <div class="icon">
                 <i class="iconfont icon-previous21"></i>
                 <i class="iconfont icon-play"></i>
                 <i class="iconfont icon-pause"></i>
                 <i class="iconfont icon-293-next2"></i>
                </div>

                 <div class="play-music">
                      <div class="song-time">
                          00:00 / 00:00 
                      </div>
                      <div class="progress-inner"></div>
                      <div class="progress-dot"></div>
                </div>

                  

                 </div>
                 <div class="other-part">
                     <i class="iconfont icon-love"></i>
                     <i class="iconfont icon-love"></i>
                     <i class="iconfont icon-love"></i>
                 </div>
                    
        </div>

      </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      selectSong: {},
      palyedSongArr: [],
      bgImage: '',
      url: ''
    }
  },
  mounted () {
    this.selectSong = this.$root.selectSong
    this.palyedSongArr = this.$root.palyedSongArr
    this.bgImage = this.selectSong.image
    this.url = this.selectSong.url
    console.log(this.$root.selectSong)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .player-container{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background-color: rgb(78, 29, 30);
    color: white;
  }
  .background{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.6;
    -webkit-filter: blur(65px);
    filter: blur(65px);
  }
  .background img{
    width: 100%;
    height: 100%;
  }
.palyer-mainCon{
    margin: 100px;
    width: 80%;
    margin-left: 10%;
    overflow: hidden;
}
.player-left{
    float: left;
    width: 70%;
}
.player-right{
    width: 20%;
    height: 200px;
    float: right;
}

.palyer-mainCon  li{
    list-style: none;
    display: flex;
    height: 50px;
    cursor: pointer;
    border-top:1px solid;
    border-top: 0.5px solid tan;
    opacity: 0.58;
}
  .player-song,.player-album,.player-duration{
    display: inline-block;
    flex: 1;
    line-height: 50px;
    font-size: 14px;
    font-weight: 500;
}
.player-song{
  text-align: left;
  flex:2;
  padding-left: 20px;
}
.player-album{
  text-align: center;
}
.player-duration{
  text-align: right;
  padding-right: 20px;
}
.li-index{
    display: inline-block;
    line-height: 50px;
    text-align: center;
    width: 50px;
    font-size: 14px;
    color: #999;
}
.player-right  img{
  width: 186px;
  height: 186px;
}
/* 底部的音乐播放条样式 */
.play-toolbar{
  width: 80%;
  margin-left: 10%;
  position: fixed;
  bottom: 30px;
}
.play-part {
    width: 70%;
    display: flex;
    float: left;
}
.play-part .icon{
   font-size: 32px;
    margin: 0 5px;
}
.play-music{
  flex:1;
  height: 5px;
  margin-top: 25px;
  border-radius: 10px;
  background: rgba(255,255,255,.1);
  margin-left: 30px;
  position: relative;
}
.progress-inner{
  height: 5px;
  background: rgba(255,255,255,.7)
}
.progress-dot {
    position: absolute;
    width: 13px;
    height: 13px;
    background: white;
    border-radius: 8px;
    left: 20px;
    top: -4px;
}
.other-part{
  display: inline-block;
  width: 20%;
}
.song-time {
    position: absolute;
    right: 0;
    top: -30px;
    font-size: 16px;
    font-weight: 500;
}
</style>
