<template>
  <div >
    <h1>歌手页面</h1>
  </div>
</template>

<script>
import {getSingerList} from '../api/singer.js'

class Singer {
  constructor ({id, name}) {
    this.id = id
    this.name = name
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
  }
}
const hotName = '热门'
let map = {
  hot: {
    title: hotName,
    items: []
  }

}
const hotLength = 10
export default {
  name: 'HelloWorld',
  data () {
    return {
      map: {
        hot: {
          title: hotName,
          items: []
        }
      },
      singerInfo: [],
      keyWord: ''
    }
  },
  created () {

  },
  mounted () {
    this.getSingerList()
  },
  methods: {
    getSingerList () {
      getSingerList().then((res) => {
        console.log('获取歌手列表')
        console.log(res)
        this.singer = this.normalizeSinger(res.data.list)
        console.log(this.singer)
      })
    },
    normalizeSinger (list) {
      list.forEach((item, index) => {
        if (index < hotLength) {
          map.hot.items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          name: item.Fsinger_name,
          id: item.Fsinger_mid
        }))
      })
      return map
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
