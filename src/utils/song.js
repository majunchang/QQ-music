
import {getLyric} from '../api/song'
import {Base64} from 'js-base64'

export default class Song {
  constructor ({id, index, mid, singer, name, album, duration, totalTime, image, url}) {
    this.id = id
    this.index = index
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
    this.totalTime = totalTime
  }
  getLyrics () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === 0) {
          console.log('获得了歌词')
          console.log(res)
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyrics')
        }
      })
    })
  }
}

// 在这里声明一个 工厂构造函数
export function createSong (musicData) {
  return new Song({
    id: musicData.songid,
    index: musicData.index,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: handleDuration(musicData.interval),
    totalTime: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: gteVkey(musicData.songmid)
  })
}

function filterSinger (singer) {
  let ret = []
  singer.forEach((item) => {
    ret.push(item.name)
  })

  return ret.join('/')
}

function gteVkey (mid) {
  return 'http://ws.stream.qqmusic.qq.com/C100' + mid + '.m4a?fromtag=0&guid=126548448'
}

function handleDuration (time) {
  return `${parseInt(time / 60)}分${time % 60}秒`
}
