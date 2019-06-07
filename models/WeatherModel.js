var https = require('https');
var request = require('request');
var config = require('../config');
var moment = require('moment');
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
	try{ 
           var list = JSON.parse(body).list;
        }catch(error){
		console.log(error);
	}   
	 for(var item in list){
              if(list[item].cityName==weather_data.cityName){
                var resItem = {
                    coValue: list[item].coValue,
                    dataTime: list[item].dataTime,
                    no2Value: list[item].no2Value,
                    o3Value: list[item].o3Value,
                    pm10Value: list[item].pm10Value,
                    pm25Value: list[item].pm25Value,
                    so2Value: list[item].so2Value
                }
    
              }
            }
            
            resolve(resItem);
          } else {
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

    return new Promise((resolve, reject)=>{
        request({
            url: url + queryParams,
            method: 'GET'
        }, function (error, response, body) {
        var tempValue, humidValue, rainfallValue;
        if (!error && response.statusCode == 200) {
            // console.log(body);
        try{   
	 var list = JSON.parse(body).response.body.items.item;
            }catch(error){console.log(error);}
            for(var item in list){
                if(list[item].category=="T1H"){
                    tempValue= list[item].obsrValue;
                }
                if(list[item].category == "REH"){
                    humidValue = list[item].obsrValue;
                }
                if(list[item].category == "RN1"){
                    rainfallValue = list[item].obsrValue;
                }
            }

            var resItem = {
                temp: tempValue,
                humid: humidValue,
                rainfall: rainfallValue
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
    var standardDate, basetime, basedate;
    var request = require('request');
    
    if(moment('0500').isAfter(weather_data.curTime)){
        basedate = weather_data.yesterday;
        basetime = '0500';
    }else{
        basedate = weather_data.today;
        basetime='0200';
    }

    if(flag==0) {
        standardDate = weather_data.today;
        afterDate = weather_data.tomorrow;
    }else{
        standardDate = weather_data.tomorrow;
        afterDate = weather_data.dayAfterTomorrow;
    }
    var url = 'http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastSpaceData';
    var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + service_key; /* Service Key*/
    queryParams += '&' + encodeURIComponent('base_date') + '=' + basedate; /* ‘15년 12월 1일발표 */
    queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent(basetime); /* 05시 발표 * 기술문서 참조 */
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
            var ptyValue, skyValue, tmnValue, tmxValue, t3hValue, popValue, rainfallValue, snowfallValue, humidValue, windValue;
            var temp_message_data, sky_message_data; 
            var timeArr=['0600','0900', '1200', '1500', '1800', '2100'];
            var resItem={};
            if (!error && response.statusCode == 200) {
                try{
		var list = JSON.parse(body).response.body.items.item;
                }catch(error){console.log(error);}
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
                            if(list[item].category == "R06"){
                                rainfallValue = list[item].fcstValue;
                            }
                            if(list[item].category == "S06"){
                                snowfallValue = list[item].fcstValue;
                            }
                            if(list[item].category == "WSD"){
                                windValue = list[item].fcstValue;
                            }
                            if(list[item].category == "REH"){
                                humidValue = list[item].fcstValue;
                            }
                        
                            
                            if(ptyValue != null){
                                {
                                    if(ptyValue == 0 && (skyValue != null)){
                                        sky_message_data = get_sky_message(ptyValue, skyValue);
                                        //console.log('test');
                                    }else if((ptyValue == 1 && (rainfallValue != null))){
                                        sky_message_data = get_sky_message(ptyValue, rainfallValue);
                                    }else if((ptyValue == 2)){
                                        sky_message_data = get_sky_message(ptyValue, 0);
                                    }else if((ptyValue == 3 && (snowfallValue != null))){
                                        sky_message_data = get_sky_message(ptyValue, snowfallValue);
                                    }
                                }  
                            }
                            if(t3hValue != null) {
                                temp_message_data = get_temp_message(t3hValue);
                                //console.log('test2');
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
                            rainfallValue: rainfallValue,
                            snowfallValue: snowfallValue,
                            humid: humidValue,
                            wind: windValue,
                            temp_message : temp_message_data,
                            sky_message : sky_message_data
                        }
                        // console.log(timeArr);
                        // console.log(time);
                        //console.log(temp_message_data);
                        resItem[timeArr[time]]=data;
                    }
                }

                resolve(resItem);
            } 
            else {
                console.log(error);
                reject({error: 'today weather error'});
            }
        
        });
    });
};


function range(start, stop, step) {
    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
};

