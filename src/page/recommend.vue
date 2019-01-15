<template>
  <div class="recommend-box">
    <div class="recommend-container">
      <h1>歌单推荐</h1>
      <!-- 推荐歌单 -->
      <div>
        <Carousel
          loop
          :value="0"
          dots="outside"
          :radius-dot="true"
          height="auto"
          class="Carousel-recommend"
        >
          <CarouselItem
            v-for="(item,index) in recommend"
            :key="index"
          >
            <div class="img-box">
              <img
                :src="item.picUrl"
                alt
              >
              <img
                :src="item.picUrl"
                alt
              >
            </div>
          </CarouselItem>
        </Carousel>
      </div>
      <!-- 分类歌单组件 -->
      <div class="cate-songlist">
        <h1>全部歌单</h1>
        <div
          class="songList-single"
          v-for="(item,index) in songList"
          :key="index"
        >
          <div class="songlist-box">
            <div class="imgContainer">
              <img
                v-lazy="item.imgurl"
                alt
              >
            </div>
          </div>
          <div class="songlist-single-info">
            <p class="info-p">{{item.dissname}}</p>
            <p>{{item.creator.name}}</p>
            <p>播放量： {{(item.listennum+'').slice(0,2)}} 万</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDiscListCache, test } from '../api/promiseCache.js';
import { getRecommend, getDiscList } from '../api/recommend.js';

export default {
  data () {
    return {
      recommend: [],
      comHeight: '',
      songList: []
    }
  },
  computed: {},
  created () {
    this.comHeight = '180';
  },
  mounted () {
    getRecommend().then(res => {
      this.recommend = res.data.slider
    })
    this.getcateList()
  },
  methods: {
    getcateList () {
      getDiscListCache.then(res => {
        console.log(test)
        console.log(res)
        this.songList = res.data.data.list
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1 {
  margin: 0;
  padding: 0;
  line-height: 80px;
}

.recommend-box {
  background: rgba(0, 0, 0, 0.05);
}

.recommend-container {
  width: 100%;
  /* margin-left: 10%; */
}

.songlistRecommend {
  /* display: flex; */
  text-decoration: none;
  margin-top: 50px;
}

.songlist-single {
  /* flex: 1; */
  width: 100%;
  display: block;
  text-decoration: none;
}

.songlist-single img {
  width: 100%;
  display: block;
}
.songlist-box {
  width: 100%;
  padding-bottom: 100%;
  height: 0;
  position: relative;
}
.img-box {
  /* text-align: center */
}

.img-box img {
  width: 36%;
  height: 248px;
  margin-left: 10px;
  display: inline-block;
}

#app .Carousel-recommend button.ivu-carousel-arrow {
  width: 80px;
  height: 108px;
  border-radius: 0%;
}

.Carousel-recommend .ivu-icon {
  font-size: 18px;
}

/* 分类歌单列表 */

.cate-songlist {
  width: 90%;
  margin-left: 5%;
  /* display: flex; */
  text-align: center;
}

.songList-single {
  /* flex: 1; */
  margin: 10px 10px 20px;
  width: 16%;
  display: inline-block;
  cursor: pointer;
}

.imgContainer {
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: absolute;
}

.songList-single img {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  margin: auto;
  /* img是一种类似text的元素，在结束的时候，会在末尾加上一个空白符，所以就会多出3px */
}

.songList-single img:hover {
  transform: scale(1.4);
  width: 120%;
  transform: scale(1.15, 1.15);
  transition: all 0.5s;
}

.songlist-single-info {
  text-align: left;
  margin-top: 10px;
}

.songlist-single-info .info-p {
  color: #333;
  font-weight: 400;
  font-size: 15px;
}

.songlist-single-info p {
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 22px;
  font-weight: 600;
  font-size: 14px;
}

.songlist-single-info p:hover {
  color: #31c27c;
}
</style>
