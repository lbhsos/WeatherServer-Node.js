const weatherAPI = require('../models/WeatherModel');
const boardModel = require('../models/BoardModel');
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

var getRealTimeFineDust = async(req, res, next)=>{
    try{
        const weather_data={
            cityName: req.params.cityName || req.query.cityName,
            lat: req.params.lat || req.query.lat,
            lng: req.params.lng || req.query.lng,
            dayAfterTomorrow: dayAfterTomorrow,
            areaNo: req.params.areaNo || req.query.areaNo,
            today: today,
            tomorrow: tomorrow,
            yesterday: yesterday,
            curTime: curTime,  
        }
        //var db = req.app.get('database');
        //console.log(weather_data.cityName);
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
        const weather_data={
            cityName: req.params.cityName || req.query.cityName,
            lat: req.params.lat || req.query.lat,
            lng: req.params.lng || req.query.lng,
            dayAfterTomorrow: dayAfterTomorrow,
            areaNo: req.params.areaNo || req.query.areaNo,
            today: today,
            tomorrow: tomorrow,
            yesterday: yesterday,
            curTime: curTime,  
        }
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
        const weather_data={
            cityName: req.params.cityName || req.query.cityName,
            lat: req.params.lat || req.query.lat,
            lng: req.params.lng || req.query.lng,
            dayAfterTomorrow: dayAfterTomorrow,
            areaNo: req.params.areaNo || req.query.areaNo,
            today: today,
            tomorrow: tomorrow,
            yesterday: yesterday,
            curTime: curTime,  
        }
        //var db = req.app.get('database');
        todayJSON = await weatherAPI.getTodayWeather(weather_data,0);
        //console.log(todayJSON);
    }catch(error){
        return res.status(500).json({error: 'today api error'});
    }
   return next();
};

var getTomorrowWeather = async(req, res, next)=>{
    try{
        const weather_data={
            cityName: req.params.cityName || req.query.cityName,
            lat: req.params.lat || req.query.lat,
            lng: req.params.lng || req.query.lng,
            dayAfterTomorrow: dayAfterTomorrow,
            areaNo: req.params.areaNo || req.query.areaNo,
            today: today,
            tomorrow: tomorrow,
            yesterday: yesterday,
            curTime: curTime,  
        }
        //console,log(weather_data);
        tomorrowJSON = await weatherAPI.getTodayWeather(weather_data,1);
   
    }catch(error){
        return res.status(500).json({error: 'tomorrow api error'});
    }
   return next();
};

var getHeatLife = async(req, res, next)=>{
    try{
        //var today_str = today + "06";
        const weather_data={
            cityName: req.params.cityName || req.query.cityName,
            lat: req.params.lat || req.query.lat,
            lng: req.params.lng || req.query.lng,
            dayAfterTomorrow: dayAfterTomorrow,
            areaNo: req.params.areaNo || req.query.areaNo,
            today: today,
            tomorrow: tomorrow,
            yesterday: yesterday,
            curTime: curTime,  
            
        }
        //console.log(weather_data);
        heatJSON = await weatherAPI.getHeatLife(weather_data);
   
    }catch(error){
        return res.status(500).json({error: 'heat api error'});
    }
   return next();
};

var getUltraVLife = async(req, res, next)=>{
    try{
       // var today_str = today + "06";
        const weather_data={
            cityName: req.params.cityName || req.query.cityName,
            lat: req.params.lat || req.query.lat,
            lng: req.params.lng || req.query.lng,
            dayAfterTomorrow: dayAfterTomorrow,
            areaNo: req.params.areaNo || req.query.areaNo,
            today: today,
            tomorrow: tomorrow,
            yesterday: yesterday,
            curTime: curTime,  
            
        }
        console.log('hello2');
        ultravJSON = await weatherAPI.getUltraVLife(weather_data);
        console.log('hello');
    }catch(error){
        return res.status(500).json({error: 'ultrav api error'});
    }
   return next();
};

var getMiddleLandWeather = async(req, res, next)=>{
    try{
        // var today_str = today + "06";
        const weather_data={
            cityName: req.params.cityName || req.query.cityName,
            lat: req.params.lat || req.query.lat,
            lng: req.params.lng || req.query.lng,
            dayAfterTomorrow: dayAfterTomorrow,
            areaNo: req.params.areaNo || req.query.areaNo,
            today: today,
            tomorrow: tomorrow,
            yesterday: yesterday,
            curTime: curTime    
        }
        //console.log('hello');

        middleLandJSON = await weatherAPI.getMiddleLandWeather(weather_data);
    
     }catch(error){
         return res.status(500).json({error: 'middle land api error'});
     }
    return next();    
}
var getMiddleTemperature = async(req, res, next)=>{
    try{
        // var today_str = today + "06";
        const weather_data={
            cityName: req.params.cityName || req.query.cityName,
            lat: req.params.lat || req.query.lat,
            lng: req.params.lng || req.query.lng,
            dayAfterTomorrow: dayAfterTomorrow,
            areaNo: req.params.areaNo || req.query.areaNo,
            today: today,
            tomorrow: tomorrow,
            yesterday: yesterday,
            curTime: curTime    
        }
        console.log('hello');

        middleTempJSON = await weatherAPI.getMiddleTemperature(weather_data);
    
     }catch(error){
         return res.status(500).json({error: 'middle land api error'});
     }
    return next();    
}

var show_best_board= async(req, res, next)=>{
    try{
        var db = req.app.get('database');
        bestJSON= await weatherAPI.show_best_board(db);
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