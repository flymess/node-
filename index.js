/**
 * Created by tao on 2017/4/21.
 */
//爬取单本小说的所有章节

var http = require('http')
var fs = require('fs')
var cheerio = require('cheerio')
var iconv = require('iconv-lite')
var url = 'http://www.biqudu.com/0_29/'

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

