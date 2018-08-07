import Vue from 'vue'
import Router from 'vue-router'

import recommend from '@/page/recommend'
import singer from '@/page/singer'
import search from '@/page/search'
import rank from '@/page/rank'
//  歌手详情页
import singerDetail from '@/page/singerDetail'
//  播放音乐的页面
import player from '@/page/player'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'recommend',
      component: recommend
    },
    {
      path: '/singer',
      name: 'singer',
      component: singer
    },
    {
      path: '/rank',
      name: 'rank',
      component: rank
    },
    {
      path: '/search',
      name: 'search',
      component: search
    }, {
      path: '/singerDetail',
      name: 'singerDetail',
      component: singerDetail
    },
    {
      path: '/player',
      name: 'player',
      component: player
    }
  ]
})
