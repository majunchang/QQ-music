import {
  getDiscList
} from './recommend.js'

let getDiscListCache
let test

function fn() {
  if (!getDiscListCache) {
    test = '测试变量'
    getDiscListCache = getDiscList()
  }
}
fn()

export {
  getDiscListCache,
  test
}
