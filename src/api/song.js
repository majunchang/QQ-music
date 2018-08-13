import {commonParams} from '../config'
import axios from 'axios'

export function getLyric (mid) {
  let href = window.location.href
  let url
  if (href.includes('localhost') || href.includes('127.0.0.1')) {
    url = '/api/lyric'
  } else {
    url = 'http://127.0.0.1:3000/api/lyric'
  }
  console.log(url)

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
