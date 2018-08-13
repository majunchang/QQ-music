import path from 'path'
import express from 'express'
import axios from 'axios'
import {join} from 'path'

const app = express()

//  挂载静态路径
app.use(express.static(join(__dirname, '../../dist')))

let router = express.Router()

router.all('*', function (req, res, next) {
  // res.header('Access-Control-Allow-Origin', '*')
  console.log('进入了all  express解决跨域问题')
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('X-Powered-By', ' 3.2.1')
  next()
})

//  做代理的分发和请求  分类歌单
router.get('/getDiscList', function (req, res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    console.log('接口相应成功')
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

router.get('/lyric', function (req, res) {
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    //  由于response 是一个jsonp格式的 所以我们要对这个 进行json转化
    var result = response.data
    var regExe = /^\w+\(({[^()]+})\)$/
    var matchArr = result.match(regExe)
    if (matchArr) {
      res.json(JSON.parse(matchArr[1]))
    }
  }).catch((e) => {
    console.log(e)
  })
})

app.use('/api', router)

app.listen(3000, () => {
  console.log('服务器已经启动,监听的端口号是3000')
})
