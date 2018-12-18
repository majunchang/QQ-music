import Vue from 'vue'
import Router from 'vue-router'

// import recommend from '@/page/recommend'
// import singer from '@/page/singer'
// import search from '@/page/search'
// import rank from '@/page/rank'
// // 歌手详情页
// import singerDetail from '@/page/singerDetail'
// //  播放音乐的页面
// import player from '@/page/player'

// import rankDetail from '@/page/rankDetail'

// 按需加载  可以指定 webpackChunkName
// const recommend = () => import(/* webpackChunkName: 'ImportFuncDemo' */,'@/page/recommend')
const recommend = () => import('@/page/recommend')
const singer = () => import('@/page/singer')
const search = () => import('@/page/search')
const rank = () => import('@/page/rank')
const singerDetail = () => import('@/page/singerDetail')
const player = () => import('@/page/player')
const rankDetail = () => import('@/page/rankDetail')

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/recommend',
      name: 'recommend',
      component: recommend
    },
    {
      path: '/',
      redirect: '/recommend'
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
    },
    {
      name: 'rankDetail',
      path: '/rankDetail',
      component: rankDetail
    }
  ]
})
