// 서버 정보 + 데이터 베이스 정보 
//데이터 베이스 정보: 데이터 베이스 연결에 필요한 URL이나 인증 정보 
//mongoose를 사용하는 데이터베이스는 스키마를 생성한 후에 데이터베이스에 접근하므로 스키마 생성 부분을 별도 파일로 분리해 
//두고 스키마 파일의 로딩 정보를 config.js파일에 넣어둔다.

module.exports = {
    server_port: 3000,
    db_url: 'mongodb://localhost:27017/local',
    db_schemas: [
        //file: 스키마 파일 지정, collection: db 컬렌션 이름 지정, schemaName:  반환된 객체 어떤 이름으로?
        //modelName: 모델 객체 만든 후 어떤 속성으로 이름을 한 것인지. 
        {file: './user_schema', collection: 'user', schemaName: 'userSchema', modelName: 'userModel'},
        {file: './board_schema', collection: 'board', schemaName: 'boardSchema', modelName: 'boardModel'},
        {file: './alarm_schema', collection: 'alarm', schemaName: 'alarmSchema', modelName: 'alarmModel'},
        {file: './weather_schema', collection: 'weather', schemaName: 'weatherSchema', modelName: 'weatherModel'}
    ],
    /*
    route_info:[
        {file: './controllers/UserCtrl', path: '/main', method: 'register_nickname', type:'post'},
        {file: './controllers/UserCtrl', path: '/setting/nickname', method: 'show_nickname', type:'get'},
        {file: './controllers/UserCtrl', path: '/'}
    ]*/
}