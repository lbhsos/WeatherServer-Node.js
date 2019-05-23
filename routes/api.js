'use strict';
const userCtrl = require('../controllers/UserCtrl');
const boardCtrl = require('../controllers/BoardCtrl');
const alarmCtrl = require('../controllers/AlarmCtrl');
//const weatherCtrl = require('../controllers/WeatherCtrl');
const weatherCtrl = require('../controllers/WeatherCtrl');
var result;

module.exports=(router)=>{
    
    router.route('/main')
    .get(weatherCtrl.getDate,weatherCtrl.create_data,weatherCtrl.getRealTimeFineDust, weatherCtrl.getCurrentData, weatherCtrl.getTodayWeather, 
        weatherCtrl.getTomorrowWeather, weatherCtrl.getTodayWeather, weatherCtrl.getHeatLife,
        weatherCtrl.getUltraVLife,weatherCtrl.getMiddleLandWeather, 
        weatherCtrl.getMiddleTemperature, weatherCtrl.show_best_board, weatherCtrl.combineAllData);
    router.route('/main/register')
    .post(userCtrl.register_user);
    router.route('/main/login')
    .post(userCtrl.login_user);
    
    router.route('/setting/location')
    .get(userCtrl.get_address)
    .put(userCtrl.edit_location);
    router.route('/setting/user')
    .put(userCtrl.edit_nickname)
    .get(userCtrl.show_user);

    router.route('/board/list')
    .get(boardCtrl.show_board_all);
    router.route('/board/write')
    .post(boardCtrl.write_board);
    router.route('/main/comment')
    .put(boardCtrl.write_comment);
    router.route('/board/removal')
    .delete(boardCtrl.remove_board);
    router.route('/board/like/:id')
    .put(boardCtrl.like_board);
    router.route('/board/like/cancel/:id')
    .put(boardCtrl.like_board_cancel);
    router.route('/board/dislike/:id')
    .put(boardCtrl.dislike_board);
    router.route('/board/dislike/cancel/:id')
    .put(boardCtrl.dislike_board_cancel);
    router.route('/board/accusation/:id')
    .put(boardCtrl.accuse_board);
    
    return router;
}