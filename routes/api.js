'use strict';
const userCtrl = require('../controllers/UserCtrl');
const boardCtrl = require('../controllers/BoardCtrl');
const alarmCtrl = require('../controllers/AlarmCtrl');
const weatherCtrl = require('../controllers/WeatherDataCtrl')

module.exports=(router)=>{
    /*
    router.route('/').get(function(req, res,next){
        res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
        res.write('<h2>사용자 리스트 조회 중 오류발생</h2>');
        res.write('<p>'+err.stack+'</p>');
        res.end();
    });
    */
   

    router.route('/main').post(userCtrl.register_nickname);
/*
    router.route('/setting/nickname')
    .get(userCtrl.show_nickname());
    
    //main
    router.route('/main/realtime')
    .get(userCtrl.show_curInfo());
    router.route('/main/thisweek')
    .get(userCtrl.show_weekInfo());
    router.route('/main/location')
    .put(userGtrl.edit_locInfo());


    //board
    router.route('/board/list')
    .get(boardCtrl.show_board_all());
    router.route('/board/like')
    .put(boardCtrl.like());
    router.route('/board/dislike')
    .put(boardCtrl.dislike());

    //setting
    router.route('/setting/notification')
    .get(alarmCtrl.show_notification())
    .put(alarmCtrl.edit_alarm());
    router.route('/setting/nickname')
    .get(alarmCtrl.show_nickname())
    .put(salarmCtrl.edit_nickname());
*/
    return router;
}