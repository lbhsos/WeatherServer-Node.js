var https = require('https');
var request = require('request');
var config = require('../config');
var service_key = config.service_key;

var util = require('util');


exports.getRealTimeFineDust = (weather_data)=>{
    
    var url = 'http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getCtprvnMesureSidoLIst';
    var queryParams = '?'+encodeURIComponent('sidoName')+'='+ encodeURIComponent(weather_data.sidoName);
    queryParams += '&'+encodeURIComponent('searchCondition')+'='+encodeURIComponent('HOUR');
    queryParams += '&'+encodeURIComponent('pageNo')+'='+encodeURIComponent('1');
    queryParams += '&'+encodeURIComponent('numOfRows')+'='+encodeURIComponent('100');
    queryParams += '&'+encodeURIComponent('serviceKey')+'='+service_key;
    queryParams += '&'+encodeURIComponent('_returnType')+'='+encodeURIComponent('json');

    return new Promise((resolve, reject)=>{
      request({
        url: url+ queryParams,
        method: 'GET',
    }, function(error, response, body){
        if (!error && response.statusCode == 200) {
            var list = JSON.parse(body).list;
            for(var item in list){

              if(list[item].cityName==weather_data.cityName){
                
                var resItem = {
                    //cityName: list[item].cityName,
                    coValue: list[item].coValue,
                    dataTime: list[item].dataTime,
                    no2Value: list[item].no2Value,
                    o3Value: list[item].o3Value,
                    pm10Value: list[item].pm10Value,
                    pm25Value: list[item].pm25Value,
                    //sidoName: list[item].sidoName,
                    so2Value: list[item].so2Value
                }
    
              }
            }
            
            resolve(resItem);
          } else {
            console.log(error);
            reject({error: 'realtime fineDust error'});
          }
    });
});
};

var number_to_string = function FormatNumberLength(num, length) {
    var r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}


exports.getCurrentData = (weather_data)=>{

    if(weather_data.curTime*1 <= 40){
        var day_str = weather_data.yesterday;
        var time_str = '2340';
    }
    else{
        var day_str = weather_data.today;
        var time_str = weather_data.curTime;
        if((weather_data.curTime*1 % 100) <= 40){
            var day_str = weather_data.today;
            var time_str = number_to_string(weather_data.curTime*1 - 100, 4);
        }
    }

    var url = 'http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastGrib';
    var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + service_key; /* Service Key*/
    queryParams += '&' + encodeURIComponent('base_date') + '=' + day_str; /* ‘15년 12월 1일 발표 */
    queryParams += '&' + encodeURIComponent('base_time') + '=' + time_str; /* 06시30분 발표(30분 단위) - 매시각 45분 이후 호출 */
    queryParams += '&' + encodeURIComponent('nx') + '=' + weather_data.x; /* 예보지점 X 좌표값 */
    queryParams += '&' + encodeURIComponent('ny') + '=' + weather_data.y; /* 예보지점 Y 좌표값 */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('200'); /* 한 페이지 결과 수 */
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* 페이지 번호 */
    queryParams += '&' + encodeURIComponent('_type') + '=' + encodeURIComponent('json'); /* xml(기본값), json*/

    //console.log(weather_data.x);
    //console.log(weather_data.y);

    return new Promise((resolve, reject)=>{
        request({
            url: url + queryParams,
            method: 'GET'
        }, function (error, response, body) {
        var tempValue, humidValue;
        if (!error && response.statusCode == 200) {
            // console.log(body);
            var list = JSON.parse(body).response.body.items.item;
            
            for(var item in list){
                if(list[item].category=="T1H"){
                    tempValue= list[item].obsrValue;
                }
                if(list[item].category == "REH"){
                    humidValue = list[item].obsrValue;
                }
            }

            var resItem = {
                temp: tempValue,
                humid: humidValue,
            }

            resolve(resItem);

            } else {
            console.log('error');
                reject({error: 'getCurrent Data error'}); 
            }
        });
    });
};

