/**
 * Created by tao on 2017/4/21.
 */
// var request = require('request');
// var cheerio = require('cheerio');
// var fs = require('fs');
//
// function getBiqugeChapter(header, url, i, data) {
//
//   request.get(url[i], function (err, res) {
//     if (err){
//       console.log(err)
//       i++
//       getBiqugeChapter(url, i)
//       return
//     }
//     if (url[i] == undefined) {
//       return
//     }
//     var $ = cheerio.load(res.body)
//     var ContentTitle = $('.bookname h1').text()
//     var ContentText = $('#content').text()
//     data = ContentTitle + ContentText
//     fs.appendFile(header + '.txt', data, function (err) {
//       if (err) return err.stack;
//       console.log('File write done' + ContentTitle)
//     })
//     i++
//     console.log(ContentTitle)
//     getBiqugeChapter(header,url, i, data)
//   })
// }
//
// function getBiquge() {
//   request.get('http://www.biquge.com/2_2970/',function (err, res) {
//     //用cheerio.load加载页面内容，便于使用dom取到数据
//     var $ = cheerio.load(res.body)
//     var items = []
//     var Title = $('#info h1').text()
//     $('#list dd').each((i, elem) => {
//         var url = 'http://www.biquge.com' + $(elem).find('a').attr('href');
//         items.push(url)
//       })
//     getBiqugeChapter(Title,items, 0,'')
//   })
// }
//
// getBiquge()

var http = require('http')
var fs = require('fs')
var cheerio = require('cheerio')
var iconv = require('iconv-lite')
var url = 'http://www.biquge.com/2_2970/'

http.get(url, function (res) {
  var list = []
  res.on('data', function (chunk) {
    list.push(chunk)
  })
  res.on('end', function () {
    var html = iconv.decode(Buffer.concat(list), 'utf-8')
    var $ = cheerio.load(html, {
      decodeEntities: false
    })
    var items = []
    var Title = $('#info h1').text()
    var json = {
      title: Title
    }
    $('#list dd').each((i, elem) => {
      var link = new Object()
      link.title = $(elem).find('a').text()
      link.link = 'http://www.biquge.com' + $(elem).find('a').attr('href')
      items.push(link)
    })
    fs.writeFile("list.json", JSON.stringify(items), function (err) {
      if (!err){
        console.log("写入成功")
      }
    })
    fs.writeFile("header.json", JSON.stringify(json), function (err) {
      if (!err){
        console.log("写入成功")
      }
    })
  }).on('error', function () {
    console.log("网页访问出错")
  })
})

