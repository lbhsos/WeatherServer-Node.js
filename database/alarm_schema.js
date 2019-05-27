var Schema = { };

Schema.createSchema = function(mongoose){
    var AlarmSchema = mongoose.Schema({
        time: Date,
        option: Number,
        isOn: Boolean
    })
    
    return AlarmSchema;
}

module.exports = Schema;