var get_temp_message = function(temperature){
    var temp_data = global.temp_data.data;

    if(23 <= temperature && temperature < 28){
        return temp_data[0];
    }
    else if(19 <= temperature && temperature < 23){
        //console.log(temp_data[1]);
        //console.log(global.temp_data[1]);
        return temp_data[1];
    }
    else if(17 <= temperature && temperature < 19){
        return temp_data[2];
    }
    else if(12 <= temperature && temperature < 17){
        return temp_data[3];
    }
    else if(10 <= temperature && temperature < 12){
        return temp_data[4];
    }
    else if(6 <= temperature && temperature < 10){
        return temp_data[5];
    }
    else if(0 <= temperature && temperature < 6){
        return temp_data[6];
    }
};

var get_sky_message = function(type, data){
    var sky_data = global.sky_data.data;
    switch( type ) {
        case 0 :  // 하늘
            switch(data){
                case 1: // 맑음
                    return sky_data[0];
                break
                case 2: // 구름 조금
                    return sky_data[1];
                break
                case 3: // 구름 많음
                    return sky_data[2];
                break
                case 4: //  흐림
                    return sky_data[3];
                break
                default:
                break
            }
        break;
        
        case 1 :  // 강수량
            if(data < 0.1){
                return sky_data[4];
            }
            else if(0.1 <= data && data < 1){
                return sky_data[5];
            }
            else if(1 <= data && data < 5){
                return sky_data[6];
            }
            else if(5 <= data && data < 10){
                return sky_data[7];
            }
            else if(10 <= data && data < 20){
                return sky_data[8];
            }
            else if(20 <= data && data < 40){
                return sky_data[9];
            }
            else if(40 <= data && data < 70){
                return sky_data[10];
            }
            else if(70 <= data){
                return sky_data[11];
            }
        break;
        
        case 2 :  // 진눈깨비
            return "촉촉한 진눈깨비"
        break;
        
        case 3 :  // 적설량
            if(data < 0.1){
                return sky_data[12];
            }
            else if(0.1 <= data && data < 1){
                return sky_data[13];
            }
            else if(1 <= data && data < 5){
                return sky_data[14];
            }
            else if(5 <= data && data < 10){
                return sky_data[15];
            }
            else if(10 <= data && data < 20){
                return sky_data[16];
            }
            else if(20 <= data){
                return sky_data[17];
            }
        break;
        
        default:
        break;

    }    
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
    queryParams += '&' + encodeURIComponent('areaNo') + '=' + weather_data.areaNo; /* 서울지점 */
    queryParams += '&' + encodeURIComponent('requestCode') + '=' + encodeURIComponent('A20'); /* 일반인 */
    queryParams += '&' + encodeURIComponent('time') + '=' + today_str; /* 2017년 6월 8일 6시 발표 */
    queryParams += '&' + encodeURIComponent('_type') + '=' + encodeURIComponent('json'); /* xml , json 선택 */

    return new Promise((resolve, reject)=>{
        request({
            url: url + queryParams,
            method: 'GET'
        }, function (error, response, body) {
          var today_heat={};
          var tomorrow_heat={};
        
          if (!error && response.statusCode == 200) {
            try{
		var list = JSON.parse(body).Response.body.indexModel;
            }catch(error){console.log(error);}
		var keys = Object.keys(list);
            for (key_index in keys){
                var key = keys[key_index]
                
                if(key[0] == "h"){
                    var num_behind_h = key.substring(1) * 1;
                    if(num_behind_h <= 18){
                        today_heat = list[key];
                    }else if(num_behind_h <= 36){
                        tomorrow_heat= list[key];
                    }
                }
            }

            var today_heat_message = get_heat_message(today_heat);
            var tomorrow_heat_message = get_heat_message(tomorrow_heat);

            var resItem = {
                today_heat: today_heat,
                tomorrow_heat: tomorrow_heat,
                today_heat_message: today_heat_message,
                tomorrow_heat_message: tomorrow_heat_message,
            }
      
            resolve(resItem);
            } else {
              console.log('error');
            reject({error: 'getCurrent Data error'}); 
            }
        });
    });
};

var get_heat_message = function(value){
    var heat_data = global.life_data.data.heat;
    if(value<32){
        return heat_data[4];
    }else if(value >=32 && value<41){
        return heat_data[3];
    }else if(value >=41 && value<54){
        return heat_data[2];
    }else if(value >=54 && value<65){
        return heat_data[1];
    }else if(value >=65){
        return heat_data[0];
    }
}

