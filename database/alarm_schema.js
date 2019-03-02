var Schema = { };

Schema.createSchema = function(mongoose){
    var AlarmSchema = mongoose.Schema({
        time: Date,
        option: Number,
        isOn: Boolean
    })
    return AlarmSchema;
}


//module.exports에 UserSchema 객체 직접 할당. 
module.exports = Schema;