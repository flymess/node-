/**
 * Created by tao on 2017/4/28.
 */
//爬取全部小说
var http = require('http')
var fs = require('fs')
var cheerio = require('cheerio')
var iconv = require('iconv-lite')
var request = require('superagent')
var async = require('async')
var Fiber = require('fibers')
require('superagent-proxy')(request)
var novelList = JSON.parse(fs.readFileSync('novelList.json'), 'utf-8')
var IP = JSON.parse(fs.readFileSync('IP.json'),'utf-8')

async.mapLimit(novelList,5,function (item, callback) {
  // request.get(item.link)
  //   .end((err, res) => {
  //   // if(err){
  //   //   callback("请求错误")
  //   // }
  //   callback("请求成功")
  // })
  callback(null,"ok")
},function (err, results) {
  console.log(results)
})

var arr = [{name:'Jack', delay:200}, {name:'Mike', delay: 100}, {name:'Freewind', delay:300}, {name:'Test', delay: 50}];


async.mapLimit(arr,2, function(item, callback) {
  console.log('1.5 enter: ' + item.name);
  setTimeout(function() {
    console.log('1.5 handle: ' + item.name);
    if(item.name==='Jack') callback('myerr');
    else callback(null, item.name+'!!!');
  }, item.delay);
}, function(err, results) {
  console.log('1.5 err: ', err);
  console.log('1.5 results: ', results);
});
