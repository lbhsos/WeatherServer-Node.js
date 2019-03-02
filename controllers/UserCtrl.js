const userModel = require('../models/UserModel');
const res_msg = require('../error.json');

var register_nickname = async(req, res, next)=> {
    let result = '';
    console.log("2");
    try{
        //TODO location info NOT YET
        //userdata의 중복데이터 확인하기 
        console.log("1");
        const user_data = {
            nickname: req.body.nickname,
        }
        var db = req.app.get('database');
        result = await userModel.register_nickname(db,user_data);
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'server error'});
    }
    return res.status(200).json(res_msg[1200]);
};

module.exports.register_nickname = register_nickname;
/*
exports.edit_locInfo = async(req, res, next) => {
    let result = '';

    try{
        var lat = req.body.lat;
        var lng = req.body.lng;
        const user_data={
            location:{
                type: Point,
                coordinates:[lat,lng]
            }
        }
        result = await userModel.eidt_locInfo(user_data);
    }catch(error){
        if(isNaN(error)){
            return res.status(500).json(res_msg[1500]);
        }
        else{
            return res.status(400).json(res_msg[error]);
        }
    }

    //success
    return res.status(200).json(res_msg[1200]);
};


exports.edit_nickname = async(req, res, next)=>{
    let result = '';

    try{
        var prevName = req.query.prevName || req.body.prevName;
        var newName = req.query.newName || req.body.newName;
        //prevName 존재하는지 확인 

        //newName이 중복하지 않는지 확인 
        const user_data={
            nickname: newName
        }
        result = await userModel.edit_nickname(user_data);
    }catch(error){
        if(isNaN(error)){
            return res.status(500).json(res_msg[1500]);
        }
        else{
            return res.status(400).json(res_msg[error]);
        }
    }

    //success
    return res.status(200).json(res_msg[1200]);
}

exports.show_nickname = async(req, res, next)=>{
    let result = '';
    try{
        const user_data={
            nickname: req.body.nickname
        }
        result = await userModel.show_nickname(user_data);
    }catch(error){
        if(isNaN(error)){
            return res.status(500).json(res_msg[1500]);
        }else{
            return res.status(400).json(res_msg[error]);
        }
    }
    return res.status(200).json(res_msg[1200]);

}
*/