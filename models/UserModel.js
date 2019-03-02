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
