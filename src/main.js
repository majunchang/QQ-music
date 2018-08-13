// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 引入iview框架
import iView from 'iview'
import 'iview/dist/styles/iview.css'
// 引入vue懒加载插件
import VuelazyLoader from 'vue-lazyload'
import '../font_akrwga8ty8n/iconfont.css'

Vue.use(iView)

Vue.config.productionTip = false

Vue.use(VuelazyLoader, {
  loading: require('./assets/album_300.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
    selectSinger: {},
    selectSong: {},
    palyedSongArr: [],
    rankSongId: ''
  },
  router,
  components: { App },
  template: '<App/>'
})
