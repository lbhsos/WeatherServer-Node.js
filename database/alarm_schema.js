var Schema = { };

Schema.createSchema = function(mongoose){
    var AlarmSchema = mongoose.Schema({
        tempMessage:{
            "0": String,
        }

    })

    return AlarmSchema;
}

module.exports = Schema;