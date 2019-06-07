'use strict';
var moment = require('moment');
const res_msg = require('../error.json');
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
        database.userModel.findOne({"uid":board_data.uid,"type":board_data.type}, function(err, result){
          if(err){
              reject(res_msg[1500]);
          }else{
              if(result==null){
                  reject(res_msg[1300]);
              }else{
                  resolve(result);
              }
          }
        });
    }).then((result)=>{
        return new Promise((resolve, reject)=>{
            //var newDate = new Date();
            var newDate = getCurrentDate();
            var expireDate = getExpireDate();
            var newBoard = new database.boardModel({
                content: board_data.content, 
                timestamp: newDate, 
                like: 0, 
                dislike: 0, 
                accusation:0,
                expireAt: expireDate, 
                pos: result.region.pos,
                uid: board_data.uid,
                type: board_data.type,
                nickname:board_data.nickname,
                comment: "",
                
            });
            newBoard.save(function(err){
                if(err){
                    reject(res_msg[1500]);
                }else{
                    resolve(newBoard);
                }
            });
        });
    })
}

exports.write_comment = (db, board_data)=>{
    var database = db; 
        return new Promise((resolve, reject)=>{
        database.boardModel.findOne({$and:[{_id:board_data.id}, {uid: board_data.uid} ,{type: board_data.type}]}, function(err, result){
            if(err){
                reject(res_msg[1500]);
            }else{
                //console.log(result);
                if(result==null){
                    reject(res_msg[1300]);
                }else{
                    database.boardModel.update({"_id" : board_data.id},{$set: {"comment": board_data.comment}}).exec();
                    resolve(null); 
                }
            }
        });
    });
};

exports.show_board_all = (db,board_data)=>{  
    //24시간 기준 정보 가져오기.
    var database = db;
    return new Promise((resolve, reject)=>{
        database.userModel.findOne({"uid":board_data.uid,"type":board_data.type}, function(err, result){
          if(err){
		console.log(err);
              reject(res_msg[1500]);
          }else{
              if(result==null){
		console.log(result+"not find uid & type");
		console.log(board_data.uid+""+board_data.type);
                  reject(res_msg[1300]);
              }else{
                  resolve(result);
              }
          }
        });
    }).then((result)=>{
        return new Promise((resolve, reject)=>{
            var curDate = getCurrentDate();
            database.boardModel.find({"expireAt":{"$gte": curDate}, "pos": result.region.pos}, function(err, result){
                if(err){
                    reject(res_msg[1500]);
                }else{
                    if(result == null){
			console.log("not find pos & expireAt");
				console.log(board_data.uid+" &&  "+board_data.type);
                            resolve(null);
                    }else{
                        resolve(result);
                    }
                }
            }).sort({timestamp:-1});
        })
    });
}

exports.like_board = (db, board_data)=>{
    var database = db;
    return new Promise((resolve, reject)=>{
        database.boardModel.findOne({"_id":board_data.id}, function(err, result){
            if(err){
		console.log(err);
                reject(res_msg[1500]);
            }else{
                if(result == null){
			console.log(board_data.id);
                    reject(res_msg[1300]);
                }else{
                    var count = result._doc.like;
                    database.boardModel.update({"_id":board_data.id}, {$set: {'like': count+1}}).exec();
                    resolve(null);
                }
            }
        });
    });
}

exports.like_board_cancel = (db, board_data)=>{
    var database = db;
    return new Promise((resolve, reject)=>{
        database.boardModel.findOne({"_id":board_data.id}, function(err, result){
            if(err){
                reject(res_msg[1500]);
            }else{
                if(result == null){
                    reject(res_msg[1300]);
                }else{
                    var count = result._doc.like;
                    if(count==0) resolve(null);
                    else{
                        database.boardModel.update({"_id":board_data.id}, {$set: {'like': (count-1)}}).exec();
                        resolve(null);
                    }
                }
            }
        });
    });
}

exports.dislike_board = (db, board_data)=>{
    var database = db;
    return new Promise((resolve, reject)=>{

        database.boardModel.findOne({"_id":board_data.id}, function(err, result){
            if(err){
                reject(res_msg[1500]);
            }else{
                if(result==null){
                        reject(res_msg[1300]);
                }else{
                    //console.log(result);
                    var count = result._doc.dislike;
                    database.boardModel.update({"_id":board_data.id}, {$set: {'dislike': count+1}}).exec();
                    resolve(null);
                }
            }
        });
    });
}

exports.dislike_board_cancel = (db, board_data)=>{
    var database = db;
    return new Promise((resolve, reject)=>{
        database.boardModel.findOne({"_id":board_data.id}, function(err, result){
            if(err){
                reject(res_msg[1500]);
            }else{
                if(result==null){
                        reject(res_msg[1300]);
                }else{
                    var count = result._doc.dislike;
                    if(count==0) resolve(null);
                    else{
                        database.boardModel.update({"_id":board_data.id}, {$set: {'dislike': (count-1)}}).exec();
                        resolve(null);
                    }
                }
            }
        });
    });
}

exports.remove_board = (db,board_data)=>{
    var database = db;
    return new Promise((resolve, reject)=>{

        database.boardModel.findOne({"_id":board_data.id, "uid": board_data.uid, "type": board_data.type}, function(err, result){
            if(err){
                reject(res_msg[1500]);
            }else{
                if(result==null){
                        reject(res_msg[1300]);
                }else{
                  database.boardModel.remove({"_id":board_data.id}).exec();
                  resolve(null);
                }
            }
        });
    });
}

exports.accuse_board = (db, board_data)=>{
    var database = db;
    
    return new Promise((resolve, reject)=>{

        database.boardModel.findOne({"_id":board_data.id}, function(err, result){
            if(err){
                reject(res_msg[1500]);
            }else{
                if(result==null){
                        reject(res_msg[1300]);
                }else{
                    var count = result._doc.accusation;
                    if(count==9){
                        database.boardModel.remove({"_id":board_data.id}, function(err, res){
                            if(err) reject(res_msg[1300]);
                            else resolve(null);
                        });
                    }else if(count == 0){
                        var newAccuse = new database.accuseModel({
                            _id: result._id,
                            content: result.content, 
                            timestamp: result.timestamp, 
                            like: result.like, 
                            dislike: result.dislike, 
                            accusation: 1,
                            accuse_type: board_data.index,
                            expireAt: result.expireAt, 
                            pos: result.pos,
                            uid: result.uid,
                            type: result.type,
                            nickname: result.nickname,
                            comment: result.comment,
                        });
                        database.boardModel.update({"_id":board_data.id}, {$set: {'accusation': count+1}}).exec();
 
                        newAccuse.accuse_type = board_data.index;
                        newAccuse.save(function(err){
                            if(err){
                                reject(res_msg[1500]);
                            }else{
                                resolve(newAccuse);
                            }  
                        });
                    }
                    else{
                        //console.log(count);
                        database.boardModel.update({"_id":board_data.id}, {$set: {'accusation': count+1}}).exec();
                        database.accuseModel.update({"_id":board_data.id}, {$set: {'accusation': count+1}}).exec();
                        resolve(null);
                    }
                }
            }
        });
    });
}
