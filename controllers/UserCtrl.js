const userModel = require('../models/UserModel');
const res_msg = require('../error.json');
var region=null;

var register_user = async(req, res, next)=> {
    let result = '';
    try{
        const user_data = {
            type: req.body.type,
            nickname: req.body.nickname,
            userid: req.body.userid,
            lat: req.body.lat,
            lng: req.body.lng,
        }
        region = await userModel.getLocationInfo(user_data);
        user_data.region=region;
        var db = req.app.get('database');
        result = await userModel.register_user(db,user_data);
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
    return res.status(200).json(result);
};

var login_user = async(req, res, next)=> {
    let result ='';
    try{
        const user_data = {
            type: req.body.type,
            userid: req.body.userid,
        }
        var db = req.app.get('database');
        result = await userModel.login_user(db,user_data);
    }catch(error){
        return res.status(500).json(error);
    }
    return res.status(200).json(result);
};

var check_nickname = async (req, res, next)=>{
    let result = '';
    try{
        const user_data = {
            nickname: req.query.nickname
        }
        var db = req.app.get('database');
        result = await userModel.check_nickname(db, user_data);
    }catch(error){
        return res.status(500).json(error);
    }
    return res.status(200).json(res_msg[1200]);
}

var show_user = async(req, res, next)=>{
    let result = '';
    try{
        const user_data={
            type: req.params.type || req.query.type,
            uid: req.params.uid || req.query.uid,
        }
        var db = req.app.get('database');
        result = await userModel.show_user(db,user_data);
    }catch(error){   
        return res.status(500).json(error);
    }
    return res.status(200).json(result);

};


var edit_nickname = async(req, res, next)=>{
    let result = '';
    try{
        const user_data={
            type: req.body.type,
            uid: req.body.uid,
            newName: req.body.newName
        }
        var db = req.app.get('database');
        result = await userModel.edit_nickname(db,user_data);
    }catch(error){   
        return res.status(500).json(error);
    }
    return res.status(200).json(result);
};

var edit_location = async(req, res, next)=>{
    let result = '';
    try{
        const user_data={
            type: req.body.type,
            uid: req.body.uid,
            lat: req.body.lat,
            lng: req.body.lng,
        }
        region = await userModel.getLocationInfo(user_data);
        user_data.region=region;
        //console.log(region);
        var db = req.app.get('database');
        result = await userModel.edit_location(db,user_data);
    }catch(error){     
        return res.status(500).json(error);
    }
    return res.status(200).json(result);
};

var get_region_code=async(req, res,next)=>{
    try{
        const user_data = {
            type: req.body.type,
            uid: req.body.uid,
            lat: req.body.lat,
            lng: req.body.lng,
        }
        result = await userModel.getLocationInfo(user_data);
        region = result;
        //console.log(region);
        next();
    }catch(error){
        //console.log(error);
        return res.status(500).json(error);
    }  
    return res.status(200).json(res_msg[1200]); 
};

var get_address=async(req, res,next)=>{
    let result ='';
    try{
        const user_data = {
            keyword: req.query.keyword
        }
        result = await userModel.getStringAddress(user_data);
    }catch(error){
        //console.log(error);
        return res.status(500).json(error);
    }  
    return res.status(200).json(result); 
};

module.exports.check_nickname = check_nickname;
module.exports.get_region_code = get_region_code;
module.exports.get_address = get_address;
module.exports.login_user = login_user;
module.exports.register_user = register_user;
module.exports.show_user = show_user;
module.exports.edit_nickname = edit_nickname;
module.exports.edit_location = edit_location;
