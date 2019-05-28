'use strict';
const res_msg = require('../error.json');
const crypto = require('crypto');
/* model definition */
var request = require('request');
var config = require('../config');
var map_key = config.map_key;
var pos= null;

exports.getLocationInfo = (user_data)=>{
    
    var url = 'https://dapi.kakao.com/v2/local/geo/coord2regioncode.json';
    var queryParams = '?'+encodeURIComponent('x')+'='+encodeURIComponent(user_data.lng);
    queryParams += '&'+encodeURIComponent('y')+'='+encodeURIComponent(user_data.lat);

    var header = { 
        Authorization: "KakaoAK " + map_key
    };
    //console.log(url+queryParams);
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
                //console.log(ret);
                resolve(ret);
            }else{
                reject(res_msg[1300]);
            }
            
        })
    })
};

exports.check_nickname = (db,user_data)=>{   
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
    });
};



exports.register_user = (db,user_data)=>{   
    var database = db;
    let hashUID, salt;
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
        return new Promise((resolve, reject)=>{ 
            var key;
            salt = Math.round((new Date().valueOf()*Math.random()))+"";
            hashUID = crypto.pbkdf2(user_data.userid, salt, config.hash_count, 64, 'sha512', (err, key) => {
                if(err) 
                    reject(res_msg[1500]);
                else{
                    //key = key;
                        
                    hashUID = key.toString('hex');
                    var newUser = new database.userModel({
                        type: user_data.type,
                        userid: user_data.userid,
                        salt: salt,
                        uid: hashUID,
                        nickname: user_data.nickname, 
                        lat: user_data.lat, 
                        lng: user_data.lng,
                        region: user_data.region
                    });
                    console.log("hello");
                    newUser.save(function(err){
                        if(err){
                            reject(res_msg[1500]);
                        }else{
                            resolve(newUser);
                        }  
                    });
                }
            });
        })
    })
}
            
    

exports.login_user = (db,user_data)=>{    
    console.log("새로운 인스턴스 객체 "); 
    var database = db;
    return new Promise((resolve, reject)=>{
        var salt, hashUID;

        database.userModel.findOne({"userid" :user_data.userid, "type": user_data.type}, function(err, result){
            if(err){
                reject(res_msg[1500]);
            }else{
                if(result == null){
                    reject(res_msg[1300]);
                }else{
                    salt = result.salt;
                    crypto.pbkdf2(user_data.userid, salt, config.hash_count, 64, 'sha512', (err, key) => {
                        if(err) reject(res_msg[1500]);
                        else{
                            hashUID = key.toString('hex');
                            database.userModel.findOne({"uid" :hashUID,"type": user_data.type}, function(err, result){
                                if(err) reject(res_msg[1500]);
                                else if(result == null){
                                    reject(res_msg[1300]);
                                }else{
                                    resolve(result);
                                }
                            });
                        }
                    });
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
        database.userModel.findOne({"uid" :user_data.uid, "type": user_data.type}, function(err, result){
            if(err){
                reject(res_msg[1500]);
            }
            else if(result == null){
                reject(res_msg[1300]);
            }else{
                resolve(result);
            }
        })
    }).then((user)=>{
            return new Promise((resolve, reject)=>{
                database.userModel.find({"nickname": user_data.newName}, function(err, result){
                    if(err){
                        reject(res_msg[1500]);
                    }else{
                        if(result.length>0){
                            reject(res_msg[1301]);
                        }else{
                            resolve(user);
                        }
                    }
                });
            }).then((user)=>{
                return new Promise((resolve, reject)=>{
                    try{
                        database.userModel.update({$set:{'nickname': user_data.newName}}).exec();
                        user = database.userModel.findOne({"uid": user.uid}, function(err, result){
                            if(err){
                                reject(res_msg[1500]);
                            }
                        });
                    }
                    catch(error){
                        reject(res_msg[1500]);
                    }
                    resolve(user);
                });
        });
    });
};

exports.edit_location = (db,user_data)=>{ 
    var database = db;
    //var user;
    return new Promise((resolve, reject)=>{
        database.userModel.findOne({"uid" :user_data.uid, "type": user_data.type}, function(err, result){
            if(err){
                reject(res_msg[1500]);
            }
            else if(result == null){
                reject(res_msg[1300]);
            }
            else{
                resolve(result);
            }
        })
    }).then((user)=>{
        return new Promise((resolve, reject)=>{
            try{
                database.userModel.updateOne({'uid': user.uid},{$set:{'lat': user_data.lat, 'lng': user_data.lng, 'region':user_data.region}}).exec();
            }
            catch(error){
                reject(res_msg[1500]);
            }
            resolve(user);
        }); 
    }).then((res)=>{
        return new Promise((resolve, reject)=>{
            var user = database.userModel.findOne({"uid": res.uid}, function(err, result){
                if(err){
                    reject(res_msg[1500]);
                }else{
                    if(result == null) reject(res_msg[1300]);
                    else
                        resolve(user);
                }
            });
        });
    });
};

