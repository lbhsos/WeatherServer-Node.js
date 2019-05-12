'use strict';

/* model definition */

exports.register_user = (db,user_data)=>{ 
    var error_message = require('../error.json');    
    console.log("새로운 인스턴스 객체 "); 
    var database = db;
    return new Promise((resolve, reject)=>{
        database.userModel.find({"nickname": user_data.nickname}, function(err, result){
            if(err){
                reject(err);
            }else{
                if(result.length>0){
                    reject({error: 'alreay exist nickname'});
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
                    reject(err);
                }else{
                    resolve(newUser.nickname);
                }
            });
        });
    });
};

exports.login_user = (db,user_data)=>{ 
    var error_message = require('../error.json');    
    console.log("새로운 인스턴스 객체 "); 
    var database = db;
    return new Promise((resolve, reject)=>{
        database.userModel.find({"uid" :user_data.uid, "type": user_data.type}, function(err, result){
            if(err){
                reject(err);
            }else{
                if(result.length<0){
                    reject({error: 'no user data, please register'});
                }else{
                    resolve(result[0]._doc);
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
                reject(err);
            }else{
                if(result.length<=0){
                    reject({error: 'server error'});
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
                reject({error: 'we couldn\'t find the document'});
            }
            else{
                database.userModel.update({'nickname': user_data.prevName}, {$set:{'nickname': user_data.newName}}).exec();
                resolve(null);
            }
        })
    });
};

exports.edit_ = (db,user_data)=>{ 
    var database = db;
    return new Promise((resolve, reject)=>{
        database.userModel.findOne({"uid" :user_data.uid, "type": user_data.type}, function(err, result){
            if(!result){
                reject({error: 'we couldn\'t find the document'});
            }
            else{
                database.userModel.update({$set:{'lat': user_data.lat, 'lng': user_data.lng}}).exec();
                resolve(null);
            }
        })
    });
};
