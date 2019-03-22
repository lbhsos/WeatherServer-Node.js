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
        
   
            res.status(200).send(body);
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
          res.status(200).send(body);
        } else {
          console.log('error');
          if(response != null) {
            res.status(response.statusCode).end();
            console.log('error = ' + response.statusCode);
          }
        }
  });

}
module.exports.getWeekFineDust = getWeekFineDust;
module.exports.getRealTimeFineDust = getRealTimeFineDust;


