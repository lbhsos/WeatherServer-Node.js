'use strict';
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
var date = moment().format('YYYY-MM-DD HH:mm:ss');

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
function getExpireDate(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var today = date.getDate();
    var hours = date.getHours()+24;
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var milliseconds = date.getMilliseconds();
    return new Date(Date.UTC(year, month, today, hours, minutes, seconds, milliseconds));
}

exports.write_board = (db, board_data)=>{
    var database = db;

    return new Promise((resolve, reject)=>{
        database.userModel.findOne({"nickname":board_data.nickname}, function(err, result){
          if(err){
              reject(err);
          }else{
              if(result.length<=0){
                  reject({error: 'cannot find nickname'});
              }else{
                  resolve();
              }
          }
        });
    }).then(()=>{
        return new Promise((resolve, reject)=>{
            //var newDate = new Date();
            console.log(date);
            var newDate = getCurrentDate();
            var expireDate = getExpireDate();
            var newBoard = new database.boardModel({nickname: board_data.nickname, content: board_data.content, timestamp: newDate, like: 0, dislike: 0, expireAt: expireDate});
            newBoard.save(function(err){
                if(err){
                    reject(err);
                }else{
                    resolve(newBoard);
                }
            });
        });
    })
}



exports.show_board_all = (db)=>{  
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
        }).sort({timestamp:-1});

    });
}

exports.like_board = (db, board_data)=>{
    var database = db;
    return new Promise((resolve, reject)=>{

        database.boardModel.find({"_id":board_data._id}, function(err, result){
            if(err){
                reject(err);
            }else{
                if(result<=0){
                    reject({message: "there is no data"});
                }else{
                    //console.log(result);
                    var count = result[0]._doc.like;
                    database.boardModel.update({"_id":board_data._id}, {$set: {'like': count+1}}).exec();
                    resolve(null);
                }
            }
        });
    });
}

exports.dislike_board = (db, board_data)=>{
    var database = db;
    return new Promise((resolve, reject)=>{

        database.boardModel.find({"_id":board_data._id}, function(err, result){
            if(err){
                reject(err);
            }else{
                if(result<=0){
                        reject({message: "there is no data"});
                }else{
                    //console.log(result);
                    var count = result[0]._doc.dislike;
                  database.boardModel.update({"_id":board_data._id}, {$set: {'dislike': count+1}}).exec();
                  resolve(null);
                }
            }
        });
    });
}

exports.remove_board = (db,board_data)=>{
    var database = db;
    return new Promise((resolve, reject)=>{

        database.boardModel.find({"_id":board_data._id}, function(err, result){
            if(err){
                reject(err);
            }else{
                if(result<=0){
                        reject({message: "there is no data"});
                }else{
                    //console.log(result);
                  database.boardModel.remove({"_id":board_data._id}).exec();
                  resolve(null);
                }
            }
        });
    });
}