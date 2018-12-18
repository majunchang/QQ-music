<template>
  <div>
    <div class="player-container">
      <ReturnBack @returnBackprop="returnBack"></ReturnBack>
      <div class="background">
        <img :src="selectSong.image" alt>
      </div>
      <Button type="default" size="large" @click="emptyList" style="marginRight:15px">清空播放列表</Button>
      <Button type="success" size="large" @click="changeMode">{{ordermode ?'顺序播放' :'单曲循环'}}</Button>
      <div class="palyer-mainCon">
        <div class="player-left">
          <ul class="player-list nui-scroll">
            <li class="songlist_player_li">
              <div class="li-index"></div>
              <div class="player-song">歌曲</div>
              <div class="player-album">歌手</div>
              <div class="player-duration">时长</div>
            </li>
            <div class="songlist_table">
              <li
                v-for="(item,index) in palyedSongArr"
                :key="index"
                :class="[index%2===0?'li-even':'li-odd']"
                @click="selectNewSong(item,index)"
              >
                <div class="li-index">{{index+1}}</div>
                <div class="playgif" v-show="playIndex === index && playing">
                  <img src="https://y.gtimg.cn/mediastyle/yqq/img/wave.gif" alt>
                </div>
                <div class="player-song">{{item.name}}</div>
                <div class="player-album">{{item.singer}}</div>
                <div class="player-duration">{{item.duration}}</div>
              </li>
            </div>
          </ul>
        </div>
        <div class="player-right">
          <img :src="selectSong.image" alt>
          <div>
            <p class="player-right-info">歌曲名: &nbsp; {{selectSong.name}}</p>
            <p class="player-right-info">歌手: &nbsp; {{selectSong.singer}}</p>
            <p class="player-right-info">专辑名: &nbsp; {{selectSong.album}}</p>
          </div>
          <!-- <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
          </div>-->
          <div class="lyric-wrapper">
            <div v-if="currentLyric" class="lyricBox" ref="lyricBox">
              <p
                ref="lyricLine"
                class="text"
                v-for="(line,index) in currentLyric.lines"
                :key="index"
                :class="{'current':currentLineNum === index}"
              >{{line.txt}}</p>
            </div>
            <!-- {{currentLyric}} -->
          </div>
        </div>
      </div>
      <!-- 播放条 -->
      <div class="play-toolbar">
        <div class="play-part">
          <div class="icon">
            <i class="iconfont icon-previous21" @click.prevent="prev"></i>
            <i class="iconfont" @click.prevent="togglePlaying" :class="miniIcon"></i>
            <i class="iconfont icon-293-next2" @click.prevent="next"></i>
          </div>

          <div class="play-music" ref="progressBar" @click="progressBarClick">
            <div class="song-name">{{ selectSong.name}} - {{selectSong.singer}}</div>
            <div class="song-time">{{format(currentTime)}} / {{format(selectSong.totalTime)}}</div>
            <div class="progress-inner" ref="progressInner"></div>
            <div
              class="play-container"
              ref="progressDot"
              @mousedown.prevent="touchStart"
              @mousemove.prevent="touchMove"
              @mouseup.prevent="touchEnd"
              @mouseleave.prevent="touchLeave"
            >
              <div class="progress-dot"></div>
            </div>
          </div>
        </div>
        <div class="other-part">
          <!-- <i class="iconfont icon-love"></i>
          <i class="iconfont icon-love"></i>
          <i class="iconfont icon-love"></i>-->
        </div>
        <audio
          :src="selectSong.url"
          ref="audio"
          @play="ready"
          @error="error"
          @timeupdate="timeupdate"
          @ended="end"
        ></audio>
      </div>
    </div>
  </div>
</template>

<script>
//  引入歌词解析插件
import LyricParser from 'lyric-parser';
import ReturnBack from '../components/returnBack';