exports.getUltraVLife = (weather_data)=>{
    var request = require('request');
    var today_str;
    var flag = 0;
    if(moment('0600').isAfter(weather_data.curTime)){
        today_str = weather_data.yesterday+"06";;
    }else{
        today_str = weather_data.today+"06";
        flag =1;
    }

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
          if (!error && response.statusCode == 200) {
        try{    
	var list = JSON.parse(body).Response.body.indexModel;
        }catch(error){console.log(error);}    
	if(flag == 0){
                today_ultrav = list.tomorrow;
                tomorrow_ultrav = list.theDayAfterTomorrow;
            }else{
                today_ultrav = list.today;
                tomorrow_ultrav = list.tomorrow;
                theDayAfterTomorrow_ultrav=list.theDayAfterTomorrow;
            }
           
            var today_ultrav_message = get_ultrav_message(today_ultrav);
            var tomorrow_ultrav_message = get_ultrav_message(tomorrow_ultrav);

            var resItem = {
                today_ultrav: today_ultrav,
                tomorrow_ultrav: tomorrow_ultrav,
                today_ultrav_message: today_ultrav_message,
                tomorrow_ultrav_message: tomorrow_ultrav_message,
            }
      
            resolve(resItem);
            } else {
              console.log('error');
                reject({error: 'getCurrent Data error'}); 
            }
        });
    });
};

var get_ultrav_message = function(value){
    var uv_data = global.life_data.data.uv;
    if(value >=11){
        return uv_data[0];
    }else if(value >=8 && value<11){
        return uv_data[1];
    }else if(value >=6 && value<8){
        return uv_data[2];
    }else if(value >=3 && value<6){
        return uv_data[3];
    }else if(value >=0 && value<3){
        return uv_data[4];
    }
}

exports.getMiddleLandWeather = (weather_data)=>{
    var request = require('request');
    var base_str;
    var flag = 0;
    if(moment('0600').isAfter(weather_data.curTime)){
        base_str = weather_data.yesterday+"1800";;
    }else{
        base_str = weather_data.today+"0600";
        flag =1;
    }

    var url = 'http://newsky2.kma.go.kr/service/MiddleFrcstInfoService/getMiddleLandWeather';
    var queryParams = '?' + encodeURIComponent('ServiceKey') + '='+service_key; /* Service Key*/
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
        try{    
	var list = JSON.parse(body).response.body.items.item;
        }catch(error){console.log(error);}    
		if(flag==0){
                var resItem = {
                    "regId": list.regId,
                    "wf3Am": list.wf4Am,
                    "wf3Pm": list.wf4Pm,
                    "wf4Am": list.wf5Am,
                    "wf4Pm": list.wf5Pm,
                    "wf5Am": list.wf6Am,
                    "wf5Pm": list.wf6Pm,
                    "wf6Am": list.wf7Am,
                    "wf6Pm": list.wf7Pm,
                    "wf7": list.wf8,
                    "wf8": list.wf9,
                    "wf9": list.wf10,              
                }
            }else{
                var resItem = list;
            }
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
    var base_str;
    var flag = 0;
    if(moment('0600').isAfter(weather_data.curTime)){
        base_str = weather_data.yesterday+"1800";;
    }else{
        base_str = weather_data.today+"0600";
        flag = 1;
    }

    var url = 'http://newsky2.kma.go.kr/service/MiddleFrcstInfoService/getMiddleTemperature';
    var queryParams = '?' + encodeURIComponent('ServiceKey') + '='+service_key; /* Service Key*/
    queryParams += '&' + encodeURIComponent('regId') + '=' +encodeURIComponent(weather_data.tmFc); /* 서울지점 */
    queryParams += '&' + encodeURIComponent('tmFc') + '=' + base_str; /* 2017년6월8일6시 */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); 
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); 
    queryParams += '&' + encodeURIComponent('_type') + '=' + encodeURIComponent('json'); /* xml, json 선택(미입력시 xml) */
    return new Promise((resolve, reject)=>{
        request({
            url: url + queryParams,
            method: 'GET'
        }, function (error, response, body) {
         
          if (!error && response.statusCode == 200) {
            try{
		var list = JSON.parse(body).response.body.items.item;
           }catch(error){console.log(error);}
		 if(flag==0){
                var resItem = {
                    "regId": list.regId,
                    "taMin3": list.taMin4,
                    "taMax3": list.taMax4,
                    "taMin4": list.taMin5,
                    "taMax4": list.taMin5,
                    "taMin5": list.taMin6,
                    "taMax5": list.taMax6,
                    "taMin6": list.taMin7,
                    "taMax6": list.taMax7,
                    "taMin7": list.taMin8,
                    "taMax7": list.taMax8,
                    "taMin8": list.taMin9,
                    "taMax8": list.taMax9,
                    "taMin9": list.taMin10,
                    "taMax9": list.taMax10   
                }
            }else{
                var resItem = list;
            }         
            resolve(resItem);
            } else {
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

exports.show_best_board = (db,pos)=>{
    //24시간 기준 정보 가져오기.
    var database = db;
    return new Promise((resolve, reject)=>{
        var curDate = getCurrentDate();
        database.boardModel.find({$and:[{"like":{"$gte":5}},{"expireAt":{"$gte": curDate}},{"pos": pos}]}, function(err, result){
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
