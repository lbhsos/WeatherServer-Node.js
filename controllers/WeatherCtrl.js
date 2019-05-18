const weatherAPI = require('../models/WeatherModel');
const boardModel = require('../models/BoardModel');
const userModel = require('../models/UserModel');
var moment = require('moment');
var bestJSON, fineDustJSON, todayJSON, currentJSON, tomorrowJSON, heatJSON, ultravJSON, middleLandJSON, middleTempJSON;
var dayAfterTomorrow;
var today;
var tomorrow;
var curTime;

var getDate=async(req, res, next)=>{
    try{
        //var object = moment();
        var after_moment = moment().add(+2, 'days').format('YYYYMMDD');
        var today_moment = moment().format('YYYYMMDD');
        var tom_moment = moment().add(+1,'days').format('YYYYMMDD');
        var yes_moment = moment().add(-1,'days').format('YYYYMMDD');
        dayAfterTomorrow = after_moment;
        today = today_moment;
        tomorrow = tom_moment;
        yesterday = yes_moment;

        curTime = moment().format('HHmm');
        //console.log(curTime);
    }catch(error){
        return res.status(500).json({error: 'getDate error'});
    }
    return next();
};

var create_data = async(req) => {
    const weather_data={
        lat: req.params.lat || req.query.lat,
        lng: req.params.lng || req.query.lng,
        dayAfterTomorrow: dayAfterTomorrow,
        today: today,
        tomorrow: tomorrow,
        yesterday: yesterday,
        curTime: curTime,  
    }
    var user_data = {
        lat:weather_data.lat,
        lng:weather_data.lng
    }

    var region = await userModel.getLocationInfo(user_data);
    weather_data.cityName = region.cityName;
    weather_data.sidoName = region.sidoName;
    weather_data.x = region.x;
    weather_data.y = region.y;
    weather_data.areaNo = region.areaNo;
    weather_data.tmFc = region.tmcode;
    weather_data.pos = region.pos;
    return weather_data;
};

var getRealTimeFineDust = async(req, res, next)=>{
    try{
        weather_data = await create_data(req);
        fineDustJSON = await weatherAPI.getRealTimeFineDust(weather_data);
        //console.log(fineDustJSON);
    }catch(error){
        console.log(error);
        return res.status(500).json({error: 'realtime api error'});
    }
    return next();
};

var getCurrentData= async(req, res, next)=>{
    //let result = '';
    try{
        weather_data = await create_data(req);
        currentJSON = await weatherAPI.getCurrentData(weather_data);
        //console.log(currentJSON);
    }catch(error){
        //console.log(error);
        return res.status(500).json({error: 'current api error'});
    }
    return next();
};

var getTodayWeather = async(req, res, next)=>{
    let result = '';
    try{
        weather_data = await create_data(req);
        todayJSON = await weatherAPI.getTodayWeather(weather_data,0);
        //console.log(todayJSON);
    }catch(error){
        return res.status(500).json({error: 'today api error'});
    }
   return next();
};

var getTomorrowWeather = async(req, res, next)=>{
    try{
        weather_data = await create_data(req);
        tomorrowJSON = await weatherAPI.getTodayWeather(weather_data,1);
   
    }catch(error){
        return res.status(500).json({error: 'tomorrow api error'});
    }
   return next();
};

var getHeatLife = async(req, res, next)=>{
    try{
        weather_data = await create_data(req);
        heatJSON = await weatherAPI.getHeatLife(weather_data);
   
    }catch(error){
        return res.status(500).json({error: 'heat api error'});
    }
   return next();
};

var getUltraVLife = async(req, res, next)=>{
    try{
        weather_data = await create_data(req);
        ultravJSON = await weatherAPI.getUltraVLife(weather_data);
        
    }catch(error){
        return res.status(500).json({error: 'ultrav api error'});
    }
   return next();
};

var getMiddleLandWeather = async(req, res, next)=>{
    try{
        weather_data = await create_data(req);
        middleLandJSON = await weatherAPI.getMiddleLandWeather(weather_data);
    
     }catch(error){
         return res.status(500).json({error: 'middle land api error'});
     }
    return next();    
}
var getMiddleTemperature = async(req, res, next)=>{
    try{
        weather_data = await create_data(req);
        middleTempJSON = await weatherAPI.getMiddleTemperature(weather_data);
    
     }catch(error){
         return res.status(500).json({error: 'middle land api error'});
     }
    return next();    
}

var show_best_board= async(req, res, next)=>{
    try{
        var db = req.app.get('database');
        weather_data = await create_data(req);
        bestJSON= await weatherAPI.show_best_board(db,weather_data.pos);
    }catch(error){
        console.log(error);
        res.status(500).json({error:'server error'});
    }
    return next();
}

var combineAllData = async(req, res, next)=>{
    //let weatherData = '';
    try{

       weatherData = {
            best_board: bestJSON,
            fineDust: fineDustJSON,
            today: todayJSON,
            tomorrow: tomorrowJSON,
            current: currentJSON,
            heat: heatJSON,
            ultrav: ultravJSON,
            weekSky : middleLandJSON,
            weekTemp: middleTempJSON,

        }
    }catch(error){
        res.status(500).json({error: 'server error'});
    }
    return res.status(200).json(weatherData);
}


module.exports.getDate = getDate;
module.exports.getHeatLife = getHeatLife;
module.exports.show_best_board = show_best_board;
module.exports.getUltraVLife = getUltraVLife;
module.exports.getCurrentData = getCurrentData;
module.exports.getRealTimeFineDust = getRealTimeFineDust;
module.exports.getTodayWeather = getTodayWeather;
module.exports.getTomorrowWeather = getTomorrowWeather;
module.exports.getMiddleLandWeather = getMiddleLandWeather;
module.exports.getMiddleTemperature = getMiddleTemperature;
module.exports.combineAllData = combineAllData;