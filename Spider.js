/**
 * Created by tao on 2017/4/21.
 */
var http = require('http')
var fs = require('fs')
var cheerio = require('cheerio')
var iconv = require('iconv-lite')
var request = require('superagent')
var Fiber = require('fibers')
require('superagent-proxy')(request)
var urlList = JSON.parse(fs.readFileSync('list.json', 'utf-8'))
var header = JSON.parse(fs.readFileSync('header.json'), 'utf-8')
var IP = JSON.parse(fs.readFileSync('IP.json'),'utf-8')

function getContent(list,title, index, count) {
  var fiber = Fiber.current;
  console.log(IP[count].ip)
  try{
    var Info = request.get(list.link)
      .timeout(3000)
      .proxy(IP[count].ip)
      .end((err, res) =>{
        if(err){
          count++;
          count = count%IP.length;
          console.log("在" + index + "位置爬取" + list.title + "出错")
          console.log("切换IP位置为:" + count)
          start(index, count)
          return
        }

        var $ = cheerio.load(res.text,{
          decodeEntities: false
        });
        var ContentTitle = "\n" + $('.bookname h1').text() + "\n";
        var ContentText = $('#content').html().replace(/<script>/g, "").replace(/<\/script>/g,"").replace("readx();"﻿,"&nbsp;&nbsp;&nbsp;").replace(/<br\s*\/?>/gi,"\r\n").replace(/\&nbsp;/g, ' ');
        fs.appendFileSync(title+".txt", ContentTitle)
        fs.appendFileSync(title+".txt", ContentText)
        console.log("爬取" + list.title + "成功")
        fiber.run()
      })
    Fiber.yield()
  }catch (e){
    console.log(e)
  }
}

function start(index, count) {
  Fiber(function getUrl() {
    for (let i = index;i < urlList.length;i++) {
      getContent(urlList[i], header.title, i, count)
    }
  }).run()
}

start(0,0)