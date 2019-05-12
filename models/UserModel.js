'use strict';
const res_msg = require('../error.json');
/* model definition */

exports.register_user = (db,user_data)=>{ 
   
    console.log("새로운 인스턴스 객체 "); 
    var database = db;
    return new Promise((resolve, reject)=>{
        database.userModel.find({"nickname": user_data.nickname}, function(err, result){
            if(err){
                console.log('hello');
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
                lng: user_data.lng});
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
        database.userModel.findOne({"uid" :user_data.uid, "type": user_data.type}, function(err, result){
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
                database.userModel.update({$set:{'lat': user_data.lat, 'lng': user_data.lng}}).exec();
                resolve(null);
            }
        })
    });
};
