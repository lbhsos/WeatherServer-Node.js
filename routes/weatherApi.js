var https = require('https');
var request = require('request');
var config = require('../config');
var getRealTimeFineDust = function(req, res, next){
    var service_key = config.service_key;
    var url = 'http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getCtprvnMesureSidoLIst';
    var queryParams = '?'+encodeURIComponent('sidoName')+'='+encodeURIComponent('서울');
    queryParams += '&'+encodeURIComponent('searchCondition')+'='+encodeURIComponent('DAILY');
    queryParams += '&'+encodeURIComponent('pageNo')+'='+encodeURIComponent('1');
    queryParams += '&'+encodeURIComponent('numOfRows')+'='+encodeURIComponent('10');
    queryParams += '&'+encodeURIComponent('serviceKey')+'='+service_key;
    queryParams += '&'+encodeURIComponent('_returnType')+'='+encodeURIComponent('json');

    request({
        url: url+ queryParams,
        method: 'GET',
    }, function(error, response, body){
        if (!error && response.statusCode == 200) {
            var list = JSON.parse(body).list;
            //console.log(req.params.cityName);
            //console.log(req.query.cityName);
            for(var item in list){
              if(list[item].cityName==req.params.cityName || req.query.cityName){
                console.log(list[item]);
                var resItem = {
                  no2Value: list[item].no2Value,
                  o3Value: list[item].o3Value,
                  pm10Value: list[item].pm10Value,
                  pm25Value: list[item].pm25Value,
                  so2Value: list[item].so2Value,
                  sidoName: list[item].sidoName,
                  dataTime: list[item].dataTime,
                  cityName: list[item].cityName,
                }
              }
            }

            return res.status(200).json(resItem);
          } else {
            console.log('error');
            if(response != null) {
              res.status(response.statusCode).end();
              console.log('error = ' + response.statusCode);
            }
          }
    });
    
}


var getWeekFineDust = function(req, res, next){
  var service_key = config.service_key;
  var url = 'http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnStatsSvc/getMsrstnAcctoLastDcsnDnsty';

  var queryParams = '?'+encodeURIComponent('stationName')+'='+encodeURIComponent('종로구');
  queryParams += '&'+encodeURIComponent('searchCondition')+'='+encodeURIComponent('DAILY');
  queryParams += '&'+encodeURIComponent('pageNo')+'='+encodeURIComponent('1');
  queryParams += '&'+encodeURIComponent('numOfRows')+'='+encodeURIComponent('10');
  queryParams += '&'+encodeURIComponent('serviceKey')+'='+service_key;
  queryParams += '&'+encodeURIComponent('_returnType')+'='+encodeURIComponent('json');
    
    request({
      url: url+ queryParams,
      method: 'GET',
  }, function(error, response, body){
      if (!error && response.statusCode == 200) {
          var list = JSON.parse(body).list;
          //console.log(req.params.cityName);
          //console.log(req.query.cityName);
          for(var item in list){
            
            if(list[item].cityName==req.params.cityName || req.query.cityName){
              
              console.log(list[item]);
              // var resItem = {
              //   no2Value: list[item].no2Value,
              //   o3Value: list[item].o3Value,
              //   pm10Value: list[item].pm10Value,
              //   pm25Value: list[item].pm25Value,
              //   so2Value: list[item].so2Value,
              //   sidoName: list[item].sidoName,
              //   dataTime: list[item].dataTime,
              //   cityName: list[item].cityName,
              // }
            }
          }

          return res.status(200).send(body);
        } else {
          console.log('error');
          if(response != null) {
            res.status(response.statusCode).end();
            console.log('error = ' + response.statusCode);
          }
        }
  });

}

module.exports.getRealTimeFineDust = getRealTimeFineDust;
module.exports.getWeekFineDust = getWeekFineDust;