//동네예보
exports.getTodayWeather = (weather_data, flag)=>{
    var standardDate, wantedDate;
    var request = require('request');

    if(flag==0) {
        standardDate = weather_data.today;
        afterDate = weather_data.tomorrow;
    }else{
        standardDate = weather_data.tomorrow;
        afterDate = weather_data.dayAfterTomorrow;
    }
    var url = 'http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastSpaceData';
    var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + service_key; /* Service Key*/
    queryParams += '&' + encodeURIComponent('base_date') + '=' + weather_data.today; /* ‘15년 12월 1일발표 */
    queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent('0200'); /* 05시 발표 * 기술문서 참조 */
    queryParams += '&' + encodeURIComponent('nx') + '=' + weather_data.x; /* 예보지점의 X 좌표값 */
    queryParams += '&' + encodeURIComponent('ny') + '=' + weather_data.y; /* 예보지점의 Y 좌표값 */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('200'); /* 한 페이지 결과 수 */
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* 페이지 번호 */
    queryParams += '&' + encodeURIComponent('_type') + '=' + encodeURIComponent('json'); /* xml(기본값), json */
  
    return new Promise((resolve, reject)=>{
        request({
            url: url + queryParams,
            method: 'GET'
        }, function (error, response, body) {      
            var ptyValue, skyValue, tmnValue, tmxValue, t3hValue, popValue;
            var timeArr=['0600','0900', '1200', '1500', '1800', '2100'];
            var resItem={};

            if (!error && response.statusCode == 200) {
                var list = JSON.parse(body).response.body.items.item;
                for(var time in timeArr){
                    for(var item in list){
                        if(list[item].fcstTime == timeArr[time] && list[item].fcstDate == standardDate){
                        if(list[item].category=="PTY"){
                            ptyValue = list[item].fcstValue;
                        }
                        if(list[item].category == "SKY"){
                            skyValue = list[item].fcstValue;
                        }
                        if(list[item].category == "TMN"){
                            tmnValue = list[item].fcstValue;
                        }
                        if(list[item].category == "TMX"){
                            tmxValue = list[item].fcstValue;
                        }
                        if(list[item].category == "T3H"){
                            t3hValue = list[item].fcstValue;
                        }
                        if(list[item].category == "POP"){
                            popValue = list[item].fcstValue;
                        }
                        }
                        
                        let data = {
                            fcstDate: standardDate,
                            fcstTime: timeArr[time],
                            pty: ptyValue,
                            sky: skyValue,
                            highestTemp: tmxValue,
                            lowestTemp: tmnValue,
                            temp: t3hValue,
                            rainPop: popValue,
                        }
                        resItem[timeArr[time]]=data;
                    }
                }

                resolve(resItem);
            } 
            else {
                console.log('error');
                reject({error: 'today weather error'});
            }
        
        });
    });
};

exports.getHeatLife = (weather_data)=>{
    var request = require('request');
    if( parseInt(weather_data.curTime*1 / 100) < 6){
        var today_str = weather_data.yesterday+"18";
    }
    else{
        var today_str = weather_data.today+"06";
    }

    var url = 'http://newsky2.kma.go.kr/iros/RetrieveLifeIndexService3/getSensoryHeatLifeList';
    var queryParams = '?' + encodeURIComponent('ServiceKey') + '='+service_key; /* Service Key*/
    //queryParams += '&' + encodeURIComponent('ServiceKey') + '=' + encodeURIComponent('-'); /* 공공데이터포털에서 받은 인증키 */
    queryParams += '&' + encodeURIComponent('areaNo') + '=' + weather_data.areaNo; /* 서울지점 */
    queryParams += '&' + encodeURIComponent('requestCode') + '=' + encodeURIComponent('A20'); /* 일반인 */
    queryParams += '&' + encodeURIComponent('time') + '=' + today_str; /* 2017년 6월 8일 6시 발표 */
    queryParams += '&' + encodeURIComponent('_type') + '=' + encodeURIComponent('json'); /* xml , json 선택 */
    
    //console.log(url + queryParams);

    return new Promise((resolve, reject)=>{
        request({
            url: url + queryParams,
            method: 'GET'
        }, function (error, response, body) {
          var today_heat={};
          var tomorrow_heat={};
          //console.log(body);
          if (!error && response.statusCode == 200) {
            //console.log(body);z
            var list = JSON.parse(body).Response.body.indexModel;
            var keys = Object.keys(list);
            //console.log(list);
            //console.log(keys);
            for (key_index in keys){
                var key = keys[key_index]
                if(key.startsWith("h")){
                    var num_behind_h = key.substring(1) * 1;
                    if(num_behind_h <= 18){
                        today_heat.key = list[key];
                    }else if(num_behind_h <= 36){
                        tomorrow_heat.key= list[key];
                    }
                }
            }
           
            //console.log(today_heat);
            var resItem = {
                today_heat: today_heat,
                tomorrow_heat: tomorrow_heat,
            }
      
            resolve(resItem);
            } else {
              console.log('error');
            reject({error: 'getCurrent Data error'}); 
            }
        });
    });
};

