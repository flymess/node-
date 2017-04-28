/**
 * Created by tao on 2017/4/26.
 */
var request = require('sync-request')
var cheerio = require('cheerio')
var instance = require('superagent')
var iconv = require('iconv-lite')
require('superagent-proxy')(instance)
var fs = require('fs')
var IPList = []

async function i () {
  for (let i = 1;i <= 10;i++){
    var res = request("GET", 'http://www.xicidaili.com/nn/' + i);
    var html = iconv.decode(res.body,'utf8')
    var $ = cheerio.load(html)
    var tr = $('tr')
    //第一行不需要获取
    for (let j = 1;j < tr.length;j++){
      var td = $(tr[j]).children('td')
      var proxy =  'http://' + $(td[1]).text() + ':' + $(td[2]).text();
      try {
        var IP = await instance.get('http://ip.chinaz.com/getip.aspx').timeout(3000).proxy(proxy)
        if (IP.statusCode == 200 && IP.text.substring(0,4) == '{ip:'){
          console.log(proxy)
          let json = new Object()
          json.ip = proxy
          IPList.push(json)
          console.log(IPList)
        }
      }catch (e){
        console.log(e)
      }
    }
  }
  fs.writeFile("IP.json", JSON.stringify(IPList), function (err) {
    if (!err){
      console.log("写入成功")
    }
  })
}

i()