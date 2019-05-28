var Schema = { };

Schema.createSchema = function(mongoose){
    var AccuseSchema = mongoose.Schema({
        id: Number,
        uid: String,
        type: String,
        nickname: String,
        content: String,
        comment: {type: String},
        like: {type: Number, minimum: 0},
        dislike: {type: Number, minimum: 0},
        accusation: Number,
        accuse_type: Number,
        pos: String,
        timestamp:  { type: Date},
        expireAt: {type: Date},
    })

    return AccuseSchema;    
}


//module.exports에 UserSchema 객체 직접 할당. 
module.exports = Schema;