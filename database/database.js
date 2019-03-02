var mongoose = require('mongoose');

//database객체에 db, schema, model 모두 추가 
var database ={};

database.init = function(app, config){
    console.log('init CALL');
    connect(app, config);
}

//데이터 베이스 연결하고 응답 객체의 속성으로 db 객체 추가 
function connect(app, config){
    var databaseUrl = config.db_url;

    mongoose.Promise=global.Promise;
    mongoose.connect(databaseUrl);
    database = mongoose.connection;
    database.on('error', console.error.bind(console, 'mongoose connection error'));
    database.on('open', function(){
        createSchema(app, config);

    });
    database.on('disconnected', connect);
    console.log('connect() call');
}

//config에 정의한 스키마 및 모델 객체 생성  
function createSchema(app, config){
    var schemaLen = config.db_schemas.length;
    console.log('스키마 갯수 %d', schemaLen);
    for (var i=0; i< schemaLen; i++){
        var curItem = config.db_schemas[i];
        console.log(curItem.file);
        var curSchema = require(curItem.file).createSchema(mongoose);
        console.log('%s 모듈을 불러들인 후 스키마 정의함.', curItem.file);
        
        //모델 정의 
        // collectino 은 document 정보.
        // schema형식을 가지는 model을 만들고, 이 model은 해당 collection에 저장이될 것.
        var curModel = mongoose.model(curItem.collection, curSchema);
        console.log('%s 컬렉션을 위해 모델 정의함', curItem.collection);

        //database객체에 속성으로 추가 
        database[curItem.schemaName] = curSchema;
        database[curItem.modelName] = curModel;
        console.log('스키마 이름[%s], model name[%s]이 database 객체의 속성으로 추가됨.', curItem.schemaName, curItem.modelName);
        
    }
    app.set('database', database);
}

module.exports=database;