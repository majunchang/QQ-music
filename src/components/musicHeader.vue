<template>
  <div class="header-box">
    <div class="header">
      <img src="../assets/logo.png" alt class="qqmusic_logo">
      <div class="tab">
        <span
          v-for="(item,index) in tabArr"
          :key="item"
          @click="routerJump(index)"
          :class="[{'choose':chooseItem===item},tabSpan]"
        >{{item}}</span>
      </div>
      <div class="search">
        <Input v-model="searchKey" icon="ios-search" placeholder="请输入歌手名称" style="width: 300px"/>
        <div class="searchBox" v-show="toggleSearchBox">
          <li v-for="(item,index) in searchRes" :key="index">{{item}}</li>
        </div>
      </div>

      <div class="tab-span" @click="search">搜索</div>
    </div>
  </div>
</template>

<script>
import '../page/iview.css';
import { getHotKey } from '../api/searh.js';

const routerArr = [
  'recommend',
  'singer',
  'rank',
  'search',
  'userCenter',
  'player'
]
export default {
  name: 'musicHeader',
  data () {
    return {
      tabArr: [
        '首页',
        '歌手',
        '排行榜'
        // '搜索', '用户中心'
      ],
      tabSpan: 'tab-span',
      chooseItem: '首页',
      // 搜索框
      searchKey: '',
      toggleSearchBox: false,
      searchRes: []
    }
  },
  mounted () {
    console.log(this.$route.path)
    // this.routerJump(
    //   routerArr.findIndex(item => {
    //     return item === this.$route.path.slice(1)
    //   })
    // )
  },
  methods: {
    search () {
      getHotKey(this.searchKey).then(res => {
        let searchRes = res.data.singer.itemlist
        if (searchRes.length === 0) {
          this.$Message.warning(`查询不到!${this.searchKey}的相关信息`)
        } else {
          this.$root.selectSinger = {
            id: searchRes[0].mid,
            name: searchRes[0].name,
            avatar: searchRes[0].pic
          }
          this.$router.push({
            name: 'recommend',
            path: '/recommend'
          })
          this.$nextTick(() => {
            this.$router.push({
              name: 'singerDetail',
              path: '/singerDetail'
            })
            this.searchKey = '';
          })
        }
      })
    },
    // goDetail () {
    //   console.log('进入到了详细页面')
    // },
    routerJump (index) {
      // index = index === -1 ? 5 : index
      this.chooseItem = this.tabArr[index]
      this.$router.push({
        name: routerArr[index],
        path: `/${routerArr[index]}`
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header-box {
  width: 80%;
  margin-left: 10%;
}

.header {
  margin: 0;
  padding: 0;
  display: flex;
  width: 100%;
  height: 80px;
  border-bottom: 1px solid;
  line-height: 80px;
}

.qqmusic_logo {
  width: 170px;
  height: 46px;
  display: inline-block;
  flex: 0 0 170px;
  margin-top: 16px;
}

.tab {
  /* flex: 1; */
  display: inline-block;
  line-height: 80px;
  margin-left: 180px;
  text-align: left;
  min-width: 300px;
}

.tab-span {
  display: inline-block;
  line-height: 80px;
  height: 80px;
  width: 98px;
  text-align: center;
  cursor: pointer;
  font-size: 18px;
}

.tab-span:hover {
  color: #31c27c;
}

.tab .choose {
  color: white;
  background-color: #31c27c;
  font-weight: 500;
}

.searchBox {
  width: 300px;
  position: absolute;
  margin-left: 58px;
  z-index: 1000;
  margin-top: -20px;
  transition: all 0.5s;
}

.searchBox li {
  list-style: none;
  background: white;
  height: 50px;
  display: inline-block;
  width: 300px;
  float: left;
  line-height: 50px;
  font-size: 14px;
  cursor: pointer;
}

.searchBox li:hover {
  color: #31c27c;
}
</style>