exports.getUltraVLife = (weather_data)=>{
    var request = require('request');
    var today_str = weather_data.today+"06";
    //console.log(today_str);
    
    var url = 'http://newsky2.kma.go.kr/iros/RetrieveLifeIndexService3/getUltrvLifeList';
    var queryParams = '?' + encodeURIComponent('ServiceKey') + '='+ service_key; /* Service Key*/
    queryParams += '&' + encodeURIComponent('areaNo') + '=' +weather_data.areaNo; /* 서울지점 */
    queryParams += '&' + encodeURIComponent('requestCode') + '=' + encodeURIComponent('A20'); /* 일반인 */
    queryParams += '&' + encodeURIComponent('time') + '=' + today_str; /* 2017년6월8일6시 */
    queryParams += '&' + encodeURIComponent('_type') + '=' + encodeURIComponent('json'); /* xml, json 선택(미입력시 xml) */

    return new Promise((resolve, reject)=>{
        request({
            url: url + queryParams,
            method: 'GET'
        }, function (error, response, body) {
          var today_ultrav;
          var tomorrow_ultrav;
          var theDayAfterTomorrow_ultrav;
          //console.log(body);
          if (!error && response.statusCode == 200) {
              //console.log(body);
            var list = JSON.parse(body).Response.body.indexModel;
            today_ultrav = list.today;
            tomorrow_ultrav = list.tomorrow;
            theDayAfterTomorrow_ultrav=list.theDayAfterTomorrow;

           
            var resItem = {
                today_ultrav: today_ultrav,
                tomorrow_ultrav: tomorrow_ultrav,
                theDayAfterTomorrow_ultrav: theDayAfterTomorrow_ultrav
            }
      
            resolve(resItem);
            } else {
              console.log('error');
                reject({error: 'getCurrent Data error'}); 
            }
        });
    });
};

exports.getMiddleLandWeather = (weather_data)=>{
    var request = require('request');
    var base_str = weather_data.today+"0600";
    var url = 'http://newsky2.kma.go.kr/service/MiddleFrcstInfoService/getMiddleLandWeather';
    var queryParams = '?' + encodeURIComponent('ServiceKey') + '='+service_key; /* Service Key*/
    //queryParams += '&' + encodeURIComponent('ServiceKey') + '=' + encodeURIComponent('-'); /* 공공데이터포털에서 받은 인증키 */
    queryParams += '&' + encodeURIComponent('regId') + '=' +encodeURIComponent('11B00000'); /* 서울지점 */
    queryParams += '&' + encodeURIComponent('tmFc') + '=' + base_str; /* 2017년6월8일6시 */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1'); 
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); 
    queryParams += '&' + encodeURIComponent('_type') + '=' + encodeURIComponent('json'); /* xml, json 선택(미입력시 xml) */
    return new Promise((resolve, reject)=>{
        request({
            url: url + queryParams,
            method: 'GET'
        }, function (error, response, body) {
         
          if (!error && response.statusCode == 200) {
            var list = JSON.parse(body).response.body.items.item;
            var resItem = list;

            resolve(resItem);
            } else {
              console.log('error');
                reject({error: 'getCurrent Data error'}); 
            }

        });
    });
}


exports.getMiddleTemperature= (weather_data)=>{
    var request = require('request');
    var base_str = weather_data.today+"0600";
    //console.log(weather_data.tmFc);
    var url = 'http://newsky2.kma.go.kr/service/MiddleFrcstInfoService/getMiddleTemperature';
    var queryParams = '?' + encodeURIComponent('ServiceKey') + '='+service_key; /* Service Key*/
    queryParams += '&' + encodeURIComponent('regId') + '=' +encodeURIComponent(weather_data.tmFc); /* 서울지점 */
    queryParams += '&' + encodeURIComponent('tmFc') + '=' + base_str; /* 2017년6월8일6시 */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); 
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); 
    queryParams += '&' + encodeURIComponent('_type') + '=' + encodeURIComponent('json'); /* xml, json 선택(미입력시 xml) */
    console.log(url + queryParams);
    return new Promise((resolve, reject)=>{
        request({
            url: url + queryParams,
            method: 'GET'
        }, function (error, response, body) {
         
          if (!error && response.statusCode == 200) {
            // console.log(body);
            var list = JSON.parse(body).response.body.items.item;
           
            var resItem = list;
            resolve(resItem);
            } else {
              console.log('error');
                reject({error: 'getmiddle temp Data error'}); 
            }

        });
    });
};


function getCurrentDate(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var today = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var milliseconds = date.getMilliseconds();
    return new Date(Date.UTC(year, month, today, hours, minutes, seconds, milliseconds));
}
exports.show_best_board = (db)=>{
    //24시간 기준 정보 가져오기.
    var database = db;
    return new Promise((resolve, reject)=>{
        var curDate = getCurrentDate();
        database.boardModel.find({"expireAt":{"$gte": curDate}}, function(err, result){
            if(err){
                reject(err);
            }else{
                if(result<=0){
                        resolve({message: "there is no data"});
                }else{
                    resolve(result);
                }
            }
        }).limit(3).sort({timestamp:-1} && {like:-1});
    });
}
