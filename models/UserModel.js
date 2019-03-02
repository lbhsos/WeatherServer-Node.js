'use strict';

/* model definition */


exports.register_nickname = (db,user_data)=>{ 
    var error_message = require('../error.json');    
    console.log("새로운 인스턴스 객체 "); 
    var database = db;
    return new Promise((resolve, reject)=>{
        database.userModel.find({"nickname" :user_data.nickname}, function(err, result){
            if(err){
                reject(err);
            }else{
                if(result.length>0){
                    reject({error: 'server error'});
                }else{
                    resolve(null);

                }
            }
        });
    }).then(()=>{
        //추가 
        return new Promise((resolve, reject)=>{
            var newUser = new database.userModel({nickname: user_data.nickname});
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


exports.show_nickname = (db,user_data)=>{   
    var database = db;
    return new Promise((resolve, reject)=>{
        database.userModel.find({"nickname" :user_data.nickname}, function(err, result){
            if(err){
                reject(err);
            }else{
                if(result.length<=0){
                    reject({error: 'server error'});
                }else{
                    resolve(result[0]._doc.nickname);
                }
            }
        });
    });
};

exports.edit_nickname = (db,user_data)=>{ 
    var database = db;
    return new Promise((resolve, reject)=>{
        database.userModel.findOne({"nickname": user_data.prevName}, function(err, result){
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
