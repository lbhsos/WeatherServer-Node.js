const boardModel = require('../models/BoardModel');
const res_msg = require('../error.json');

var write_board = async(req, res, next)=>{
    let result = '';
    try{
        const board_data = {
            uid: req.body.uid,
            type:req.body.type,
            nickname: req.body.nickname,
            content : req.body.content,
        }
        var db = req.app.get('database');
        result = await boardModel.write_board(db, board_data);
    }catch(error){
        //console.log(error);
        res.status(500).json(error);
    }
    return res.status(200).json(result);
}

var write_comment = async(req, res, next)=>{
    try{
        const board_data = {
            id: req.body.id,
            uid: req.body.uid,
            type: req.body.type,
            comment : req.body.comment,
        }
        var db = req.app.get('database');
        result = await boardModel.write_board(db, board_data);
    }catch(error){
        //console.log(error);
        res.status(500).json(error);
    }
    return res.status(200).json(res_msg[1200]);
}

var show_board_all = async(req, res, next)=>{
    let result = '';
    try{
        const board_data = {
            uid: req.query.uid,
            type:req.query.type,
            nickname: req.query.nickname
        }
        var db = req.app.get('database');
        result = await boardModel.show_board_all(db,board_data);
    }catch(error){
        //console.log(error);
        res.status(500).json(error);
    }
    return res.status(200).json(result);
}

var like_board = async(req, res, next)=>{
    let result = '';
    try{
        var db = req.app.get('database');
        const board_data={
            id: req.params.id || req.query.id
        }
        result = await boardModel.like_board(db,board_data);
    }catch(error){
        //console.log(error);
        res.status(500).json(error);
    }
    return res.status(200).json(res_msg[1200]);
}

var like_board_cancel = async(req, res, next)=>{
    let result = '';
    try{
        var db = req.app.get('database');
        const board_data={
            id: req.params.id || req.query.id
        }
        result = await boardModel.like_board_cancel(db,board_data);
    }catch(error){
        //console.log(error);
        res.status(500).json(error);
    }
    return res.status(200).json(res_msg[1200]);
}

var dislike_board = async(req, res, next)=>{
    let result = '';
    try{
        var db = req.app.get('database');
        const board_data={
            id: req.params.id || req.query.id
        }
        result = await boardModel.dislike_board(db,board_data);
    }catch(error){
        res.status(500).json(error);
    }
    return res.status(200).json(res_msg[1200]);
}

var dislike_board_cancel = async(req, res, next)=>{
    let result = '';
    try{
        var db = req.app.get('database');
        const board_data={
            id: req.params.id || req.query.id
        }
        result = await boardModel.dislike_board_cancel(db,board_data);
    }catch(error){
        res.status(500).json(error);
    }
    return res.status(200).json(res_msg[1200]);
}

var accuse_board = async(req, res, next)=>{
    try{
        var db = req.app.get('database');
        const board_data={
            id: req.params.id || req.query.id,
            index: req.params.index || req.query.index
        }
        result = await boardModel.accuse_board(db,board_data);
    }catch(error){
        res.status(500).json(error);
    }
    return res.status(200).json(res_msg[1200]);
}

var remove_board = async(req, res, next)=>{
    let result ='';
    try{
        var db = req.app.get('database');
        const board_data={
            id: req.query.id,
            uid: req.query.uid,
            type: req.query.type,
            
        }
        result = await boardModel.remove_board(db, board_data);
    }catch(error){
        //console.log(error);
        res.status(500).json(error);
    }
    return res.status(200).json(res_msg[1200]);
}

module.exports.write_board = write_board;
module.exports.write_comment = write_comment;
module.exports.show_board_all = show_board_all;
module.exports.like_board = like_board;
module.exports.like_board_cancel = like_board_cancel;
module.exports.dislike_board = dislike_board;
module.exports.dislike_board_cancel = dislike_board_cancel;
module.exports.remove_board = remove_board;
module.exports.accuse_board = accuse_board;
