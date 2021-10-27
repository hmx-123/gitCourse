// 1. 引入模块
const http = require('http')
const fs = require('fs')
const path = require('path')
const template = require('art-template')
// 2. 创建服务器对象
const app = http.createServer()
// 3. 监听端口并启动服务器
app.listen(3000, () => {
  console.log('server is running at 127.0.0.1:3000')
})
// 4. 注册事件监听请求
app.on('request', (req, res) => {
  // 根据路径进行判断 响应不同的页面
  // 127.0.0.1:3000   默认路径是/ 
  let url = req.url
  let method = req.method // 把请示方式也加进来
  if(method === 'GET' && (url === '/' || url === '/index' || url === '/index.html')){
    fs.readFile(path.join(__dirname,'./views/index.html'),(err,data)=>{
      if(err) return console.log(err.message);
      res.end(data)
    })
  }else if(method === 'GET' && url ==='/static/css/index.css'){
    fs.readFile(path.join(__dirname,url),(err,data)=>{
      if(err) return console.log(err.message);
      res.end(data)
    })
  }
})