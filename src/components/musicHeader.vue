<template>
  <div class="header-box">
        <div class="header">
              <img src="../assets/logo.png" alt="" class="qqmusic_logo">
        <div class="tab">
             <span 
                 v-for="(item,index) in tabArr"
                 :key='item'
                 @click='routerJump(index)'
                 :class="[{'choose':chooseItem===item},tabSpan]"
                >
                {{item}}
                </span>
            <!-- <span class="tab-span" @click='routerJump(0)'>首页</span>
            <span class="tab-span" @click='routerJump(1)'>歌手</span>
            <span class="tab-span" @click='routerJump(2)'>排行榜</span>
            <span class="tab-span" @click='routerJump(3)'>搜索</span>
            <span class="tab-span" @click='routerJump(4)'>用户中心</span> -->
        </div>
        </div>
       
  </div>
</template>

<script>
const routerArr = ['recommend', 'singer', 'rank', 'search', 'userCenter', 'player']
export default {
  name: 'musicHeader',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      tabArr: [
        '首页', '歌手', '排行榜'
        // '搜索', '用户中心'
      ],
      tabSpan: 'tab-span',
      chooseItem: ''
    }
  },
  mounted () {
    this.routerJump(routerArr.findIndex((item) => {
      return item === this.$route.path.slice(1)
    }))
  },
  methods: {
    routerJump (index) {
      index = index === -1 ? 5 : index
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
.header{
    margin: 0;
    padding: 0;
    display: flex;
    width: 100%;
    height: 80px;
    border-bottom: 1px solid;
    line-height: 80px;
}

.qqmusic_logo{
    width: 170px;
    height: 46px;
    display: inline-block;
    flex: 0 0 170px;
    margin-top: 16px;
}

.tab{
    flex: 1;
    display: inline-block;
    line-height: 80px;
    margin-left: 180px;
    text-align: left;
}
.tab-span{
    display: inline-block;
    line-height: 80px;
    height: 80px;
    width: 98px;
    text-align: center;
    cursor: pointer;
    font-size: 18px;
}
.tab-span:hover{
    color: #31c27c;
  }
 .tab .choose{
  color: white;
  background-color: #31c27c;
  font-weight: 500;
  }
</style>
