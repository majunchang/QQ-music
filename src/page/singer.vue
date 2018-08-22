<template>
    <div>
        <div class="singerBg">
        </div>
        <div class="singerInfo">
            <div class="singer_tag">
                <div class="tagletter">
                    <span :class="[{'choose':chooseLetter==item},'letter']" @click='chooseSinger(item)' v-for="(item,index) in charArr" :key="index">
                                  {{item}}
                              </span>
                </div>
                <div class="tag_condition">
                    <span class="choose letter">
                              全部
                          </span>
                    <span class="letter">
                              内地
                          </span>
                    <span class="letter">
                              韩国
                          </span>
                </div>
                <div class="tag_condition">
                    <span class="choose letter">
                              全部
                          </span>
                    <span class="letter">
                              男
                          </span>
                    <span class="letter">
                              女
                          </span>
                </div>
                <div class="tag_condition">
                    <span class="choose letter">
                              全部
                          </span>
                    <span class="letter">
                              流行
                          </span>
                    <span class="letter">
                              重低音
                          </span>
                </div>
            </div>
            <div class="singerList">
                <div class="singleSinger" v-for="(item,index) in singerInfo.items" :key='index'>
                    <div class="singerImgBox" @click='singerDetail(item)'>
                        <div class="hidemask">
                            <img :src="item.avatar" alt="">
                        </div>
    
                        <p>{{item.name}}</p>
                    </div>
    
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getSingerList } from '../api/singer.js'

class Singer {
  constructor ({ id, name }) {
    this.id = id
    this.name = name
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
  }
}
const hotName = '热门'

const hotLength = 10
let charArr = ['热门']
export default {
  name: 'HelloWorld',
  data () {
    return {
      map: {
        '热门': {
          title: hotName,
          items: []
        }
      },
      singerInfo: [],
      keyWord: '',
      charArr: [],
      chooseLetter: '热门'
    }
  },
  created () {

  },
  mounted () {
    this.getSingerList()
  },
  methods: {
    singerDetail (singer) {
      // 跳转到歌手闲详情页面
      this.$root.selectSinger = singer
      this.$router.push({
        name: 'singerDetail',
        path: '/singerDetail'
      })
    },
    getSingerList () {
      getSingerList().then((res) => {
        this.singer = this.normalizeSinger(res.data.list)
        this.charArr = charArr
        this.singerInfo = this.singer['热门']
      })
    },
    normalizeSinger (list) {
      let map = {
        '热门': {
          title: hotName,
          items: []
        }

      }
      list.forEach((item, index) => {
        if (index < hotLength) {
          map['热门'].items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        }
        let key = /[A-Za-z]/.test(item.Findex) ? item.Findex : '#'

        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        if (!charArr.includes(key)) {
          charArr.push(key)
        }
        map[key].items.push(new Singer({
          name: item.Fsinger_name,
          id: item.Fsinger_mid
        }))
      })
      charArr.sort((a, b) => {
        return a.localeCompare(b)
      })
      charArr.shift()
      charArr.push('#')
      return map
    },
    chooseSinger (key) {
      this.chooseLetter = key
      this.singerInfo = this.singer[key]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.singerBg {
    position: relative;
    width: 100%;
    height: 376px;
    background: url('https://y.gtimg.cn/mediastyle/yqq/img/bg_singer.jpg') 50% 0 repeat-x;
    overflow: hidden;
}

.singerInfo {
    width: 70%;
    margin-left: 17%;
    margin-top: 30px;
}

.tagletter {
    text-align: left;
}

.singer_tag {
    padding: 25px;
    background: #fbfbfd;
}

span.letter {
    display: inline-block;
    padding: 3px 8px;
    color: #333;
    cursor: pointer;
    margin-right: 15px;
    font-size: 15px;
    text-align: center;
    border-radius: 2px;
    font-weight: 400;
}

span.letter:hover {
    color: #31c27c
}

.singerInfo span.choose {
    background-color: #31c27c;
    color: #fff;
}

.tag_condition {
    text-align: left;
    margin-top: 23px;
}

.singerList {
    overflow: hidden;
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.singleSinger {
    float: left;
    flex: 0 0 230px;
    /* background-color: #fbfbfd; */
}

img {
    border-style: none;
    width: 140px;
    border-radius: 50%;
    transition: all 0.5s;
}

img:hover {
    transform: scale(1.15, 1.15);
    transition: all 0.5s;
}

.singleSinger {
    float: left;
    width: 20%;
}

.singerImgBox {
    background: #fbfbfd;
    height: 230px;
    padding-top: 20px;
    margin-bottom: 20px;
    cursor: pointer;
}

p {
    margin-top: 20px;
    font-size: 16px;
    color: #333;
    font-weight: 500;
}
.hidemask {
    width: 140px;
    height: 140px;
    overflow: hidden;
    border-radius: 50%;
    display: inline-block;
}
</style>
