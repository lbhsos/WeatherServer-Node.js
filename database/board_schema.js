var Schema = { };

Schema.createSchema = function(mongoose){
    var BoardSchema = mongoose.Schema({
        id: Number,
        nickname: String,
        content: String,
        timestamp:  { type: Date},
        like: Number,
        dislike: Number,
        expireAt: {type: Date}
       // user_emo: String
    })

    return BoardSchema;    
}


//module.exports에 UserSchema 객체 직접 할당. 
module.exports = Schema;