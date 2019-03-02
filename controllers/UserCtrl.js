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

var show_nickname = async(req, res, next)=>{
    let result = '';
    try{
        const user_data={
            nickname: req.params.nickname || req.query.nickname
        }
        var db = req.app.get('database');
        result = await userModel.show_nickname(db,user_data);
    }catch(error){
        
        res.status(500).json({error: 'server error'});
    }
    return res.status(200).json(result);

};


var edit_nickname = async(req, res, next)=>{
    let result = '';

    try{
        var prevName = req.params.prevName;
        var newName = req.params.newName;
        //prevName 존재하는지 확인 

        //newName이 중복하지 않는지 확인 
        const user_data={
            prevName: prevName,
            newName: newName
        }
        var db = req.app.get('database');
        result = await userModel.edit_nickname(db,user_data);
    }catch(error){
           
        res.status(500).json({error: 'server error'});
    }
    //success
    return res.status(200).json(res_msg[1200]);
};

module.exports.register_nickname = register_nickname;
module.exports.show_nickname = show_nickname;
module.exports.edit_nickname = edit_nickname;
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


*/