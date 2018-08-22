import axios from 'axios'
import {commonParams, options} from '../config'
import jsonp from '../utils/jsonp'

export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const paramData = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, paramData, options)
}

//  分类歌单数据

export function getDiscList () {
  let href = window.location.href
  let url
  if (href.includes('localhost') || href.includes('127.0.0.1')) {
    url = '/api/getDiscList'
  } else {
    url = 'http://127.0.0.1:3000/api/getDiscList'
  }

  // 需要拼接的数据
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    // console.log(res);
    return Promise.resolve(res.data)
  })
}