export default {
  name: 'HelloWorld',
  data () {
    return {
      selectSong: {},
      palyedSongArr: [],
      currentTime: '',
      progressPercent: '',
      // 播放条滑动对象
      touch: {},
      playing: false,
      playIndex: 0,
      // 歌词所需数据
      playingLyric: '',
      currentLyric: '',
      currentLineNum: 0,
      // 播放模式
      ordermode: true
    }
  },
  components: {
    ReturnBack
  },
  computed: {
    miniIcon () {
      return this.playing ? 'icon-pause' : 'icon-play';
    },
    percent () {
      return this.currentTime / this.selectSong.totalTime
    }
  },
  mounted () {
    this.selectSong = this.$root.palyedSongArr[0]
    this.palyedSongArr = this.$root.palyedSongArr
    this.playing = true
    const audio = this.$refs.audio
    this.getLyric()
    this.$nextTick(() => {
      this.playing ? audio.play() : audio.pause()
    })
    //  注册键盘监听事件  监听空格
    document.onkeydown = e => {
      let keyNum = window.event ? e.keyCode : e.which
      if (keyNum === 32) {
        this.togglePlaying()
      }
    }
  },
  methods: {
    changeMode () {
      this.ordermode = !this.ordermode
    },
    emptyList () {
      this.playing = false
      this.currentLyric.stop()
      this.currentTime = 0
      this.$refs.audio.pause()
      this.$root.palyedSongArr = []
      this.selectSong = {}
      this.$router.back()
    },
    returnBack () {
      this.$router.back()
    },
    getLyric () {
      this.selectSong.getLyrics().then(lyric => {
        if (this.selectSong.lyric !== lyric) {
          console.log('居然发现了歌词不相等的情况')
          return;
        }
        this.currentLyric = new LyricParser(lyric, this.handleLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      })
    },
    handleLyric ({ lineNum, txt }) {
      this.currentLineNum = lineNum
      if (this.currentLineNum > 2) {
        let moveY = (this.currentLineNum - 2) * 30
        if (this.$refs.lyricBox) {
          this.$refs.lyricBox.style['transform'] = `translateY(-${moveY}px)`
        }
      } else {
        if (this.$refs.lyricBox) {
          this.$refs.lyricBox.style['transform'] = `translateY(0px)`
        }
      }
    },
    touchStart (e) {
      //  滑动开始 暂停歌曲播放
      this.$refs.audio.pause()
      this.touch.startX = e.clientX
      this.touch.startY = e.clientY
      this.touch.left = this.$refs.progressInner.clientWidth
      this.touch.inial = true
    },
    touchMove (e) {
      if (!this.touch.inial) {
        return false
      }
      let deltaX = e.clientX - this.touch.startX
      let moveX = Math.max(0, deltaX + this.touch.left)
      this.moveAndChange(moveX)
    },
    touchEnd (e) {
      this.$refs.audio.play()
      this.playing = true
      //  滑动结束的时候 改变音乐的播放进度 音乐继续播放
      this.touch.inial = false
      this.$refs.audio.currentTime =
        this.progressPercent * this.selectSong.totalTime
    },
    touchLeave () {
      this.touch.inial = false
      this.$refs.audio.play()
    },
    progressBarClick (e) {
      let moveX =
        e.clientX - this.$refs.progressBar.getBoundingClientRect().left
      this.moveAndChange(moveX)
      let time = (this.$refs.audio.currentTime =
        this.progressPercent * this.selectSong.totalTime)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
        this.playing = true
      }
      this.currentLyric.seek(time * 1000)
    },
    moveAndChange (moveX) {
      this.$refs.progressInner.style['width'] = moveX + 'px';
      this.$refs.progressDot.style['left'] = moveX + 'px';
      this.progressPercent = moveX / this.$refs.progressBar.clientWidth
    },
    selectNewSong (item, index) {
      if (item.name === this.selectSong.name) {
        return
      }
      this.selectSong = item
      this.playIndex = index
      if (this.currentLyric) {
        this.currentLyric.stop()
      }

      this.currentTime = 0
      this.$nextTick(() => {
        this.playing = true
        this.getLyric()
        this.$refs.audio.play()
      })
    },
    togglePlaying () {
      this.playing = !this.playing
      const audio = this.$refs.audio
      this.playing ? audio.play() : audio.pause()
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    timeupdate (e) {
      this.currentTime = e.target.currentTime
      //  根据这个time  算出比例  然后 滚动条滚动
      this.moveProgressBar()
    },
    moveProgressBar () {
      //  加上这个if  是在播放的时候 直接会退
      if (this.$refs.progressBar) {
        let deltaX = this.percent * this.$refs.progressBar.clientWidth
        this.$refs.progressInner.style['width'] = deltaX + 'px';
        this.$refs.progressDot.style['left'] = deltaX + 'px';
      }
    },
    end () {
      if (this.palyedSongArr.length === 1) {
        // 让歌曲暂停就好
        this.playing = false
        this.currentLyric.stop()
        this.$refs.audio.load()
        this.$nextTick(() => {
          this.playing = true
          this.getLyric()
          this.$refs.audio.play()
        })
        return;
      }
      this.next()
    },
    prev () {
      if (this.palyedSongArr.length === 1) {
        this.$Message.warning('当前列表仅有一条歌曲')
        return;
      }
      if (!this.ordermode) {
        this.$Message.warning('单曲循环模式，不支持上一曲')
        return;
      }
      //  首先求出 当前这首歌的索引  然后去上一个索引
      let currentIndex = this.palyedSongArr.findIndex((item, index) => {
        return item.name === this.selectSong.name
      })
      let prevIndex =
        currentIndex === 0 ? this.palyedSongArr.length - 1 : currentIndex - 1
      this.selectSong = this.palyedSongArr[prevIndex]
      this.playIndex = prevIndex
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      this.currentTime = 0
      this.$nextTick(() => {
        this.playing = true

        this.getLyric()
        this.$refs.audio.play()
      })
    },
    next () {
      if (this.palyedSongArr.length === 1) {
        this.$Message.warning('当前列表仅有一条歌曲')
        return;
      }

      let nextIndex
      let currentIndex = this.palyedSongArr.findIndex((item, index) => {
        return item.name === this.selectSong.name
      })

      if (!this.ordermode) {
        nextIndex = currentIndex
      } else {
        nextIndex =
          currentIndex === this.palyedSongArr.length - 1 ? 0 : currentIndex + 1
      }

      this.selectSong = this.palyedSongArr[nextIndex]
      this.playIndex = nextIndex
      if (this.currentLyric) {
        this.currentLyric.stop()
      }

      this.currentTime = 0
      this.$nextTick(() => {
        this.playing = true
        this.getLyric()
        this.$refs.audio.play()
      })
    },
    ready () {
      this.songReady = true
    },
    format (interval) {
      // 该函数的作用是 将时间戳格式转化为我们的秒数格式
      // 首先将传入的数  进行向下取整  然后 获取分钟和秒数
      interval = interval | 0
      var minute = (interval / 60) | 0
      var second = this.pad(interval % 60)
      return `${minute}:${second}`
    },
    pad (time, n = 2) {
      //  time的length 是否满足 我们定制的位数
      var len = time.toString().length
      while (len < n) {
        time = '0' + time
        len++
      }
      return time
    },
    error (err) {
      this.songReady = true
      console.log(err)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.player-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 150;
  background-color: rgb(78, 29, 30);
  color: white;
}

.background {
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

.background img {
  width: 100%;
  height: 100%;
}

.palyer-mainCon {
  margin: 100px;
  width: 80%;
  margin-left: 10%;
  overflow: hidden;
}

.player-left {
  float: left;
  width: 70%;
}

.palyer-mainCon li {
  list-style: none;
  display: flex;
  height: 50px;
  cursor: pointer;
  border-top: 1px solid;
  border-top: 0.5px solid tan;
  opacity: 0.58;
  position: relative;
}

.songlist_table li:hover {
  color: #31c27c;
}

.player-song,
.player-album,
.player-duration {
  display: inline-block;
  flex: 1;
  line-height: 50px;
  font-size: 14px;
  font-weight: 500;
}

.player-song {
  text-align: left;
  flex: 2;
  padding-left: 20px;
}

.player-album {
  text-align: center;
}

.player-duration {
  text-align: right;
  padding-right: 20px;
}

.li-index {
  display: inline-block;
  line-height: 50px;
  text-align: center;
  width: 50px;
  font-size: 14px;
  color: white;
}

.player-right img {
  width: 186px;
  height: 186px;
}

/* 底部的音乐播放条样式 */

.play-toolbar {
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

.play-part .icon {
  font-size: 32px;
  margin: 0 5px;
  color: rgba(225, 225, 225, 0.8);
}

.play-part .iconfont:hover {
  color: white;
}

.play-music {
  flex: 1;
  height: 5px;
  margin-top: 38px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  margin-left: 30px;
  position: relative;
  /* cursor: pointer; */
}

.progress-inner {
  height: 5px;
  background: rgba(255, 255, 255, 0.7);
  width: 0;
}

.progress-dot {
  position: absolute;
  height: 13px;
  width: 13px;
  background: white;
  border-radius: 8px;
  left: 15px;
  top: 0px;
}

.other-part {
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

.song-name {
  position: absolute;
  top: -28px;
  font-size: 14px;
}

/* 字体图标样式 */

i.iconfont {
  font-size: 40px;
  cursor: pointer;
}

.play-container {
  width: 48px;
  height: 13px;
  position: relative;
  margin-top: -8px;
  cursor: pointer;
  margin-left: -15px;
}

.playgif {
  /* margin-top: 20px; */
  line-height: 50px;
  position: absolute;
  left: 42px;
}

.playgif img {
  display: inline-block;
}

/* 歌词样式 */

.player-right {
  width: 20%;
  float: right;
  height: 600px;
}

.lyric-wrapper {
  margin-top: 30px;
  overflow: hidden;
  height: 300px;
}

p.player-right-info {
  margin-top: 10px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: rgba(225, 225, 225, 0.8);
}

p.text {
  margin: 10px;
  font-size: 14px;
  font-weight: 700;
  color: rgba(225, 225, 225, 0.8);
}

p.current {
  color: #31c27c;
}

.lyricBox {
  transition: all 0.5s;
}

.nui-scroll {
  margin-left: 100px; /*为了咱们看着好看就向右移动一点*/ /*给个边框看着更舒服*/
  width: 100%; /*设置宽*/
  height: 100px;
  overflow-y: auto; /*当内容溢出时显示滚动条*/
  min-height: 328px; /*设置高*/
}

.player-list {
  height: 500px;
}

.nui-scroll::-webkit-scrollbar-track {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
  /* background-color: white; */
}

/*鼠标悬浮在滚动条上的主干部分*/
.nui-scroll::-webkit-scrollbar-track:hover {
  /* -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.4); */
  /* background-color: rgba(0,0,0,.1); */
}

/*正常情况下滑块的样式*/
.nui-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  /* background-color: #ccc; */
  border-radius: 10px;
  -webkit-box-shadow: inset 1px 1px 0 rgba(0, 0, 0, 0.1);
}

/*鼠标悬浮在该类指向的控件上时滑块的样式*/
.nui-scroll:hover::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  -webkit-box-shadow: inset 1px 1px 0 rgba(0, 0, 0, 0.1);
}

/*鼠标悬浮在滑块上时滑块的样式*/
.nui-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.4);
  -webkit-box-shadow: inset 1px 1px 0 rgba(0, 0, 0, 0.1);
}

.nui-scroll::-webkit-scrollbar {
  width: 8px;
  max-height: 20px;
}
</style>
