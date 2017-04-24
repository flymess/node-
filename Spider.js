/**
 * Created by tao on 2017/4/21.
 */
var http = require('http')
var fs = require('fs')
var cheerio = require('cheerio')
var iconv = require('iconv-lite')
var request = require('sync-request')
var urlList = JSON.parse(fs.readFileSync('list.json', 'utf-8'))
var header = JSON.parse(fs.readFileSync('header.json'), 'utf-8')

function getContent(list,title) {
  try{
    var res = request('GET',list.link,{
      'timeout': 10000,
      'retry': true,
      'retryDelay': 10000
    })
    var html = iconv.decode(res.body, 'utf8')
    var $ = cheerio.load(html,{
      decodeEntities: false
    })
    var ContentTitle = $('.bookname h1').text()
    var ContentText = $('#content').text().trim().replace('readx();', '').replace(/\&nbsp;/g, '')
    fs.appendFileSync(title+".txt", ContentTitle)
    fs.appendFileSync(title+".txt", ContentText)
    console.log("爬取" + list.link + "成功")
  }catch(err) {
    console.log("爬取" + list.link + "出错")
  }
}

function getUrl(index) {
  for (let i = index;i < urlList.length;i++){
    if (i>0 && i%10 == 0){
      getContent(urlList[i],header.title)
      console.log("休息一下")
      setTimeout(() => {
        i++
        getUrl(i)
      },20000)
      return
    }else {
      console.log(i)
      getContent(urlList[i],header.title)
    }
  }
}

getUrl(0)