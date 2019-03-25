'use strict';
const userCtrl = require('../controllers/UserCtrl');
const boardCtrl = require('../controllers/BoardCtrl');
const alarmCtrl = require('../controllers/AlarmCtrl');
const weatherCtrl = require('../controllers/WeatherCtrl');
const weatherApi = require('./weatherApi');
module.exports=(router)=>{
    
    router.route('/currentDustInfo')
    .get(weatherApi.getRealTimeFineDust);
    router.route('/weekDustInfo')
    .get(weatherApi.getWeekFineDust);
    router.route('/main')
    .post(userCtrl.register_nickname);
    router.route('/setting/nickname/:nickname')
    .get(userCtrl.show_nickname);
    router.route('/setting/nickname/:prevName/:newName')
    .put(userCtrl.edit_nickname);

    //board
    router.route('/board/list')
    .get(boardCtrl.show_board_all);
    router.route('/board/:nickname')
    .post(boardCtrl.write_board);
    router.route('/board/:id')
    .delete(boardCtrl.remove_board);
    router.route('/board/like/:id')
    .put(boardCtrl.like_board);
    router.route('/board/dislike/id')
    .put(boardCtrl.dislike_board);
/*    
    //main
    router.route('/main/realtime')
    .get(userCtrl.show_curInfo());
    router.route('/main/thisweek')
    .get(userCtrl.show_weekInfo());
    router.route('/main/location')
    .put(userGtrl.edit_locInfo());


    //setting
    router.route('/setting/notification')
    .get(alarmCtrl.show_notification())
    .put(alarmCtrl.edit_alarm());
    router.route('/setting/nickname')
    .get(alarmCtrl.show_nickname())
    
*/
    
    return router;
}