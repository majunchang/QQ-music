import {
  getDiscList
} from './recommend.js'

let getDiscListCache
let test

function fn() {
  if (!getDiscListCache) {
    test = '测试变量'
    getDiscListCache = getDiscList() //  在此赋值  import 引入的时候 就向后端发送接口
  }
}
fn()

export {
  getDiscListCache,
  test
}
