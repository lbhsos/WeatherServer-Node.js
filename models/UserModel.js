'use strict';
const res_msg = require('../error.json');
/* model definition */
var request = require('request');
var config = require('../config');
var map_key = config.map_key;
var pos= null;
var urlencode = require('urlencode');

exports.getLocationInfo = (user_data)=>{
    
    var url = 'https://dapi.kakao.com/v2/local/geo/coord2regioncode.json';
    var queryParams = '?'+encodeURIComponent('x')+'='+encodeURIComponent(user_data.lng);
    queryParams += '&'+encodeURIComponent('y')+'='+encodeURIComponent(user_data.lat);

    var header = { 
        Authorization: "KakaoAK " + map_key
    };
    console.log(url+queryParams);
    return new Promise((resolve, reject)=>{
        request({
            headers : header,
            url: url + queryParams,
            method: 'GET',
        }, function(error, response, body){
            if (!error && response.statusCode == 200) {
                var list = JSON.parse(body).documents;
                var firstItem = list[0];
                var sidoName = firstItem.region_1depth_name;
                var cityName = firstItem.region_2depth_name;
                var townName = firstItem.region_3depth_name;

                var location_xy = global.location_data.filter(function(o){      
                    return (sidoName.includes(o['1단계']) && cityName.includes(o['2단계']) && townName.includes(o['3단계']));
                })
                location_xy = location_xy[0];
                
                var areacode = global.area_data.filter(function(o){      
                    return (sidoName.includes(o['1단계']) && cityName.includes(o['2단계']) && townName.includes(o['3단계']));
                })
                areacode = areacode[0];

                var tmcode = global.tm_data.filter(function(o){
                    return (sidoName.includes(o['도시']) || cityName.includes(o['도시']));
                })
                tmcode = tmcode[0];
                
                if(sidoName == '서울특별시') sidoName = '서울';
                else if(sidoName == '경기도') sidoName = '경기';
                
                if(user_data.lat >= 37.509497){
                    pos="up";
                }else{
                    pos="down";
                }
                var region = {
                    cityName: cityName,
                    sidoName: sidoName,
                    townName: townName,
                    x:location_xy.X,
                    y:location_xy.Y,
                    areaNo: areacode.areaNo,
                    tmcode: tmcode.tmFc,
                    pos: pos
                }
                //console.log(region.x +" "+region.y);
                resolve(region);
            } else {
                console.log('error : ' + error);
                reject(res_msg[1300]);
            }
        });
    });
};

exports.getStringAddress = (user_data)=>{
    
    var url = 'https://dapi.kakao.com/v2/local/search/address.json';
    var queryParams = '?'+encodeURIComponent('query')+'='+encodeURIComponent(user_data.keyword);
   
    var header = { 
        Authorization: "KakaoAK " + map_key,
    };
    //console.log(url+queryParams);
    return new Promise((resolve, reject)=>{
        request({
            headers : header,
            url: url+queryParams,
            method: 'GET',
        }, function(error, response, body){
            if(!error){
                //console.log(body);
                var ret = new Array;
                var list = JSON.parse(body).documents;
              
                var count=0;
                for(var item in list){
                    var temp = {
                        address_name: list[item].address_name,
                        x: list[item].x,
                        y: list[item].y,
                    }
                    ret.push(temp);
                }
                console.log(ret);
                resolve(ret);
            }else{
                reject(res_msg[1300]);
            }
            
        })
    })
};


exports.register_user = (db,user_data)=>{  
    console.log("새로운 인스턴스 객체 "); 
    var database = db;
    return new Promise((resolve, reject)=>{
        database.userModel.find({"nickname": user_data.nickname}, function(err, result){
            if(err){
                reject(res_msg[1500]);
            }else{
                if(result.length>0){
                    reject(res_msg[1301]);
                }else{
                    resolve(null);
                }
            }
        });
    }).then(()=>{
        //추가 
        return new Promise((resolve, reject)=>{
            var newUser = new database.userModel({
                type: user_data.type,
                uid: user_data.uid,
                nickname: user_data.nickname, 
                lat: user_data.lat, 
                lng: user_data.lng,
                region: user_data.region});
                newUser.save(function(err){
                if(err){
                    console.log('hi');
                    reject(res_msg[1500]);
                }else{
                    resolve(null);
                }
            });
        });
    });
};

exports.login_user = (db,user_data)=>{    
    console.log("새로운 인스턴스 객체 "); 
    var database = db;
    return new Promise((resolve, reject)=>{
        database.userModel.find({"uid" :user_data.uid, "type": user_data.type}, function(err, result){
            if(err){
                reject(res_msg[1500]);
            }else{
                if(result.length<=0){
                    reject(res_msg[1300]);
                }else{
                    resolve(result[0]);
                }
            }
        });
    });
};

exports.show_user = (db,user_data)=>{   
    var database = db;
    return new Promise((resolve, reject)=>{
        database.userModel.find({"uid" :user_data.uid, "type": user_data.type}, function(err, result){
            if(err){
                reject(res_msg[1500]);
            }else{
                if(result.length<=0){
                    reject(res_msg[1300]);
                }else{
                    resolve(result[0]._doc);
                }
            }
        });
    });
};

exports.edit_nickname = (db,user_data)=>{ 
    var database = db;
    return new Promise((resolve, reject)=>{
        database.userModel.findOne({"uid" :user_data.uid, "type": user_data.type, "nickname": user_data.prevName}, function(err, result){
            if(!result){
                reject(res_msg[1300]);
            }
            else{
                database.userModel.update({'nickname': user_data.prevName}, {$set:{'nickname': user_data.newName}}).exec();
                resolve(null);
            }
        })
    });
};

exports.edit_location = (db,user_data)=>{ 
    var database = db;
    return new Promise((resolve, reject)=>{
        database.userModel.findOne({"uid" :user_data.uid, "type": user_data.type}, function(err, result){
            if(!result){
                reject(res_msg[1300]);
            }
            else{
                database.userModel.update({$set:{'lat': user_data.lat, 'lng': user_data.lng,"region":user_data.region}}).exec();
                resolve(null);
            }
        })
    });
};

