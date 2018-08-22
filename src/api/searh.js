/**
 * Created by majunchang on 2017/8/21.
 */
// import jsonp from 'common/js/jsonp'
import jsonp from '../utils/jsonp'
import {commonParams, options} from '../config'

export function getHotKey (key) {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg'

  const data = Object.assign({}, {
    uin: 0,
    needNewCode: 1,
    platform: 'yqq',
    jsonCallback: 'SmartboxKeysCallbackmod_top_search8479',
    is_xml: 0,
    format: jsonp,
    key: key,
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0
  })

  return jsonp(url, data, options)
}

export function search (query, page, zhida, perpage) {
  // const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  const url = 'http://s.music.qq.com/fcgi-bin/music_search_new_platform?'
  const data = Object.assign({}, commonParams, {
    w: query,
    p: page,
    perpage,
    n: perpage,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options)
}
