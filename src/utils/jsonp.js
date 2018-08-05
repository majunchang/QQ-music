import originJsonp from 'jsonp'

// 三个参数粉笔为 目标url 需要拼接在url上的参数 以及jsonp插件 需要的option
export default function jsonp (url, paramdata, options) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(paramdata)

  // 在这里返回一个Promise对象
  return new Promise((resolve, reject) => {
    originJsonp(url, options, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function param (paramdata) {
  let url = ''
  for (var k in paramdata) {
    //  对参数对象里的每一项进行判断
    let value = paramdata[k] == undefined ? '' : paramdata[k]
    url += `&${k}=${encodeURIComponent(value)}`
  }
  // 循环结束  url 拼接完毕 将其返回
  return url
}
