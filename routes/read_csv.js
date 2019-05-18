const csvToJson = require('convert-csv-to-json');


var load_csv_location = ((function() {
    let fileInputName = './location.csv';

    
    this.location_data = csvToJson.getJsonFromCsv(fileInputName);

    return this;
}))();

module.exports = load_csv_location;