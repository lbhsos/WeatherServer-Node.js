var Schema = { };

Schema.createSchema = function(mongoose){
    var UserSchema = mongoose.Schema({
        type: String,
        userid: String,
        salt: String,
        uid: String,
        nickname: String,
        lat:String,
        lng: String,
        region: {
            cityName: String,
            sidoName: String,
            townName: String,
            pos: String,
        },
        
        //published_date: { type: Date, default: Date.now}
    });
    console.log("userSchema 정의함");
    return UserSchema;
}


//module.exports에 UserSchema 객체 직접 할당. 
module.exports = Schema;