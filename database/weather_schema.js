var Schema = { };

Schema.createSchema = function(mongoose){
    var WeatherSchema = mongoose.Schema({
        temperature: Number,
        fine_dust: Number,
        wind: Number,
        rain: Number,
        time: Date
        //YYYY-HH-MM 00:00 AM
    })
    return WeatherSchema;
}


//module.exports에 UserSchema 객체 직접 할당. 
module.exports = Schema;