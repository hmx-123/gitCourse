// 1. 引入模块
const http = require('http')
const fs = require('fs')
const path = require('path')
const mime = require('mime')
const urlObj = require('url')
const querystring = require('querystring')
const template = require('art-template')
const moment = require('moment')

// 2. 创建服务器对象
const app = http.createServer()
// 3. 监听端口并启动服务器
app.listen(3001, () => {
  console.log('server is running at 127.0.0.1:3001')
})
// 4. 注册事件监听请求
app.on('request', (req, res) => {
  // 根据路径进行判断 响应不同的页面
  // 127.0.0.1:3000   默认路径是/ 
  // let url = req.url
  let method = req.method // 把请示方式也加进来
  let {pathname,query} = urlObj.parse(req.url,true)
  if(method === 'GET' && (pathname === '/' || pathname === '/index' || pathname === '/index.html')){
    fs.readFile(path.join(__dirname,'./data.json'),'utf-8',(err,data)=>{

      let arr = JSON.parse(data) // 将JSON形式的字符串转换成真正的对象(数组 obj)
      // const obj = {arr};
      // let htmlStr = template(path.join(__dirname,'./views/index.html'),obj)
      let htmlStr = template(path.join(__dirname,'./views/index.html'),{arr})
      res.end(htmlStr) // 将结果响应给浏览器
    })
  }else if(method === 'GET' && pathname.endsWith('.css')){
    fs.readFile(path.join(__dirname,pathname),(err,data)=>{
      if(err) return console.log(err.message);
      res.end(data)
    })
  }else if (method == 'GET' && pathname == '/add') {
    let htmlStr = template(path.join(__dirname,'./views/add.html'),{})
    res.end(htmlStr);
  }else if( method == 'GET' && pathname.endsWith('.gif') || pathname.endsWith('.jpg') || pathname.endsWith('.jpeg') || pathname.endsWith('.png')){
    // fs.readFile(path.join(__dirname,'./static/images/1.jpg'),(err,data)=>{
        fs.readFile(path.join(__dirname,pathname),(err,data)=>{
        if(err) return console.log(err.message);
        res.end(data);
    })
}else if(method === 'POST' && pathname === '/add'){
   // 接收post方式发送过来的数据，并存入到data.json当中
    // 1. 定义一个变量
  let str = '';
   // 2. 注册一个data事件，监听上传过来的数据
   req.on('data',chunk =>{
      // 每上传一块数据就要添加到str当中  数据是以块的方式传输的
     str += chunk;
   });
    // 3. 注册一个end事件 当end事件触发的时候 表示数据上传完毕
   req.on('end',()=>{
      // 4. 将上传过来的数据转换成对象
     let obj = querystring.parse(str);
       // 5. 读取data.json中的数据
     fs.readFile(path.join(__dirname,'./data.json'),(err,data)=>{
       if(err) return console.log(err.message);
      //  将读取到的数据转换成数组
      let arr = JSON.parse(data);
      // 给传递过来的数据补充id和时间
      // obj.id = Date.now() + Math.trunc(Math.random() * 1000000);
      obj.id = arr.length ? arr[arr.length - 1].id + 1 : 1
      obj.cTime = moment().format('YYYY-MM-DD HH:mm:ss');
      //将数据追加到数组中
      arr.push(obj);
        // 将数据再写回到data.json中
        fs.writeFile(path.join(__dirname,'./data.json'),JSON.stringify(arr,null,'  '),err=>{
          if(err) return console.log(err.message);
          res.writeHead(302,{
            'Location':'/'
          })
          res.end();
        })
     })
   })
}else if(method == 'GET' && pathname == '/del'){
  // 获取传递过来的id  根据id删除原来的数据
  // 获取url中传递过来的id
  let id = query.id;
  // 读取data.json中数据  根据id进行删除
  fs.readFile(path.join(__dirname,'./data.json'),'utf-8',(err,data) =>{
    if(err) return console.log(err.message);
    // 将读取到的数据转换成数组
    let arr = JSON.parse(data);
    // 遍历数据进行删除
    let index = arr.findIndex(item => item.id == id);
    // 删除这些数据
    arr.splice(index,1);
    // 将删除后的数据再存入data.json中
    fs.writeFile(path.join(__dirname,'./data.json'),JSON.stringify(arr,null, '  '),err =>{
      if(err) return console.log(err.message);
      res.writeHead(302,{
        'Location':'/'
      })
      res.end();
    })
  })
}else {
    res.end('404,File Not Found')
  }
})


