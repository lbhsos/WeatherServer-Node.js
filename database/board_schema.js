var Schema = { };

Schema.createSchema = function(mongoose){
    var BoardSchema = mongoose.Schema({
        id: Number,
        uid: String,
        type: String,
        nickname: String,
        content: String,
        comment: String,
        like: {type: Number, minimum: 0},
        dislike: {type: Number, minimum: 0},
        accusation: Number,
        pos: String,
        timestamp:  { type: Date},
        expireAt: {type: Date},
        
        

       // user_emo: String
    })

    return BoardSchema;    
}


//module.exports에 UserSchema 객체 직접 할당. 
module.exports = Schema;