## 前端构造桌面级音乐播放器（nw与electron）

> 最近研究前端如何构造桌面级应用，看了一下nw和ecectron。于是自己使用vue写了一个pc版本的qq音乐播放器。由于时间太紧，做的功能很有限。但是本片文章主要是介绍nw与electron这两个工具。前端的代码已经开源，感兴趣的同学可以自己下载下来，添加一些比较有趣的功能以及进行代码的优化

### 项目预览图

> 分为首页、歌手列表页、歌手详情页、排行榜。排行榜详情页以及播放器页面，排行榜与歌手页基本一致 不做赘述

##### 首页
![](http://oneg19f80.bkt.clouddn.com/18-9-20/26564203.jpg)

##### 歌手列表页
![](http://oneg19f80.bkt.clouddn.com/18-9-20/37000104.jpg)
##### 歌手详情页

![](http://oneg19f80.bkt.clouddn.com/18-9-20/43740308.jpg)
##### 歌手搜索功能
![](http://oneg19f80.bkt.clouddn.com/18-9-20/59021103.jpg)

##### 播放器页面
![](http://oneg19f80.bkt.clouddn.com/18-9-20/68068332.jpg)



### 技术栈

- #### 前端    vue、vue-router、webpack

- #### 后端（代理） node+express做代理

- #### 接口转发   jsonp axios

- #### 打包工具   electron  electron-packager

### 项目简介

#### 1. 数据获取部分

```
  数据主要是获取QQ音乐的接口，有得接口jsonp的方式 就可以获取到数据 有得接口需要使用Node做一下代理 来解决跨域
```

#### 2.   代理转发

```
在开发阶段，我们可以使用vue中的dev模块中的proxyTable进行路径的重写和代理的转发
在build的时候 我们可以手动配置 访问路径  或者使用express做一下配置 类似于我们将代码 放入nginx服务器中那样
```

#### 3.   项目注意事项

```
我们需要在node启动的服务器里面（也就是本地服务器中）解决跨域问题
使用nw的时候需要解决不能播放音频的问题
index.html以及静态资源的这些路径问题
```

#### 4.   项目优化点

```
项目的css部分可以优化 优化为less，sass 或者cssmodule这样
项目的组件可以抽离一下 目前排行榜详情页以及歌手详情页基本上的逻辑是一样的 可以进行抽使用组件化 也可以使用 slot
项目中 还可以新增很多功能 比如说播放mv  下载歌曲 以及添加我喜欢的音乐等
```



#### NodeJs+Express的代理

> A 使用express 去访问打包完成之后的dist目录的静态资源
>
> B 为了解决 当dist文件拖入nw打开  或者 直接打开dist目录的index.html 以及使用electron打包之后 的接口访问跨域问题 

```js
import path from 'path'
import express from 'express'
import axios from 'axios'
import {join} from 'path'

const app = express()

//  挂载静态路径
//  A
app.use(express.static(join(__dirname, '../../dist')))

let router = express.Router()

//  B
router.all('*', function (req, res, next) {
  // res.header('Access-Control-Allow-Origin', '*')
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
    console.log('接口响应成功')
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

```

​	

### nw（node-weikit的简介与使用）

#### node-webkit的简介

> 官网需要翻墙 下载需要翻墙 （唉......  在这里贴一下nw的官网首页和下载截图）

![](http://oneg19f80.bkt.clouddn.com/18-8-16/65827693.jpg)

![](http://oneg19f80.bkt.clouddn.com/18-8-16/20581218.jpg)

> Github上nw.js有两万多Star和接近3000的Fork，说明它已经相当成熟。 并且在Github项目的最后面，显示Intel有赞助这个项目，看起来很牛的样子

- nw.js也是一个使用前端技术（html、css、JavaScript）来构建pc端程序的一个框架。
- 可以兼容windows xp系统
- 支持用HTML5, CSS3, JS和WebGL来写应用程序，包括桌面端和移动端；
- 完全支持Node.js APIs和所有的第三方模块；
- 性能也不会很差，对于轻量级的应用足够了；
- 对应用进行打包和发布十分简单，也就是说写一份代码很容易移植到不同的平台（包括主流的Linux, Mac OS X 和 Windows）；

##### nw能做什么？

> nw.js就是使HTML, CSS, JavaScript写的原本在浏览器上运行的程序，也可以在桌面端运行。

![](http://oneg19f80.bkt.clouddn.com/18-8-15/22737169.jpg)

##### nw的安装与使用

1. 下载安装包安装（建议大家下载带有开发包的  便于调试）

   官网下载nw.app的压缩包  解压以后即可使用

> 附官网地址: https://github.com/nwjs/nw.js

```
效果图：
```

![](http://oneg19f80.bkt.clouddn.com/18-8-15/49091205.jpg)
![](http://oneg19f80.bkt.clouddn.com/18-8-15/87487091.jpg)

1. 使用命令行安装 （命令行下载比较慢 所以不是特别建议）

```
sudo npm install -g nw
```

##### nw的打包流程

> 打包工具 （简单介绍几种  ）

- nodebob是node-webkit的构建工具，可以在Windows环境中自动发布node-webkit应用程序。目前在v0.1中，用windows批处理脚本编写。
- nw-builder＆grunt-nw-builder允许您使用grunt为mac，win和linux构建node-webkit应用程序。他们将下载特定版本的预构建二进制文件，解压缩它，创建一个版本文件夹，为指定目录创建app.nw文件，并将app.nw文件复制到它所属的位置
- Nuwk！Nuwk！可以轻松地基于node-webkit创建Mac应用程序，从而简化测试和构建过程。它负责创建可执行文件，附加应用程序图标并相应地配置plist文件。（非常alpha阶段）
- generator-node-webkit是一个yeoman生成器，用于开发node-webkit应用程序并为mac，linux和win创建包。
  松集成到您的构建过程中，它将为Linux，Windows和OSX下载nwjs 32 / 64bit，并从给定的源目录为所有3个平台构建软件包。

> windows下的打包流程
> https://www.cnblogs.com/tinyphp/p/5052327.html

> mac/osx下的打包流程

https://blog.csdn.net/weichuang_1/article/details/48849335

https://blog.csdn.net/baidu_30907803/article/details/78795405



##### nw解决不能播放音频问题

> MP3编码属于专利编码，非开源授权的，所以在nw.js中默认不支持MP3的播放，需要手动启用才行。

需要从社区中下载**对应版本**的libffmpeg.dll文件  然后将原来的替换一下即可解决

社区地址: https://github.com/iteufel/nwjs-ffmpeg-prebuilt/releases

目标文件地址： /Users/baidu/Desktop/nwjs-sdk-v0.31.1-osx-x64/nwjs.app/Contents/Versions/67.0.3396.79

> 我把这个软件安装在了桌面上 这是目标地址 大家只要记住后面的就行,Versions后面的数字 代表的nw内嵌的谷歌版本（不一样也没事）

##### nw的使用以及如何调试

> 通过快捷键 option+command+i  打开内置谷歌的控制台。如果不能打开 或没反应 有可能是大家下载的版本 不是带开发工具的 



##### nw的应用

nwjs——你值得拥有！
不得不提nw.js开发出的应用已经涵盖了许多领域：

1. WhatsApp 经典的聊天应用，还有Messenger；
2. Powder Player 种子下载，以及视频播放器；
3. Boson Editor 代码编辑器，甚至还有一款Markdown编辑器叫Story-writer；
4. Leanote Desktop App 类似Evernote的笔记类应用程序；
5. Mongo Management Studio 数据库管理应用。

### electron（简介与使用）

> 官网地址 （不用翻墙 这一点很棒）

https://electronjs.org/

![](http://oneg19f80.bkt.clouddn.com/18-8-16/22321807.jpg)

> 简介

- electron 是一个可以让我们使用js创建桌面应用程序的框架，并且可以很简单的实现跨平台，让我们可以更轻松的书写业务逻辑，而不用担心跨平台的问题。
- 与nw相比，electron的使用人数更多，文档更加齐全，使用起来也更加方便。
- 社区很强大,基本上你遇到的问题 都可以在社区中解决。

> 官方示例

```js
# 克隆示例项目的仓库
$ git clone https://github.com/electron/electron-quick-start

# 进入这个仓库
$ cd electron-quick-start

# 安装依赖并运行
$ npm install && npm start
```

> 项目截图  

![](http://oneg19f80.bkt.clouddn.com/18-8-16/89054292.jpg)

![](http://oneg19f80.bkt.clouddn.com/18-8-16/12368460.jpg)

> electron的安装与打包工具的安装

- 全局安装electron 

  ```js
  npm install electron -g
  ```

- 本地安装

  ```js
  npm install electron --save-dev
  ```

- 打包工具

  > 这里的打包工具我选择的是electron-packager

  在项目中  安装打包工具 然后配置一下命令行

  ```js
  npm install --save-dev electron-packager
  ```

  ​

  ```js
  {
    "name": "qq-music",
    "version": "1.0.0",
    "description": "A Vue.js project",
    "author": "junchang.ma.ele_waimai <junchang.ma@ele.me>",
    "private": true,
    "scripts": {
      "dev": "webpack-dev-server --host 0.0.0.0 --inline --progress --config build/webpack.dev.conf.js",
      "start": "npm run dev",
      "build": "node build/build.js",
      "electron_dev": "electron build/electron.js",
      "electron_build": "electron-packager ./dist/ --platform=darwin --arch=x64 --overwrite"
    },
    "dependencies": {
      ....
    },
    "devDependencies": {
      ...
    },
    "engines": {
      "node": ">= 6.0.0",
      "npm": ">= 3.0.0"
    },
    "browserslist": [
      "> 1%",
      "last 2 versions",
      "not ie <= 8"
    ]
  }

  ```

  说一下命令行配置：

  ```js
  packager": "electron-packager ./app HelloWorld --all --out ./OutApp --version 1.4.0 --overwrite --icon=./app/img/icon/icon.ico"
  ```

  ​

  - location of project：项目所在路径 
  - name of project：打包的项目名字 
  - platform：确定了你要构建哪个平台的应用（Windows、Mac 还是 Linux） win32=> windows下  darwin=> mac
  - architecture：决定了使用 x86 还是 x64 还是两个架构都用 
  - electron version：electron 的版本 
  - optional options：可选选项

  > 字段里的 项目名字，version，icon路径要改成自己的；

### electron的打包（将electron集成在vue中）

> 命令行配置 参考上面

#### 本地预览模式

- 在build文件夹下 生成一个electron.js  

  ```js
  // Modules to control application life and create native browser window
  const {app, BrowserWindow} = require('electron')
  // import path from 'path'
  const path = require('path')
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let mainWindow

  function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600})

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null
    })
  }

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow)

  // Quit when all windows are closed.
  app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createWindow()
    }
  })

  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.

  ```

  ​

#### 打包模式

1. 将build目录的下electron.js  复制到dist文件中一份 

2. 配置一个package.json  

   ```js
   {
     "name": "nw-qqMusic",  项目名称
     "version": "0.0.1",     版本号
     "main": "electron.js"   项目入口文件
   }

   ```

3. 在项目根目录的命令行中 运行

   ```js
   npm run build 
   npm run electron_build
   ```

### Nw与Electron的对比

1. nw.js无论从表面还是本质都更接近 Node.js，nw.js直接继承和使用了node.js的启动、开发、运行方式，对node.js的修改最小，而 electron的改动很大，增加了很多自己的东西，使用起来感觉与node.js差别明显。nw.js是和node.js一样是单进程的，electron改成了双进程，技术实现改变。
2. electron的优点：开源的核心扩展比较容易，界面定制性强，原则上只要是Web能做的他都能做。是目前最廉价的跨平台技术方案，相对其他跨平台方案（如 QT GTK+ 等），更稳定，bug少， 毕竟只要浏览器外壳跑起来了，里面的问题不会太多 。
3. electron的缺点：
   - 卡，启动慢，这可能是webkit的锅。毕竟一个浏览器要支持的功能确实有点多。
   - 除了主进程 你可能还需要启动一些辅助进程来完成工作。而每当你新开一个进程，起步价就是一个nodejs的内存开销！
   - 丢帧，这个最严重，可我已习惯了native 的丝滑. mac下感觉还可以 win下有点够呛。
   - 打出来的包太大。（很显然，即便是一个空包，也至少包含了一个浏览器的体积
4. NW.js对库的整合更深，某种意义上说，对chromium和Node有更深入的理解（新功能要用，必须把源码拿来build进去）。
5. 从license上来看，Electron是Github的，NW.js则是Intel。
6. nw 在mac上只能构建mac的应用 ，windows下只能构建windows的。而electron 可以通过命令行构建不同环境下的 linux mac和windows等

### 资料文档

> qq音乐接口获取方式的相关文档  

https://blog.csdn.net/xiayiye5/article/details/79487560
https://blog.csdn.net/hhzzcc_/article/details/79769386
https://segmentfault.com/a/1190000007685830

> nw相关资料

- https://github.com/nwjs/nw.js
- https://blog.csdn.net/tsyccnh/article/details/54782835

> electron的相关资料

[打造你的第一个electron应用](https://electronjs.org/docs/tutorial/first-app)

[github地址](https://github.com/electron/electron)

[常用打包工具](https://www.jianshu.com/p/1c2ad78df208)

[Electron: 从零开始写一个记事本app](https://www.jianshu.com/p/57d910008612)

[electron打包：electron-packager及electron-builder两种方式实现（for Windows）](https://segmentfault.com/a/1190000013924153)

[electron-packager命令常用参数大全](https://newsn.net/say/electron-packager-command.html)

### 探索与思考

1. ​ 实现让div的高度也自适应的方式 和宽度始终成一个比例，能有几种实现方法？
2. 如果我们买一个自己的服务器 发布一些软件  部署后端代码，这样能赚钱嘛？（比如 我之前说的小型商户管理系统？）

### 项目地址与启动方式

```js
克隆项目地址  
git clone https://github.com/majunchang/QQ-music.git
安装依赖 
npm i  
cd  nodeServer
npm i
启动Node代理 在nodeServer文件夹下
npm run dev 
本地预览 （项目的根目录下）
npm  run dev  

本地electron预览
npm  run electron_dev

打包编译

npm run build 
npm run electron_build

```
