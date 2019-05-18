var Schema = { };

Schema.createSchema = function(mongoose){
    var UserSchema = mongoose.Schema({
        nickname: String,
        uid: String,
        type:String,
        lat:String,
        lng: String,
        region: {
            cityName: String,
            sidoName: String
        }
        //published_date: { type: Date, default: Date.now}
    });
    console.log("userSchema 정의함");
    return UserSchema;
}


//module.exports에 UserSchema 객체 직접 할당. 
module.exports = Schema;