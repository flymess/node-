/**
 * Created by tao on 2017/4/28.
 */
//爬取笔趣阁全网小说列表
var http = require('http')
var fs = require('fs')
var cheerio = require('cheerio')
var iconv = require('iconv-lite')
var request = require('sync-request')
var url = 'http://zhannei.baidu.com/cse/search?s=287293036948159515&q='
var nextUrl = 'http://zhannei.baidu.com/cse/'

http.get(url, function (res) {
  var list = []

  res.on('data', function (chunk) {
    list.push(chunk)
  })
  res.on('end', function () {
    var html = iconv.decode(Buffer.concat(list), 'utf-8')
    var data = []
    var $ = cheerio.load(html, {
      decodeEntities: false
    })
    $('.result-game-item-title-link').each((i, elem) =>{
      var json = new Object()
      var link = $(elem).attr('href')
      var title = $(elem).attr('title')
      json.link = link
      json.title = title
      data.push(json)
    })
    fs.writeFileSync('novelList.json',JSON.stringify(data))
    var url = nextUrl + $('#pageFooter a:last-child').attr('href')
    getNextUrl(url)
  })
})

function getNextUrl(url) {
  var res = request("POST",url)
  var data = []
  var html = iconv.decode(res.body,'utf-8')
  var $ = cheerio.load(html, {
    decodeEntities: false
  })
  $('.result-game-item-title-link').each((i, elem) =>{
    var json = new Object()
    var link = $(elem).attr('href')
    var title = $(elem).attr('title')
    json.link = link
    json.title = title
    data.push(json)
  })
  var urlList = JSON.parse(fs.readFileSync('novelList.json','utf-8'))
  urlList = urlList.concat(data)
  console.log(urlList)
  fs.writeFileSync('novelList.json',JSON.stringify(urlList))
  var url = nextUrl + $('#pageFooter a:last-child').attr('href')
  if (url == 'http://zhannei.baidu.com/cse/search?q=&p=75&s=287293036948159515'){
    console.log("抓取全网小说链接完毕")
    return
  }
  console.log(url)
  getNextUrl(url)
}